const rulesInstance = function(app, definition, ajv, comparitorService, securityHandler) {
    this.app = app;
    this.definition = definition;
    this.ajv = ajv;
    this.comparitorService = comparitorService;
    this.securityHandler = securityHandler;
};

rulesInstance.prototype.executeRules = function(req, res) {
    //validate the facts
    let validator = this.ajv.compile(this.definition.facts);

    if (!validator(req.body)) {
        res.status(422);
        res.json({
            errors : validator.errors
        });
        res.end();
        return;
    }

    let done = false;
    //run through our executors
    this.definition.rules.forEach((rule) => {
        if (!done && this.comparitorService.evaluate(req.body, rule.comparitors)) {
            done = true;
            //return the output
            res.json(rule.output);
            res.end();
            return;
        }
    });

    if (done) {
        return;
    }

    res.status(400);
    res.json(null);
    res.end();
    return;
};

rulesInstance.prototype.init = function() {
    return new Promise((resolve) => {
        let execRoles = [
            "system_admin",
            "system_exec",
            "rules_exec",
            `${this.definition.name}_exec`
        ];

        if (this.definition.roles) {
            if (this.definition.roles.replace) {
                if (this.definition.roles.replace.exec) {
                    execRoles = ["system_admin"];
                }
            }

            if (this.definition.roles.exec) {
                execRoles = execRoles.concat(this.definition.roles.exec);
            }

            if (this.definition.roles.needsRole) {
                if (this.definition.roles.needsRole.exec === false) {
                    execRoles = null;
                }
            }
        }

        console.log(`Hosting ${this.definition.name} on /${this.definition.name}`);
        this.app.post(`/${this.definition.name}`, this.securityHandler.enforce(this.executeRules.bind(this), {
            mechanism       : this.definition.security ? this.definition.security.mechanism : null,
            roles           : execRoles
        }));
        return resolve();
    });
};

module.exports = function(app, definition, ajv, comparitorService, securityHandler) {
    if (!ajv) {
        ajv = require("ajv")({
            allErrors : true
        });
    }

    if (!comparitorService) {
        comparitorService = require("./comparitorService")();
    }

    if (!securityHandler) {
        securityHandler = require("../../support.lib/securityHandler")();
    }

    return new rulesInstance(app, definition, ajv, comparitorService, securityHandler);
};