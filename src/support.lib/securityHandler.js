const securityHandler = function(tokenHandler, roleCheckHandler) {
    this.tokenHandler = tokenHandler;
    this.roleCheckHandler = roleCheckHandler;
};

securityHandler.prototype.enforce = function(middleware, config) {
    let mechanism = "default";
    if (config && config.mechanism) {
        mechanism = config.mechanism;
    }

    if (mechanism === "none") {
        return this.enforceNone(middleware);
    }

    return this.enforceDefault(middleware, config.roles);
};

securityHandler.prototype.enforceNone = function(middleware) {
    return (req, res, next) => {
        middleware(req, res, next);
    };
};

securityHandler.prototype.enforceDefault = function(middleware, roles) {
    return (req, res, next) => {
        this.tokenHandler.tokenCheck(req, res, (err) => {
            if (err) {
                next(err);
            } else {
                this.roleCheckHandler.enforceRoles(middleware, roles)(req, res, next);
            }
        });
    };
};

module.exports = function(tokenHandler, roleCheckHandler) {
    if (!tokenHandler) {
        tokenHandler = require("./tokenHandler")();
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require("./roleCheckHandler")();
    }

    return new securityHandler(tokenHandler, roleCheckHandler);
};