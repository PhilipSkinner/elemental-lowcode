const tokenHandler = function(config, jwt, hostnameResolver, request, jwkToPem) {
    this.config = config || {
        ignore : []
    };
    this.jwt = jwt;
    this.pubKey = null;
    this.request = request;
    this.jwkToPem = jwkToPem;
    this.hostnameResolver = hostnameResolver;

    //we trust both our internal idp and our external one
    this.fetchPublicKeys(`${hostnameResolver.resolveIdentity()}/.well-known/openid-configuration`);
    this.fetchPublicKeys(`${hostnameResolver.resolveExternalIdentity()}/.well-known/openid-configuration`);

    this.publicKeys = {};
};

tokenHandler.prototype.getJwksEndpoint = function(uri) {
    return new Promise((resolve) => {
        this.request.get(uri, (err, response, body) => {
            let endpointUrl = null;

            try {
                const payload = JSON.parse(body);
                endpointUrl = payload["jwks_uri"];
            } catch(e) {
                //ignored on purpose
            }

            return resolve(endpointUrl);
        });
    });
};

tokenHandler.prototype.fetchPublicKeys = function(uri) {
    return this.getJwksEndpoint(uri).then((endpoint) => {
        return new Promise((resolve, reject) => {
            if (endpoint === null) {
                setTimeout(() => {
                    this.fetchPublicKeys(uri).then(resolve).catch(reject);
                }, 500);
                return;
            }

            this.request.get(endpoint, (err, response, body) => {
                let done = false;
                try {
                    const payload = JSON.parse(body);
                    payload.keys.forEach((key) => {
                        this.publicKeys[key.kid] = this.jwkToPem(key);
                    });
                    done = true;
                } catch(e) {
                    //ignored on purpose
                }

                if (done === false) {
                    setTimeout(() => {
                        this.fetchPublicKeys(uri).then(resolve).catch(reject);
                    }, 500);
                    return;
                }

                return resolve();
            });
        });
    });
};

tokenHandler.prototype.tokenCheck = function(req, res, next) {
    //is this in our ignore list?
    let shouldIgnore = false;
    this.config.ignore.forEach((reg) => {
        if (reg.test(req.path)) {
            shouldIgnore = true;
        }
    });

    if (shouldIgnore) {
        next();
        return;
    }

    let token = req.headers["x-access-token"] || req.headers["authorization"] || "";

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    if (token) {
        this.verifyToken(token).then((decoded) => {
            req.decoded = decoded;
            next();
            return;
        }).catch((err) => {
            console.error("Invalid bearer token received on", req.path);
            console.error(err);
            res.status(401);
            res.end();
            return;
        });
    } else {
        res.status(401);
        res.end();
        return;
    }
};

tokenHandler.prototype.verifyToken = function(token, skipRetry) {
    return new Promise((resolve, reject) => {
        let parts = token.split(".");
        let headers = JSON.parse(Buffer.from(parts[0], "base64").toString("utf8"));

        if (typeof(headers.alg) === "undefined" || headers.alg === null || headers.alg === "") {
            return reject(new Error("Undefined or empty algorithm detected in token headers"));
        }

        this.jwt.verify(token, this.publicKeys[headers.kid], { algorithms: [headers.alg] }, (err, decoded) => {
            if (err) {
                if (skipRetry) {
                    return reject(err);
                }

                //refresh our metadata then retry
                return Promise.all([
                    this.fetchPublicKeys(`${this.hostnameResolver.resolveIdentity()}/.well-known/openid-configuration`),
                    this.fetchPublicKeys(`${this.hostnameResolver.resolveExternalIdentity()}/.well-known/openid-configuration`)
                ]).then(() => {
                    return this.verifyToken(token, true);
                }).then(resolve).catch(reject);
            }

            return resolve(decoded);
        });
    });
};

module.exports = function(config, jwt, hostnameResolver, request, jwkToPem) {
    if (!jwt) {
        jwt = require("jsonwebtoken");
    }

    if (!hostnameResolver) {
        hostnameResolver = require("./hostnameResolver")();
    }

    if (!request) {
        request = require("request");
    }

    if (!jwkToPem) {
        jwkToPem = require("jwk-to-pem");
    }

    return new tokenHandler(config, jwt, hostnameResolver, request, jwkToPem);
};