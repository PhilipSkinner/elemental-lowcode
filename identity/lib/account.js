module.exports = function(db, bcrypt, uuid) {
	if (!db) {
		db = require("../../shared/db")();
	}

	if (!bcrypt) {
		bcrypt = require("bcrypt");
	}

	if (!uuid) {
		uuid = require("uuid").v4;
	}

	const userDB = new db("User");

	class Account {
		constructor(username, profile) {
			this.username = username;
			this.profile = profile;
			this.accountId = this.profile.subject || this.username;
		}

		async claims(use, scope) {
			let claims = {};

			if (this.profile && this.profile.claims) {
				claims = this.profile.claims;
			}

			return userDB.find(this.accountId).then((user) => {
				return Object.assign(claims, {
					sub : user && user.subject ? user.subject : this.accountId
				});
			});
		}

		static async findByLogin(login, password) {
			const user = await userDB.findByUsername(login);

			if (typeof(user) === "undefined" || user === null) {
				return null;
			}

			const isMatch = await Account.checkPassword(user.password, password);
			if (!isMatch) {
				return null;
			}

			return new Account(user.subject, user);
		}

		static async findAccount(ctx, id, token) {
			const user = await userDB.find(id);

			if (user === null || typeof(user) === "undefined") {
				return null;
			}

			return new Account(id, user);
		}

		static extraAccessTokenClaims(clients) {
			return async (ctx, token) => {
				if (token.accountId) {
					const user = await userDB.find(token.accountId);

					if (!user) {
						return {};
					}

					return {
						roles 	: user.claims && user.claims.roles ? user.claims.roles : [],
						sub 	: user.subject || this.accountId
					};
				}

				if (token.clientId && token.kind === "ClientCredentials") {
					//get the claims from the client
					return clients.reduce((claims, client) => {
						if (client.client_id === token.clientId) {
							claims.roles = client.roles;
						}
						return claims;
					}, {});
				}

				return {};
			};
		}

		static async checkPassword(hashed, plain) {
			return new Promise((resolve, reject) => {
				bcrypt.compare(plain, hashed, (err, result) => {
					if (err) {
						return reject(err);
					}

					return resolve(result);
				});
			});
		}

		static async generatePassword(plain) {
			return new Promise((resolve, reject) => {
				bcrypt.hash(plain, 10, (err, hash) => {
					if (err) {
						return reject(err);
					}

					return resolve(hash);
				});
			});
		}

		static async registerUser(username, password) {
			const user = await userDB.findByUsername(username);

			if (typeof(user) !== "undefined" && user !== null) {
				return null;
			}

			const hashed = await Account.generatePassword(password);
			const subject = uuid();

			await userDB.upsert(subject, {
				subject 	: subject,
				username	: username,
				password	: hashed,
				registered	: new Date(),
				claims		: {
					roles : []
				}
			});

			return await userDB.find(subject);
		}
	}

	return Account;
};