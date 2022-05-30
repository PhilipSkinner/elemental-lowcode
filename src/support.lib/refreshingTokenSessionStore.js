const refreshingTokenSessionStore = function(sqlSessionStore, uuid, request) {
    this.sqlSessionStore = sqlSessionStore;
    this.uuid = uuid;
    this.request = request;
    this.bufferTime = 30;
};

refreshingTokenSessionStore.prototype.createSession = function(accessToken, idToken, refreshToken) {
    const sessionId = this.uuid.v4();

    this.sqlSessionStore.set(sessionId, {
        accessToken  : accessToken,
        idToken      : idToken,
        refreshToken : refreshToken
    }, (err) => {
        if (err) {
            console.error(err);
        }
    });

    return sessionId;
};

refreshingTokenSessionStore.prototype.refreshTokens = function(oauthProvider, scope, sessionId, session) {
    return new Promise((resolve, reject) => {
        this.request.post(`${oauthProvider.authorizationCode.config.auth.tokenHost}${oauthProvider.authorizationCode.config.auth.tokenPath}`, {
            form : {
                grant_type : "refresh_token",
                scope : scope,
                client_id : oauthProvider.authorizationCode.config.client.id,
                client_secret : oauthProvider.authorizationCode.config.client.secret,
                refresh_token : session.refreshToken
            }
        }, (err, response, body) => {
            if (response.statusCode !== 200) {
                //didn"t work, return the expired access token
                return resolve(session.accessToken);
            }

            const data = JSON.parse(body);

            session.accessToken = data.access_token;
            session.idToken = data.id_token;
            session.refreshToken = data.refresh_token;

            //persist the session
            this.sqlSessionStore.set(sessionId, session, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve(session.accessToken);
            });
        });
    });
};

refreshingTokenSessionStore.prototype.getToken = function(oauthProvider, scope, sessionId) {
    return new Promise((resolve) => {
        this.sqlSessionStore.get(sessionId, (err, session) => {
            if (err) {
                return resolve(null);
            }

            if (!session) {
                return resolve(null);
            }

            const payload = JSON.parse(Buffer.from(session.accessToken.split(".")[1], "base64").toString());

            if ((payload.exp * 1000) < (new Date() - 1 + (this.bufferTime * 1000) + 1) && session.refreshToken) {
                return this.refreshTokens(oauthProvider, scope, sessionId, session).then(resolve).catch((error) => {
                    console.log(error);
                    resolve(null);
                });
            }

            return resolve(session.accessToken);
        });
    });
};

refreshingTokenSessionStore.prototype.getIdToken = function(oauthProvider, scope, sessionId) {
    return new Promise((resolve) => {
        this.sqlSessionStore.get(sessionId, (err, session) => {
            if (err) {
                return resolve(null);
            }

            if (!session) {
                return resolve(null);
            }

            const payload = JSON.parse(Buffer.from(session.idToken.split(".")[1], "base64").toString());

            if ((payload.exp * 1000) < (new Date() - 1 + (this.bufferTime * 1000) + 1) && session.refreshToken) {
                return this.refreshTokens(oauthProvider, scope, sessionId, session).then(resolve).catch((error) => {
                    console.log(error);
                    resolve(null);
                });
            }

            return resolve(session.idToken);
        });
    });
};


module.exports = function(sqlSessionStore, uuid, request) {
    if (!sqlSessionStore) {
        sqlSessionStore = require("./sqlSessionStore")(null, process.env.MYSQL_CONNECTION_STRING, "__token_store__");
    }

    if (!uuid) {
        uuid = require("uuid");
    }

    if (!request) {
        request = require("request");
    }

    return new refreshingTokenSessionStore(sqlSessionStore, uuid, request);
};