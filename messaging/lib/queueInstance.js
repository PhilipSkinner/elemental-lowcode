const queueInstance = function(app, definition, roleCheckHandler, queueProvider, uuid, hostnameResolver, serviceProvider, storageService, integrationService, rulesetService, idmService, authClientProvider, messagingService, ajv) {
	this.app 					= app;
	this.definition 			= definition;
	this.roleCheckHandler 		= roleCheckHandler;
	this.queueProvider 			= queueProvider;
	this.uuid 					= uuid;
	this.hostnameResolver 		= hostnameResolver;
	this.serviceProvider 		= serviceProvider;
	this.storageService 		= storageService;
	this.integrationService 	= integrationService;
	this.rulesetService 		= rulesetService;
	this.idmService 			= idmService;
	this.authClientProvider 	= authClientProvider;
	this.messagingService 		= messagingService;
	this.ajv 					= ajv;
};

queueInstance.prototype.queueMessage = function(req, res, next) {
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
	return this.queueProvider.insertMessage(this.definition.name, id, {
		id 		: id,
		queue 	: this.definition.name,
		status 	: "PENDING",
		request : req.body,
		result 	: null,
		error 	: null
	}).then(() => {
		res.status(201);
		res.location(`${this.hostnameResolver.resolveQueue()}/${this.definition.name}/${id}`);
		res.send("");
		next();
	});
};

queueInstance.prototype.getMessage = function(req, res, next) {
	return this.queueProvider.getMessage(this.definition.name, req.params.id).then((message) => {
		res.json(message);
		res.status(200);
		next()
	}).catch((err) => {
		res.status(404);
		res.send("");
		next();
	});
};

queueInstance.prototype.deleteMessage = function(req, res, next) {
	return this.queueProvider.deleteMessage(this.definition.name, req.params.id).then(() => {
		res.status(204);
		res.send("");
		next();
	}).catch((err) => {
		res.status(404);
		res.send("");
		next();
	})
};

queueInstance.prototype.setupEndpoints = function() {
	return new Promise((resolve, reject) => {
		let roles = [
			"system_admin",
			"system_writer",
			"queue_writer",
			`${this.definition.name}_writer`
		];

		if (this.definition.roles.replace) {
			roles = ["system_admin"];
		}

		if (this.definition.roles.roles) {
			roles = roles.concat(this.definition.roles.roles);
		}

		if (!this.definition.roles.needsRole) {
			roles = null;
		}

		console.log(`Setting up POST /${this.definition.name}`);
		this.app.post(`/${this.definition.name}`, 		this.roleCheckHandler.enforceRoles(this.queueMessage.bind(this), roles));
		console.log(`Setting up GET /${this.definition.name}/:id`);
		this.app.get(`/${this.definition.name}/:id`, 	this.roleCheckHandler.enforceRoles(this.getMessage.bind(this), roles));
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
	console.log(`Starting handler for ${this.definition.name} queue`);

	const runNext = () => {
		let hasMessage = false;
		const nextMessage = this.queueProvider.getNextMessage(this.definition.name).then((message) => {
			if (!message) {
				return Promise.resolve();
			}

			console.log(`Processing message ${message.id} on ${this.definition.name}`);
			hasMessage = true;

			return this.queueProvider.markAsInProgress(this.definition.name, message.id).then(() => {
				let services = {
					serviceProvider 	: this.serviceProvider,
					storageService 		: this.storageService,
					integrationService 	: this.integrationService,
					rulesetService 		: this.rulesetService,
					idmService 			: this.idmService,
					authClientProvider 	: this.authClientProvider,
					messagingService 	: this.messagingService
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
				runNext();
			} else {
				this.timeout = setTimeout(runNext.bind(this), 2500);
			}
		});
	}

	runNext();

	return Promise.resolve();
};

queueInstance.prototype.init = function() {
	return this.setupEndpoints().then(() => {
		return this.setupHandler();
	});
};

module.exports = function(app, definition, roleCheckHandler, queueProvider, uuid, hostnameResolver, serviceProvider, storageService, integrationService, rulesetService, idmService, authClientProvider, messagingService, ajv) {
	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	if (!queueProvider) {
		queueProvider = require("./queues/fsQueue")();
	}

	if (!uuid) {
		uuid = require("uuid");
	}

	if (!hostnameResolver) {
		hostnameResolver = require("../../shared/hostnameResolver")();
	}

	if (!serviceProvider) {
		serviceProvider = require("../../shared/iocProvider")();
	}

	if (!storageService) {
		storageService = require("../../shared/storageService")();
	}

	if (!integrationService) {
		integrationService = require("../../shared/integrationService")();
	}

	if (!rulesetService) {
		rulesetService = require("../../shared/ruleService")();
	}

	if (!idmService) {
		idmService = require("../../shared/idmService")();
	}

	if (!authClientProvider) {
		authClientProvider = require("../../shared/authClientProvider")(definition ? definition.client : null);
	}

	if (!messagingService) {
		messagingService = require("../../shared/messagingService")();
	}

	if (!ajv) {
		ajv = require("ajv")({
			allErrors : true
		});
	}

	return new queueInstance(app, definition, roleCheckHandler, queueProvider, uuid, hostnameResolver, serviceProvider, storageService, integrationService, rulesetService, idmService, authClientProvider, messagingService, ajv);
};