const configProvider = function(glob, path, fs, jose, userDB, db) {
	this.glob = glob;
	this.path = path;
	this.fs = fs;
	this.jose = jose;
	this.userDB = userDB;
	this.db = db;
};

configProvider.prototype.getClients = function(dir) {
	return new Promise((resolve, reject) => {
		this.glob(this.path.join(process.cwd(), dir, "**/*.client.json"), (err, files) => {
			const allConfig = [];

			const doNext = () => {
				return new Promise((res, rej) => {
					if (files.length === 0) {
						return res();
					}

					const clientFile = files.pop();

					this.fs.readFile(clientFile, (err, data) => {
						if (err) {
							return rej(err);
						}

						let config = null;
						try {
							config = JSON.parse(data.toString("utf8"));
						} catch(e) {
							return rej(new Error(`Cannot read client config ${clientFile}`));
						}

						return res(config);
					});
				}).then((config) => {
					if (!config) {
						return Promise.resolve();
					}

					allConfig.push(config);
					return doNext();
				});
			};

			if (typeof(files) === "undefined" || files === null) {
				return resolve(allConfig);
			}

			return doNext().then(() => {
				return resolve(allConfig);
			}).catch(reject);
		});
	});
};

configProvider.prototype.getScopes = function(dir) {
	return new Promise((resolve, reject) => {
		this.glob(this.path.join(process.cwd(), dir, "**/*.scope.json"), (err, files) => {
			const allConfig = [];

			const doNext = () => {
				return new Promise((res, rej) => {
					if (files.length === 0) {
						return res();
					}

					const scopeFile = files.pop();

					this.fs.readFile(scopeFile, (err, data) => {
						if (err) {
							return rej(err);
						}

						let config = null;
						try {
							config = JSON.parse(data.toString("utf8"));
						} catch(e) {}

						if (config === null) {
							return rej(new Error(`Cannot read scope config ${scopeFile}`));
						}

						return res(config);
					});
				}).then((config) => {
					if (!config) {
						return Promise.resolve();
					}

					allConfig.push(config);
					return doNext();
				});
			};

			if (typeof(files) === "undefined" || files === null) {
				return resolve(allConfig);
			}

			return doNext().then(() => {
				return resolve(allConfig);
			}).catch(reject);
		});
	});
};

configProvider.prototype.generateAdminClient = function(secret) {
	return Promise.resolve({
		client_id		: "elemental_admin",
		client_secret	: secret,
		scope 			: "openid roles",
		redirect_uris	: [
			"http://localhost:8002/auth"
		]
	});
};

configProvider.prototype.addJwks = function() {
	return new Promise((resolve, reject) => {
		const keystore = new this.jose.JWKS.KeyStore();

		keystore.add(this.jose.JWK.asKey({
			key : process.env.SIG,
			format : "pem",
			type : "pkcs8"
		}));

		return resolve(keystore.toJWKS(true));
	});
};

configProvider.prototype.addCookies = function() {
	return new Promise((resolve, reject) => {
		let secretOne = [1,1,1,1,1,1,1].map(() => { return Math.random().toString(36); }).join("").replace(/[^a-z]+/g, "");
		let secretTwo = [1,1,1,1,1,1,1].map(() => { return Math.random().toString(36); }).join("").replace(/[^a-z]+/g, "");

		return resolve({
			keys : [secretOne]
		});
	});
};

configProvider.prototype.addAdapter = function() {
	return new Promise((resolve, reject) => {
		this.db.connect().then(() => {
			return resolve(this.db);
		});
	});
};

configProvider.prototype.fetchConfig = function(dir, secret) {
	const config = {
		formats: {
			AccessToken			: "jwt",
			IdentityToken 		: "jwt",
			ClientCredentials 	: "jwt"
		},
		conformIdTokenClaims : false,
		features : {
			devInteractions : {
				enabled : false
			},
			clientCredentials : {
				enabled : true
			}
		},
		scopes : [
			"openid",
			"offline_access",
			"roles"
		],
		claims : {
			acr: null,
			auth_time: null,
			iss: null,
			openid: [
				"sub",
				"email"
			],
			roles : [
				"role",
				"roles"
			],
			sid: null
		}
	};

	return this.getClients(dir).then((clients) => {
		config.clients = clients;
		return this.getScopes(dir);
	}).then((scopes) => {
		//mix those scopes in
		scopes.forEach((scope) => {
			config.scopes.push(scope.name);
			config.claims[scope.name] = scope.claims;
		});
		return this.generateAdminClient(secret);
	}).then((adminClient) => {
		config.clients.push(adminClient);
		return this.addJwks();
	}).then((jwks) => {
		config.jwks = jwks;
		return this.addCookies();
	}).then((cookies) => {
		config.cookies = cookies;
		return this.addAdapter();
	}).then((adapter) => {
		config.adapter = adapter;

		//add our account options
		config.findAccount = this.userDB.findAccount;
		config.extraAccessTokenClaims = this.userDB.extraAccessTokenClaims(config.clients);
		return Promise.resolve(config);
	});
};

module.exports = function(glob, path, fs, jose, keygrip, userDB, db) {
	if (!glob) {
		glob = require("glob");
	}

	if (!path) {
		path = require("path");
	}

	if (!fs) {
		fs = require("fs");
	}

	if (!jose) {
		jose = require("jose");
	}

	if (!userDB) {
		userDB = require("./account")();
	}

	if (!db) {
		db = require("../../shared/db")();
	}

	return new configProvider(glob, path, fs, jose, userDB, db);
};