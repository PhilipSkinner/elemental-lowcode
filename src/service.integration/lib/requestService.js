const requestService = function(request, stringParser, environmentService) {
    this.request            = request;
    this.stringParser       = stringParser;
    this.environmentService = environmentService;
};

requestService.prototype._addHttpBasic = function(req, requestConfig, variables) {
    const secrets = this.environmentService.listSecrets();

    let username = this.stringParser.detectValues(requestConfig.authentication.config.username, {
        variables   : variables,
        secrets     : secrets
    }, {}, false);
    let password = this.stringParser.detectValues(requestConfig.authentication.config.password, {
        variables : variables,
        secrets     : secrets
    }, {}, false);

    const encoded = Buffer.from(`${username}:${password}`).toString('base64');

    req.headers = req.headers || {};
    req.headers.Authorization = `Basic ${encoded}`;

    return Promise.resolve(req);
};

requestService.prototype._addAuthentication = function(req, requestConfig, variables) {
    if (!requestConfig.authentication) {
        return Promise.resolve(req);
    }

    if (requestConfig.authentication.mechanism === "http_basic") {
        return this._addHttpBasic(req, requestConfig, variables);
    }

    return Promise.resolve(req);
};

requestService.prototype.sendRequest = function(requestConfig, variables) {
    const req = {
        method  : requestConfig.method,
        uri     : this.stringParser.detectValues(requestConfig.uri, {
            variables : variables
        }, {}, false),
    };

    return this._addAuthentication(req, requestConfig, variables).then((req) => {
        return new Promise((resolve, reject) => {
            this.request(req, (err, res) => {
                if (err) {
                    return reject(err);
                }

                return resolve(res);
            });
        });
    });
};

module.exports = function(request, stringParser, environmentService) {
    if (!request) {
        request = require("request");
    }

    if (!stringParser) {
        stringParser = require("../../support.lib/dataResolver")();
    }

    if (!environmentService) {
        environmentService = require("../../support.lib/environmentService")();
    }

    return new requestService(request, stringParser, environmentService);
};