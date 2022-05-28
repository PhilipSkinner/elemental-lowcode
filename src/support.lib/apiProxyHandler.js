const apiProxyHandler = function(hostMappings, refreshingTokenSessionStore, request) {
    this.hostMappings = hostMappings;
    this.refreshingTokenSessionStore = refreshingTokenSessionStore;
    this.request = request;

    this.headerBlacklist = [
        "host",
        "connection",
        "cache-control",
        "pragma",
        "max-forwards",
        "referer",
        "x-forward-to",
        "x-forward-path",
        "sec-fetch-dest",
        "sec-fetch-mode",
        "sec-fetch-site",
        "x-waws-unencoded-url",
        "x-arr-log-id",
        "disguised-host",
        "x-site-deployment-id",
        "was-default-hostname",
        "x-original-url",
        "x-arr-ssl",
        "x-forwarded-proto",
        "x-appservice-proto",
        "x-forwarded-tlsversion"
    ];
};

apiProxyHandler.prototype.addTokens = function(res, tokens) {
    //add the session
    const sessionId = this.refreshingTokenSessionStore.createSession(
        tokens.access_token,
        tokens.id_token,
        tokens.refresh_token
    );

    res.clearCookie("session");
    res.cookie("session", sessionId);
};

apiProxyHandler.prototype.determineHostname = function(service) {
    return this.hostMappings[service];
};

apiProxyHandler.prototype.getRoles = function(oauthProvider, scope) {
    return (req, res, next) => {
        this.refreshingTokenSessionStore.getToken(oauthProvider, scope, req.cookies.session).then((token) => {
            if (token === null) {
                res.status(401);
                res.end();
                return;
            }

            const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

            let roles = [];

            if (payload.role) {
                roles = roles.concat(Array.isArray(payload.role) ? payload.role : [payload.role]);
            }

            if (payload.roles) {
                roles = roles.concat(Array.isArray(payload.roles) ? payload.roles : [payload.roles]);
            }

            res.json(roles);
        }).catch((err) => {
            next(err);
        });
    };
};

apiProxyHandler.prototype.rawBodyHandler = function(req, res, next) {
    var data = Buffer.alloc(0);
    req.rawBody = "";
    req.on("data", function(chunk) {
        data = Buffer.concat([data, Buffer.from(chunk)]);
    });
    req.on("end", function() {
        req.rawBody = data;
        next();
    });
};

apiProxyHandler.prototype.handler = function(oauthProvider, scope) {
    return (req, res, next) => {
        this.refreshingTokenSessionStore.getToken(oauthProvider, scope, req.cookies.session).then((token) => {
            if (token === null) {
                res.status(401);
                res.end();
                return;
            }

            const outgoingHeaders = {};
            Object.keys(req.headers).forEach((k) => {
                if (this.headerBlacklist.indexOf(k) === -1) {
                    outgoingHeaders[k] = req.headers[k];
                }
            });
            outgoingHeaders["Authorization"] = `Bearer ${token}`;

            this.request[req.method.toLowerCase()](`${this.determineHostname(req.headers["x-forward-to"])}${req.headers["x-forward-path"]}`, {
                headers : outgoingHeaders,
                body : req.rawBody && req.rawBody.length > 0 ? req.rawBody : undefined,
                encoding: null
            }, (err, response, body) => {
                if (err) {
                    res.status(500);
                    return;
                }

                res.status(response.statusCode);
                Object.keys(response.headers).forEach((k) => {
                    if (this.headerBlacklist.indexOf(k) === -1) {
                        res.header(k, response.headers[k]);
                    }
                });
                res.end(body);
            });
        }).catch((err) => {
            next(err);
        });
    };
};

module.exports = function(hostMappings, refreshingTokenSessionStore, request) {
    if (!refreshingTokenSessionStore) {
        refreshingTokenSessionStore = require("./refreshingTokenSessionStore")();
    }

    if (!request) {
        request = require("request");
    }

    return new apiProxyHandler(hostMappings, refreshingTokenSessionStore, request);
};