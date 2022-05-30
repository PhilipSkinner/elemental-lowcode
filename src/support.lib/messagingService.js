const messagingService = function(request, hostnameResolver) {
    this.request 			= request;
    this.hostnameResolver 	= hostnameResolver;
};

messagingService.prototype.setAuthClientProvider = function(authClientProvider) {
    this.authClientProvider = authClientProvider;
};

messagingService.prototype._getToken = function(authToken) {
    return new Promise((resolve, reject) => {
        if (authToken) {
            return resolve(authToken);
        }

        if (this.authClientProvider) {
            return this.authClientProvider.getAccessToken().then((token) => {
                return resolve(token);
            }).catch(reject);
        }

        return resolve("");
    });
};

messagingService.prototype.queueMessage = function(queueName, message, authToken) {
    return this._getToken(authToken).then((token) => {
        return new Promise((resolve, reject) => {
            this.request.post(`${this.hostnameResolver.resolveQueue()}/${queueName}`, {
                body : JSON.stringify(message),
                headers : {
                    "content-type" : "application/json",
                    Authorization : `Bearer ${token}`
                }
            }, (err, res) => {
                if (err) {
                    return reject(err);
                }

                if (res.statusCode === 201) {
                    return resolve(res.headers.location.split("/").slice(-1)[0]);
                }

                return reject(new Error("Invalid response received"));
            });
        });
    });
};

messagingService.prototype.getMessage = function(queueName, id, authToken) {
    return this._getToken(authToken).then((token) => {
        return new Promise((resolve, reject) => {
            this.request.get(`${this.hostnameResolver.resolveQueue()}/${queueName}/${id}`, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }, (err, res) => {
                if (err) {
                    return reject(err);
                }

                if (res.statusCode === 201) {
                    return resolve(res.headers.location.split("/").slice(-1)[0]);
                }

                return reject(new Error("Invalid response received"));
            });
        });
    });
};

messagingService.prototype.deleteMessage = function(queueName, id, authToken) {
    return this._getToken(authToken).then((token) => {
        return new Promise((resolve, reject) => {
            this.request.delete(`${this.hostnameResolver.resolveQueue()}/${queueName}/${id}`, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }, (err, res) => {
                if (err) {
                    return reject(err);
                }

                if (res.statusCode === 201) {
                    return resolve(res.headers.location.split("/").slice(-1)[0]);
                }

                return reject(new Error("Invalid response received"));
            });
        });
    });
};

module.exports = function(request, hostnameResolver) {
    if (!request) {
        request = require("request");
    }

    if (!hostnameResolver) {
        hostnameResolver = require("./hostnameResolver")();
    }

    return new messagingService(request, hostnameResolver);
};