const authClientProvider = function(config, request, hostnameResolver) {
    this.config 			= config;
    this.request 			= request;
    this.hostnameResolver 	= hostnameResolver;
};

authClientProvider.prototype.setSessionState = function(sessionState) {
    this.sessionState = sessionState;
};

authClientProvider.prototype.setNavigationService = function(navigationService) {
    this.navigationService = navigationService;
}

authClientProvider.prototype.loginUser = function(username, password) {
    return new Promise((resolve, reject) => {
        this.request.post(`${this.hostnameResolver.resolveIdentity()}/token`, {
            form : {
                grant_type 		: "password",
                username 		: username,
                password 		: password,
                scope 			: this.config.scope,
                client_id 		: this.config.client_id,
                client_secret 	: this.config.client_secret,
            }
        }, (err, res, body) => {
            if (err) {
                return reject(err);
            }

            if (res.statusCode === 200) {
                //parse the payload
                let payload = null;
                try {
                    payload = JSON.parse(body);
                } catch(e) {
                    return reject(new Error("Error parsing token response"));
                }

                //set our sessions access token
                this.sessionState.setAccessToken(payload.access_token);

                //and our identity
                this.sessionState.setIdentityToken(payload.id_token);

                //finally, our refresh token
                this.sessionState.setRefreshToken(payload.refresh_token);

                //and resolve
                return resolve();
            }

            return reject(new Error("Invalid credentials"));
        });
    });
};

authClientProvider.prototype.logoutUser = function(redirectTo) {
    let url = `${this.hostnameResolver.resolveIdentity()}/session/end?`;

    if (redirectTo) {
        if (redirectTo.indexOf("/") === 0) {
            redirectTo = `${this.hostnameResolver.resolveInterface()}${redirectTo}`;
        }

        url = `${url}post_logout_redirect_uri=${encodeURIComponent(redirectTo)}&`;
    }

    let idToken = this.sessionState && this.sessionState.getIdentityToken ? this.sessionState.getIdentityToken() : null;

    if (idToken) {
        url = `${url}id_token_hint=${encodeURIComponent(idToken)}&`;
    }

    if (this.sessionState && this.sessionState.wipeSession) {
        this.sessionState.wipeSession();
    }

    if (this.navigationService && this.navigationService.navigateTo) {
        this.navigationService.navigateTo(url);
    }
};

authClientProvider.prototype.tokenExpired = function(token) {
    if (token === null || typeof(token) === "undefined" || token.replace(/ /g, "") === "") {
        return true;
    }

    if (token.split(".").length != 3) {
        return true;
    }

    let claims = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));

    if (typeof(claims.exp) !== "undefined" && claims.exp !== null && claims.exp > 0) {
        const currentEpoch = Math.floor(new Date() / 1000);

        //allow for 60 seconds
        if (claims.exp > currentEpoch + 60) {
            return false;
        }

        //it has expired
        return true;
    }

    return false;
};

authClientProvider.prototype.refreshUserToken = function() {
    let refreshToken = this.sessionState && this.sessionState.getRefreshToken ? this.sessionState.getRefreshToken() : null;

    if (!refreshToken) {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        this.request.post(`${this.hostnameResolver.resolveIdentity()}/token`, {
            form : {
                grant_type 		: "refresh_token",
                refresh_token 	: refreshToken,
                scope 			: this.config.scope,
                client_id 		: this.config.client_id,
                client_secret 	: this.config.client_secret
            }
        }, (err, response, body) => {
            if (err) {
                return reject(err);
            }

            if (response.statusCode === 200) {
                let data = null;
                try {
                    data = JSON.parse(body);
                } catch(e) {
                    return reject(new Error("Error parsing refresh token response"));
                }

                if (data) {
                    if (data.access_token) {
                        this.sessionState.setAccessToken(data.access_token);
                    }

                    if (data.id_token) {
                        this.sessionState.setIdentityToken(data.id_token);
                    }

                    if (data.access_token) {
                        this.sessionState.setRefreshToken(data.refresh_token);
                    }
                }

                return resolve(this.sessionState.getAccessToken());
            }

            return reject(new Error("Error refreshing user access token"));
        });
    });
};

authClientProvider.prototype.getAccessToken = function() {
    let token = this.sessionState && this.sessionState.getAccessToken ? this.sessionState.getAccessToken() : null;

    if (token) {
        //has the token expired?
        if (this.tokenExpired(token)) {
            return this.refreshUserToken();
        }

        return Promise.resolve(token);
    }

    if (!this.config) {
        return Promise.resolve("");
    }

    return new Promise((resolve, reject) => {
        this.request.post(`${this.hostnameResolver.resolveIdentity()}/token`, {
            form : {
                grant_type 		: "client_credentials",
                scope 			: this.config.scope,
                client_id 		: this.config.client_id,
                client_secret 	: this.config.client_secret
            }
        }, (err, response, body) => {
            if (err) {
                return reject(err);
            }

            if (response.statusCode === 200) {
                let data = null;
                try {
                    data = JSON.parse(body);
                } catch(e) {
                    return reject(new Error("Error parsing token response"));
                }

                if (data && data.access_token) {
                    return resolve(data.access_token);
                }
            }


            return resolve("");
        });
    });
};

module.exports = function(config, request, hostnameResolver) {
    if (!request) {
        request = require("request");
    }

    if (!hostnameResolver) {
        hostnameResolver = require("./hostnameResolver")();
    }

    return new authClientProvider(config, request, hostnameResolver);
};