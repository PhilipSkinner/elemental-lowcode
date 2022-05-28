const passcode = function(provider, tokenHandler, totpHelper, certProvider) {
    this.provider       = provider;
    this.tokenHandler   = tokenHandler;
    this.totpHelper     = totpHelper;
    this.certProvider   = certProvider;

    this.totpSettings = {
        time : 5,
        window : 60
    };
};

passcode.prototype._generateString = function(resource, token) {
    return `${resource}-${this.certProvider.fetchPrivateSigningKey()}`;
};

passcode.prototype.generatePasscode = function(req, res, next) {
    new Promise((resolve, reject) => {
        this.tokenHandler.tokenCheck(req, res, (err) => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    }).then(() => {
        let resource = req.body.resource;
        let token = req.headers.authorization;

        if (typeof(resource) === 'undefined' || resource === null) {
            res.status(400);
            res.send({
                errors : [
                    "Resource is required when generating a passcode"
                ]
            });
            res.end();
            return;
        }

        //we extract information from the token to generate our totp from
        const totp = this.totpHelper.generateTotp(this._generateString(resource, token), this.totpSettings);

        res.send(totp);
        res.end();
    }).catch((err) => {
        res.status(500);
        res.send({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

passcode.prototype.validatePasscode = function(req, res, next) {
    let resource = req.body.resource;
    let code = req.body.code;
    let token = req.headers.authorization;

    if (typeof(resource) === 'undefined' || resource === null) {
        res.status(400);
        res.send({
            errors : [
                "Resource is required when validating a passcode"
            ]
        });
        res.end();
        return;
    }

    if (typeof(code) === "undefined" || code === null) {
        res.status(400);
        res.send({
            errors : [
                "Code is required when validating a passcode"
            ]
        });
        res.end();
        return;
    }

    //we extract information from the token to generate our totp from
    const valid = this.totpHelper.verifyTotp(this._generateString(resource, token), `${code}`, this.totpSettings);

    if (valid) {
        res.status(204);
        res.end();
        return;
    }

    res.status(401);
    res.end();
    return;
};

module.exports = function(provider, tokenHandler, totpHelper, certProvider) {
    if (!tokenHandler) {
        tokenHandler = require("../../../support.lib/tokenHandler")();
    }

    if (!totpHelper) {
        totpHelper = require("../helpers/totpHelper")();
    }

    if (!certProvider) {
        certProvider = require("../../../support.lib/certProvider")();
    }

    return new passcode(provider, tokenHandler, totpHelper, certProvider);
};