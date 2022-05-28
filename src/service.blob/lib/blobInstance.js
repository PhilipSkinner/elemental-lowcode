const blobInstance = function(config, filesystemProvider, tokenHandler, hostnameResolver) {
    this.config             = config;
    this.filesystemProvider = filesystemProvider;
    this.tokenHandler       = tokenHandler;
    this.hostnameResolver   = hostnameResolver;
};

blobInstance.prototype.init = function() {
    return new Promise((resolve, reject) => {
        this.provider = null;

        if (this.config.mechanism.type === "filesystem") {
            this.provider = this.filesystemProvider;
        }

        if (this.provider === null) {
            return reject(new Error('Unknown storage mechanism configured'));
        }

        return this.provider.init(this.config).then(resolve).catch(reject);
    });
};

blobInstance.prototype.requiresToken = function(method) {
    return this.config.security[method].require_token;
};

blobInstance.prototype.supportPasscode = function(method) {
    return this.config.security[method].support_passcode;
}

blobInstance.prototype.handleRequest = function(req, res, next) {
    let handled = false;

    new Promise((resolve, reject) => {
        if (this.supportPasscode(req.method) && typeof(req.query.code) !== "undefined" && req.query.code !== null) {
            return this.tokenHandler.passcodeCheck(`${this.hostnameResolver.resolveBlob()}/${this.config.name}${req.path}`, req.query.code).then((valid) => {
                if (valid) {
                    return resolve();
                }

                res.status(401);
                res.end();
                handled = true;
                return reject(new Error("Passcode is invalid"));
            })
        }

        if (!this.requiresToken(req.method)) {
            return resolve();
        }

        this.tokenHandler.tokenCheck(req, res, (err) => {
            if (err) {
                handled = true;
                return reject(err);
            }

            return resolve();
        });
    }).then(() => {
        if (req.method === 'GET') {
            return this.provider.getDetails(this.config, req.path).then((resource) => {
                if (req.headers.accept !== 'application/json' && resource.type === 'file') {
                    return this.provider.get(this.config, req.path).then((data) => {
                        res.status(200);
                        res.header('Content-type', resource.mime_type);

                        if (req.query.disposition === 'inline') {
                            res.header('Content-Disposition', 'inline');
                        }

                        if (req.query.disposition === 'attachment') {
                            res.header('Content-Disposition', `attachment; filename=${resource.name}`);
                        }

                        res.send(data);
                        res.end();
                    });
                }

                res.status(200);
                res.send(resource);
                res.end();
            });
        } else if (req.method === 'POST' || req.method === 'PUT') {
            if (req.files && req.files.file && req.files.file.data) {
                return this.provider.put(this.config, req.path, req.files.file.data).then((resource) => {
                    if (req.method === 'POST') {
                        res.status(201);
                    }

                    if (req.method === 'PUT') {
                        res.status(204);
                    }

                    res.end();
                });
            }

            //we're creating a new path
            return this.provider.createFolder(this.config, req.path).then((folder) => {
                res.status(201);
                res.end();
            });
        } else if (req.method === 'DELETE') {
            return this.provider.delete(this.config, req.path).then(() => {
                res.status(204);
                res.end();
            });
        } else {
            res.status(400);
            res.end();
        }
    }).catch((err) => {
        if (!handled) {
            res.status(500);
            res.json({
                errors : [
                    err.toString()
                ]
            });
            res.end();
        }
    });
};

module.exports = function(config, filesystemProvider, tokenHandler, hostnameResolver) {
    if (!filesystemProvider) {
        filesystemProvider = require('./providers/filesystem')();
    }

    if (!tokenHandler) {
        tokenHandler = require("../../support.lib/tokenHandler")();
    }

    if (!hostnameResolver) {
        hostnameResolver = require("../../support.lib/hostnameResolver")();
    }

    return new blobInstance(config, filesystemProvider, tokenHandler, hostnameResolver);
};