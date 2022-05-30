const integrationService = function(request, hostnameResolver) {
    this.request 			= request;
    this.hostnameResolver 	= hostnameResolver;
};

integrationService.prototype.setAuthClientProvider = function(authClientProvider) {
    this.authClientProvider = authClientProvider;
};

integrationService.prototype.callIntegration = function(name, method, params, authToken) {
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
    }).then((token) => {
        return new Promise((resolve, reject) => {
            this.request[method](`${this.hostnameResolver.resolveIntegration()}/${name}`, {
                qs : params,
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }, (err, res, body) => {
                if (err) {
                    return reject(err);
                }

                try {
                    return resolve(JSON.parse(body));
                } catch(e) {
                    return reject(new Error("Invalid response received from integration call"));
                }
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

    return new integrationService(request, hostnameResolver);
};