const apiInstance = function(
	app,
	definition,
	roleCheckHandler,
	serviceProvider,
	storageService,
	integrationService,
	rulesetService,
	idmService,
	authClientProvider,
	messagingService,
	environmentService
) {
	this.app 					= app;
	this.definition 			= definition;
	this.roleCheckHandler 		= roleCheckHandler;
	this.serviceProvider 		= serviceProvider;
	this.storageService 		= storageService;
	this.integrationService 	= integrationService;
	this.rulesetService 		= rulesetService;
	this.idmService 			= idmService;
	this.authClientProvider 	= authClientProvider;
	this.messagingService 		= messagingService;
	this.environmentService 	= environmentService;
};

apiInstance.prototype.resolveController = function(name) {
	let services = {
		serviceProvider 	: this.serviceProvider,
		storageService 		: this.storageService,
		integrationService 	: this.integrationService,
		rulesetService 		: this.rulesetService,
		idmService 			: this.idmService,
		messagingService 	: this.messagingService,
		environmentService  : this.environmentService,
	};

	Object.keys(services).forEach((prop) => {
		const service = services[prop];
		if (service && service.setAuthClientProvider) {
			service.setAuthClientProvider(this.authClientProvider);
		}
	});

	let controller = this.definition.controllers[name].bind(services)();
	return controller;
};

apiInstance.prototype.setupEndpoints = function() {
	return new Promise((resolve, reject) => {
		console.info("Setting up API endpoints...");

		const originalReaderRoles = [
			"system_admin",
			"system_reader",
			"api_reader",
			`${this.definition.name}_reader`
		];

		const originalWriterRoles = [
			"system_admin",
			"system_writer",
			"api_writer",
			`${this.definition.name}_writer`
		];

		Object.keys(this.definition.routes || {}).forEach((route) => {
			let routeConfig = this.definition.routes[route];
			let routePath = `/${this.definition.name}${route}`;
			console.info(`Setting up routes for ${routePath}`);

			if (routeConfig.get) {
				let readerRoles = JSON.parse(JSON.stringify(originalReaderRoles));
				if (routeConfig.get.replace) {
					readerRoles = ["system_admin"];
				}

				if (routeConfig.get.roles) {
					readerRoles = readerRoles.concat(routeConfig.get.roles);
				}

				if (routeConfig.get.needsRole === false) {
					readerRoles = null;
				}

				console.info(`Setting up GET on ${routePath}`);
				this.app.get(routePath, this.roleCheckHandler.enforceRoles((req, res, next) => {
					this.resolveController(routeConfig.get.controller).bind({
						serviceProvider : this.serviceProvider
					})(req, res, next);
				}, readerRoles));
			}

			if (routeConfig.post) {
				let writerRoles = JSON.parse(JSON.stringify(originalWriterRoles));
				if (routeConfig.post.replace) {
					writerRoles = ["system_admin"];
				}

				if (routeConfig.post.roles) {
					writerRoles = writerRoles.concat(routeConfig.post.roles);
				}

				if (routeConfig.post.needsRole === false) {
					writerRoles = null;
				}

				console.info(`Setting up POST on ${routePath}`);
				this.app.post(routePath, this.roleCheckHandler.enforceRoles((req, res, next) => {
					this.resolveController(routeConfig.post.controller)(req, res, next);
				}, writerRoles));
			}
		});

		console.info("Endpoint setup complete");

		return resolve();
	});
};

apiInstance.prototype.init = function() {
	console.info(`Initializing ${this.definition.name} API instance...`);

	return this.setupEndpoints();
};

module.exports = function(
	app,
	definition,
	roleCheckHandler,
	serviceProvider,
	storageService,
	integrationService,
	rulesetService,
	idmService,
	authClientProvider,
	messagingService,
	environmentService
) {
	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
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

	if (!environmentService) {
		environmentService = require("../../shared/environmentService")();
	}

	return new apiInstance(
		app,
		definition,
		roleCheckHandler,
		serviceProvider,
		storageService,
		integrationService,
		rulesetService,
		idmService,
		authClientProvider,
		messagingService,
		environmentService
	);
};