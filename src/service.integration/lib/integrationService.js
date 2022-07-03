const integrationService = function(app, configReader, integrationInstance, securityHandler) {
    this.app = app;
    this.configReader = configReader;
    this.integrationInstance = integrationInstance;
    this.securityHandler = securityHandler;
    this.hostedEndpoints = [];
};

integrationService.prototype.constructInstance = function(name, config) {
    let instance = this.integrationInstance(name, config);
    let execRoles = [
        "system_admin",
        "system_exec",
        "integration_exec",
        `${name}_exec`
    ];

    if (config.roles) {
        if (config.roles.replace) {
            if (config.roles.replace.exec) {
                execRoles = ["system_admin"];
            }
        }

        if (config.roles.exec) {
            execRoles = execRoles.concat(config.roles.exec);
        }

        if (config.roles.needsRole) {
            if (config.roles.needsRole.exec === false) {
                execRoles = null;
            }
        }
    }

    console.log(`Starting ${config.method} ${name} on /${name}`);
    this.app[config.method](`/${name}`, this.securityHandler.enforce(instance.handler.bind(instance), {
        mechanism   : config.security ? config.security.mechanism : null,
        roles       : execRoles
    }));
    this.hostedEndpoints.push(`/${name}`);
};

integrationService.prototype.init = function(dir) {
    return this.configReader.readConfigFromDir(dir).then((config) => {
        //for each item lets boot up an integration instance
        Object.keys(config).forEach((integrationName) => {
            this.constructInstance(integrationName, config[integrationName]);
        });

        console.log("Discovery endpoint hosted");
        const discoveryRoles = [
            "system_admin",
            "system_reader",
            "integration_reader"
        ];
        //and add our discovery endpoint
        this.app.get("/", this.securityHandler.enforce((req, res, next) => {
            res.json({
                endpoints : this.hostedEndpoints
            });
            next();
            return;
        }, {
            mechanism   : config.security ? config.security.mechanism : null,
            roles       : discoveryRoles
        }));
    });
};

module.exports = function(app, configReader, integrationInstance, securityHandler) {
    if (!configReader) {
        configReader = require("./configReader")();
    }

    if (!integrationInstance) {
        //don"t exec as we don"t want this to be a singleton!
        integrationInstance = require("./integrationInstance");
    }

    if (!securityHandler) {
        securityHandler = require("../../support.lib/securityHandler")();
    }

    return new integrationService(app, configReader, integrationInstance, securityHandler);
};