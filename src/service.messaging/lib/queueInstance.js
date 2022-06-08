const queueInstance = function(
    app,
    definition,
    roleCheckHandler,
    sqlQueueProvider,
    uuid,
    serviceProvider,
    storageService,
    integrationService,
    rulesetService,
    idmService,
    authClientProvider,
    messagingService,
    ajv,
    environmentService,
    dataResolver,
    locationService
) {
    this.app                    = app;
    this.definition             = definition;
    this.roleCheckHandler       = roleCheckHandler;
    this.dataResolver           = dataResolver;
    this.environmentService     = environmentService;

    if (this.definition && this.definition.storageEngine === "sql") {
        //resolve our values
        this.definition.connectionString = this.dataResolver.detectValues(this.definition.connectionString, {
            secrets : this.environmentService.listSecrets()
        }, {}, true);

        if (typeof(this.definition.connectionString) !== "undefined" && this.definition.connectionString !== null && this.definition.connectionString !== "") {
            this.queueProvider = sqlQueueProvider(this.definition.connectionString);
        }
    }

    if (typeof(this.queueProvider) === "undefined" || this.queueProvider === null) {
        this.queueProvider = sqlQueueProvider(process.env.MYSQL_CONNECTION_STRING);
    }

    this.uuid                   = uuid;
    this.serviceProvider        = serviceProvider;
    this.storageService         = storageService;
    this.integrationService     = integrationService;
    this.rulesetService         = rulesetService;
    this.idmService             = idmService;
    this.authClientProvider     = authClientProvider;
    this.messagingService       = messagingService;
    this.locationService        = locationService;
    this.ajv                    = ajv;
};

queueInstance.prototype.queueMessage = function(req, res) {    
    let validator = this.ajv.compile(this.definition.incoming.schema);

    if (!validator(req.body)) {
        res.status(422);
        res.json({
            errors : validator.errors
        });
        res.end();
        return;
    }

    const id = this.uuid.v4();
    this.queueProvider.insertMessage(this.definition.name, id, {
        id      : id,
        queue   : this.definition.name,
        status  : "PENDING",
        request : req.body,
        result  : null,
        error   : null
    }).then(() => {
        res.status(201);
        res.location(`/${this.definition.name}/${id}`);
        res.end();
        return;
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
        return;
    });
};

queueInstance.prototype.getMessage = function(req, res) {
    return this.queueProvider.getMessage(this.definition.name, req.params.id).then((message) => {
        if (!message) {
            res.status(404);
            res.end();
            return;
        }

        res.json(message);
        res.status(200);
        res.end();
    }).catch(() => {
        res.status(404);
        res.end();
    });
};

queueInstance.prototype.deleteMessage = function(req, res) {
    return this.queueProvider.deleteMessage(this.definition.name, req.params.id).then(() => {
        res.status(204);
        res.end();
    }).catch(() => {
        res.status(404);
        res.end();
    });
};

queueInstance.prototype.setupEndpoints = function() {
    return new Promise((resolve) => {
        if (!(this.definition && this.definition.name)) {
            return resolve();
        }

        let roles = [
            "system_admin",
            "system_writer",
            "queue_writer",
            `${this.definition.name}_writer`
        ];

        if (this.definition.roles.replace === true) {
            roles = ["system_admin"];
        }

        if (this.definition.roles.roles) {
            roles = roles.concat(this.definition.roles.roles);
        }

        if (this.definition.roles.needsRole === false) {
            roles = null;
        }

        console.log(`Setting up POST /${this.definition.name}`);
        this.app.post(`/${this.definition.name}`,       this.roleCheckHandler.enforceRoles(this.queueMessage.bind(this), roles));
        console.log(`Setting up GET /${this.definition.name}/:id`);
        this.app.get(`/${this.definition.name}/:id`,    this.roleCheckHandler.enforceRoles(this.getMessage.bind(this), roles));
        console.log(`Setting up DELETE /${this.definition.name}/:id`);
        this.app.delete(`/${this.definition.name}/:id`, this.roleCheckHandler.enforceRoles(this.deleteMessage.bind(this), roles));

        return resolve();
    });
};

queueInstance.prototype.terminate = function() {
    console.log(`Terminating handler for ${this.definition.name} queue`);
    clearTimeout(this.timeout);
};

queueInstance.prototype.setupHandler = function() {
    if (!(this.definition && this.definition.name)) {
        return;
    }

    console.log(`Starting handler for ${this.definition.name} queue`);

    const runNext = () => {
        let hasMessage = false;
        this.queueProvider.getNextMessage(this.definition.name).then((message) => {
            if (!message) {
                return Promise.resolve();
            }

            console.log(`Processing message ${message.id} on ${this.definition.name}`);
            hasMessage = true;

            return this.queueProvider.markAsInProgress(this.definition.name, message.id).then(() => {
                let services = {
                    serviceProvider     : this.serviceProvider,
                    storageService      : this.storageService,
                    integrationService  : this.integrationService,
                    rulesetService      : this.rulesetService,
                    idmService          : this.idmService,
                    authClientProvider  : this.authClientProvider,
                    messagingService    : this.messagingService,
                    environmentService  : this.environmentService
                };

                Object.keys(services).forEach((prop) => {
                    const service = services[prop];
                    if (service && service.setAuthClientProvider) {
                        service.setAuthClientProvider(this.authClientProvider);
                    }
                });

                return this.definition.handler.apply(services, [message.request]);
            }).then((result) => {
                return this.queueProvider.markAsComplete(this.definition.name, message.id, result);
            }).catch((err) => {
                return this.queueProvider.markAsError(this.definition.name, message.id, err);
            });
        }).then(() => {
            if (hasMessage) {
                this.timeout = setTimeout(runNext.bind(this), 1);
            } else {
                this.timeout = setTimeout(runNext.bind(this), 2500);
            }
        });
    };

    runNext();

    return Promise.resolve();
};

queueInstance.prototype.init = function() {
    return this.setupEndpoints().then(() => {
        return this.setupHandler();
    });
};

module.exports = function(
    app,
    definition,
    roleCheckHandler,
    sqlQueueProvider,
    uuid,
    serviceProvider,
    storageService,
    integrationService,
    rulesetService,
    idmService,
    authClientProvider,
    messagingService,
    ajv,
    environmentService,
    dataResolver,
    locationService
) {
    if (!roleCheckHandler) {
        roleCheckHandler = require("../../support.lib/roleCheckHandler")();
    }

    if (!sqlQueueProvider) {
        sqlQueueProvider = require("./queues/sqlQueue");
    }

    if (!uuid) {
        uuid = require("uuid");
    }

    if (!serviceProvider) {
        serviceProvider = require("../../support.lib/iocProvider")();
    }

    if (!storageService) {
        storageService = require("../../support.lib/storageService")();
    }

    if (!integrationService) {
        integrationService = require("../../support.lib/integrationService")();
    }

    if (!rulesetService) {
        rulesetService = require("../../support.lib/ruleService")();
    }

    if (!idmService) {
        idmService = require("../../support.lib/idmService")();
    }

    if (!authClientProvider) {
        authClientProvider = require("../../support.lib/authClientProvider")(definition ? definition.client : null);
    }

    if (!messagingService) {
        messagingService = require("../../support.lib/messagingService")();
    }

    if (!ajv) {
        ajv = require("ajv")({
            allErrors : true
        });
    }

    if (!environmentService) {
        environmentService = require("../../support.lib/environmentService")();
    }

    if (!dataResolver) {
        dataResolver = require("../../support.lib/dataResolver")();
    }

    if (!locationService) {
        locationService = require("../../support.lib/locationService")();
    }

    return new queueInstance(
        app,
        definition,
        roleCheckHandler,
        sqlQueueProvider,
        uuid,
        serviceProvider,
        storageService,
        integrationService,
        rulesetService,
        idmService,
        authClientProvider,
        messagingService,
        ajv,
        environmentService,
        dataResolver,
        locationService
    );
};