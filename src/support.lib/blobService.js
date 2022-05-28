const blobService = function(request, hostnameResolver, fs) {
    this.request            = request;
    this.hostnameResolver   = hostnameResolver;
    this.fs                 = fs;
    this.authClientProvider = null;
};

blobService.prototype.setAuthClientProvider = function(authClientProvider) {
    this.authClientProvider = authClientProvider;
};

blobService.prototype._getToken = function(authToken) {
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

blobService.prototype.details = function(storeName, path, authToken) {
    return this._getToken(authToken).then((token) => {
        return new Promise((resolve, reject) => {
            this.request.get(`${this.hostnameResolver.resolveBlob()}/${storeName}/${path}`, {
                headers : {
                    Authorization : `Bearer ${token}`,
                    Accept : 'application/json',
                }
            }, (err, res, body) => {
                if (err) {
                    return reject(err);
                }

                if (res.statusCode === 200) {
                    try {
                        return resolve(JSON.parse(body));
                    } catch(e) {}

                    return reject(new Error("Invalid response received"));
                }

                return reject(new Error(`Invalid status code returned: ${res.statusCode}`));
            });
        });
    });
};

blobService.prototype.upload = function(storeName, path, file, authToken) {
    return this._getToken(authToken).then((token) => {
        return new Promise((resolve, reject) => {
            this.request.put(`${this.hostnameResolver.resolveBlob()}/${storeName}/${path}`, {
                headers : {
                    Authorization : `Bearer ${token}`,
                },
                formData : {
                    file : this.fs.createReadStream(file.data.length > 0 ? file.data : file.tempFilePath)
                }
            }, (err, res) => {
                if (err) {
                    return reject(err);
                }

                if (res.statusCode === 204 || res.statusCode === 201) {
                    return resolve();
                }

                return reject(new Error(`Invalid status code returned: ${res.statusCode}`));
            });
        });
    });
};

blobService.prototype.download = function(storeName, path, authToken) {
    return this._getToken(authToken).then((token) => {
        return new Promise((resolve, reject) => {
            this.request.get(`${this.hostnameResolver.resolveBlob()}/${storeName}/${path}`, {
                headers : {
                    Authorization : `Bearer ${token}`,
                    Accept : 'application/octet-stream',
                }
            }, (err, res, body) => {
                if (err) {
                    return reject(err);
                }

                if (res.statusCode === 200) {
                    return resolve(body);
                }

                return reject(new Error(`Invalid status code returned: ${res.statusCode}`));
            });
        });
    });
};

blobService.prototype.delete = function(storeName, path, authToken) {
    return this._getToken(authToken).then((token) => {
        return new Promise((resolve, reject) => {
            this.request.delete(`${this.hostnameResolver.resolveBlob()}/${storeName}/${path}`, {
                headers : {
                    Authorization : `Bearer ${token}`,
                    Accept : 'application/json',
                }
            }, (err, res, body) => {
                if (err) {
                    return reject(err);
                }

                if (res.statusCode === 204) {
                    return resolve(body);
                }

                return reject(new Error(`Invalid status code returned: ${res.statusCode}`));
            });
        });
    });
};

module.exports = function(request, hostnameResolver, fs) {
    if (!request) {
        request = require("request");
    }

    if (!hostnameResolver) {
        hostnameResolver = require("./hostnameResolver")();
    }

    if (!fs) {
        fs = require("fs");
    }

    return new blobService(request, hostnameResolver, fs);
};