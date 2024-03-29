module.exports = function(db, bcrypt, uuid) {
    if (!db) {
        db = require("../../support.lib/db")();
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

        async claims() {
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

        static async findByUsername(username) {
            const user = await userDB.findByUsername(username);

            if (typeof(user) === "undefined" || user === null) {
                return null;
            }

            return new Account(user.subject, user);
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

        static async findAccount(ctx, id) {
            const user = await userDB.find(id);

            if (user === null || typeof(user) === "undefined") {
                return null;
            }

            return new Account(id, user);
        }

        static extraAccessTokenClaims(clients, allScopes) {
            const getAllClaims = async (ctx, token) => {
                let client = null;

                clients.forEach((_client) => {
                    if (_client.client_id == token.clientId) {
                        client = _client;
                    }
                });

                if (token.accountId) {
                    const user = await userDB.find(token.accountId);

                    if (!user) {
                        return {};
                    }

                    return Object.assign(client ? (client.user_claims || {}) : {}, Object.assign(user.claims || {}, {
                        subject : user.subject || this.accountId
                    }));
                }

                if (token.clientId && token.kind === "ClientCredentials") {
                    //get the claims from the client
                    return client ? client.client_claims : {};
                }

                return {};
            };

            return async (ctx, token) => {
                const claims = JSON.parse(JSON.stringify((await getAllClaims(ctx, token))));

                //now we filter out claims
                let canKeep = [];
                token.scopes.forEach((requestedScope) => {
                    if (typeof(allScopes[requestedScope]) !== "undefined" && allScopes[requestedScope] !== null) {
                        canKeep = canKeep.concat(allScopes[requestedScope]);
                    }
                });

                const toRemove = [];
                Object.keys(claims).forEach((name) => {
                    if (canKeep.indexOf(name) === -1) {
                        toRemove.push(name);
                    }
                });

                toRemove.forEach((rem) => {
                    delete(claims[rem]);
                });

                return claims;
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

        static async updateUser(id, user) {
            return await userDB.upsert(id, user);
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