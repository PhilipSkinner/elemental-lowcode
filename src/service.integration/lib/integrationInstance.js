const integrationInstance = function(name, config, requestService, jsonSchemaVerifier) {
    this.name = name;
    this.config = config;
    this.requestService = requestService;
    this.jsonSchemaVerifier = jsonSchemaVerifier;
};

integrationInstance.prototype.validateVariables = function(req) {
    let errors = [];

    if (this.config.queryParams) {
        errors = errors.concat(this.config.queryParams.map((v) => {
            if (v.name && v.required && typeof(req.query[v.name]) === "undefined") {
                return `Expected queryParam ${v.name} (${v.description}) but was not found`;
            }

            return null;
        }).reduce((s, a) => {
            if (a) {
                s.push(a);
            }
            return s;
        }, []));
    }

    if (this.config.body) {
        const verificationResponse = this.jsonSchemaVerifier.verify(this.config.body, JSON.stringify(req.body));

        if (verificationResponse.errors) {
            errors = errors.concat(verificationResponse.errors);
        }
    }

    return errors;
};

integrationInstance.prototype.generateVariables = function(req) {
    let variables = {};

    if (this.config.queryParams) {
        this.config.queryParams.forEach((v) => {
            if (v.name) {
                variables[v.name] = req.query[v.name];
            }
        });
    }

    if (this.config.body) {
        variables = Object.assign(variables, req.body);
    }

    return variables;
};

integrationInstance.prototype.handler = function(req, res, next) {
    //validate our variables
    let validationErrors = this.validateVariables(req);
    if (validationErrors.length > 0) {
        res.json({
            errors : validationErrors
        });
        next();
        return;
    }

    //generate our variables
    const variables = this.generateVariables(req);

    //construct send our request
    this.requestService.sendRequest(this.config.request, variables).then((thirdPartyResponse) => {
        //now we apply our response verification if defined
        let verificationResponse = null;
        if (this.config.request.schema) {
            if (this.config.request.schema.type === "JSON") {
                verificationResponse = this.jsonSchemaVerifier.verify(this.config.request.schema.value, thirdPartyResponse.body);
            }
        }

        if (verificationResponse.errors) {
            //not good
            res.json({
                errors : verificationResponse.errors
            });
            next();
            return;
        }

        //now we apply the transformer we were given
        let transformer = eval(this.config.transformer);
        let result = transformer(verificationResponse.data);

        res.json(result);
        next();
        return;
    });
};

module.exports = function(name, config, requestService, jsonSchemaVerifier) {
    if (!requestService) {
        requestService = require("./requestService")();
    }

    if (!jsonSchemaVerifier) {
        jsonSchemaVerifier = require("./jsonSchemaVerifier")();
    }

    return new integrationInstance(name, config, requestService, jsonSchemaVerifier);
};