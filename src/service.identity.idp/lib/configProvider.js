const configProvider = function(glob, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider) {
    this.glob 				= glob;
    this.path 				= path;
    this.fs 				= fs;
    this.jose 				= jose;
    this.userDB 			= userDB;
    this.db 				= db;
    this.hostnameResolver 	= hostnameResolver;
    this.bcrypt  			= bcrypt;
    this.certProvider 		= certProvider;
};

configProvider.prototype.getBannedPasswords = function(dir) {
    return new Promise((resolve) => {
        this.fs.readFile(this.path.join(process.cwd(), dir, "banned.passwords.json"), (err, data) => {
            if (err) {
                return resolve([]);
            }

            try {
                return resolve(JSON.parse(data));
            } catch(err) {
                //ignored on purpose
            }

            return resolve([]);
        });
    });
};

configProvider.prototype.getClients = function(dir, bannedPasswords) {
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

                    if (!config.grant_types) {
                        config.grant_types = [
                            "client_credentials",
                            "authorization_code",
                            "refresh_token"
                        ];
                    }

                    //add in our global banned passwords
                    config.features = config.features || {};
                    config.features.banned_passwords = config.features.banned_passwords || [];
                    config.features.banned_passwords = config.features.banned_passwords.concat(bannedPasswords);
                    config.redirect_uris = config.redirect_uris || ['http://ignore.me'];

                    if (config.redirect_uris.length === 0) {
                        config.redirect_uris.push('http://ignore.me');
                    }

                    config.response_types = [];

                    if (config.grant_types.indexOf("authorization_code") != -1) {
                        config.response_types.push("code");
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
                        } catch(e) {
                            config = null;
                        }

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
    let redirectUri = process.env.INITIAL_CLIENT_AUTH_REDIRECT || `${this.hostnameResolver.resolveAdmin()}/auth`;
    let logoutUri = process.env.INITIAL_CLIENT_LOGOUT_REDIRECT || `${this.hostnameResolver.resolveAdmin()}`;

    return Promise.resolve({
        client_id		: process.env.INITIAL_CLIENT_ID || "elemental_admin",
        client_secret	: process.env.INITIAL_CLIENT_SECRET || secret,
        scope 			: process.env.INITIAL_CLIENT_SCOPES || "openid roles offline_access",
        roles 			: process.env.INITIAL_ROLES ? process.env.INITIAL_ROLES.split(",") : [],
        features        : {
            registration : {
                enabled : false
            }
        },
        grant_types 	: [
            "authorization_code",
            "client_credentials",
            "refresh_token"
        ],
        redirect_uris	: [
            redirectUri
        ],
        post_logout_redirect_uris : [
            logoutUri
        ]
    });
};

configProvider.prototype.addJwks = function() {
    return new Promise((resolve) => {
        const keystore = new this.jose.JWKS.KeyStore();

        keystore.add(this.jose.JWK.asKey({
            key 	: this.certProvider.fetchPrivateSigningKey() + this.certProvider.fetchPublicSigningKey(),
            format 	: "pem",
            type 	: "pkcs8",
        }, {
            kid : process.env.SIGNING_CERT_KID
        }));

        return resolve(keystore.toJWKS(true));
    });
};

configProvider.prototype.addCookies = function() {
    return new Promise((resolve) => {
        let secretOne = process.env.COOKIE_KEY;

        if (!secretOne) {
            const crypto = require("node:crypto");
            secretOne = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(() => { 
                return crypto.randomInt(1000).toString(36); 
            }).join("").replace(/[^a-z]+/g, "");
        }

        return resolve({
            keys : [secretOne],
            long : {
                httpOnly: true,
                overwrite: true,
                sameSite: "lax",
                maxAge : 86400000
            },
            short : {
                httpOnly: true,
                overwrite: true,
                sameSite: "lax",
                maxAge : 3600000 * 6
            }
        });
    });
};

configProvider.prototype.addAdapter = function() {
    return new Promise((resolve, reject) => {
        this.db.connect().then(() => {
            return resolve(this.db);
        }).catch(reject);
    });
};

configProvider.prototype.setupDefaultUser = function() {
    return new Promise((resolve, reject) => {
        let username = process.env.INITIAL_USER_USERNAME;
        let password = process.env.INITIAL_USER_PASSWORD;
        let role = process.env.INITIAL_USER_ROLE;

        if (username && password) {
            const userDb = new this.db("User");
			
            this.bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }

                const id = "00000000-0000-0000-0000-000000000000";

                userDb.upsert(id, {
                    subject     : id,
                    username 	: username,
                    password 	: hash,
                    registered 	: new Date(),
                    claims 		: {
                        roles : [role]
                    }
                }).then(resolve).catch(reject);
            });						
        } else {
            return resolve();
        }
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
        },
        extraClientMetadata : {
            properties : [
                "features"
            ]
        },
        ttl : {
            AccessToken : () => {
                return 3600;
            },
            AuthorizationCode : 1800, // 30 minutes,
            Interaction : 86400, // 24 hours
        }
    };

    return this.getBannedPasswords(dir).then((passwords) => {
        return this.getClients(dir, passwords);
    }).then((clients) => {
        config.clients = clients;
        return this.getScopes(dir);
    }).then((scopes) => {
        //mix those scopes in
        scopes.forEach((scope) => {
            if (config.scopes.indexOf(scope.name) === -1) {
                config.scopes.push(scope.name);
            }

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
        return this.setupDefaultUser();
    }).then(() => {		
        config.renderError = async (ctx, out, error) => {
            if (
                [
                    "could not decode id_token_hint (invalid JWT.decode input)",
                    "post_logout_redirect_uri can only be used in combination with id_token_hint"
                ].indexOf(error.error_description) !== -1
            ) {
                ctx.res.status(302);
                ctx.res.location(ctx.req.query.post_logout_redirect_uri);
                return;
            }

            ctx.res.render("error", {
                error : error,
                title : "Error",
            });
        };

        config.logoutSource = async (ctx, form) => {
            ctx.res.render("logout", {
                form : form,
                host : ctx.host,
                title : "Logout"
            });
        };

        config.postLogoutSuccessSource = async (ctx) => {
            ctx.res.render("loggedOut", {
                title : "Logged Out"
            });
        };

        //add our account options
        config.findAccount = this.userDB.findAccount;
        config.extraAccessTokenClaims = this.userDB.extraAccessTokenClaims(config.clients, config.claims);
        return Promise.resolve(config);
    });
};

module.exports = function(glob, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider) {
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
        db = require("../../support.lib/db")();
    }

    if (!hostnameResolver) {
        hostnameResolver = require("../../support.lib/hostnameResolver")();
    }

    if (!bcrypt) {
        bcrypt = require("bcrypt");
    }

    if (!certProvider) {
        certProvider = require("../../support.lib/certProvider")();
    }

    return new configProvider(glob, path, fs, jose, userDB, db, hostnameResolver, bcrypt, certProvider);
};