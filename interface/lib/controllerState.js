const controllerState = function(
	controllerDefinition,
	storageService,
	sessionState,
	integrationService,
	rulesetService,
	authClientProvider,
	idmService,
	navigationService,
	servicesProvider,
	messagingService,
	environmentService
) {
	this.controllerDefinition 						= controllerDefinition;
	this.controllerDefinition.storageService 		= storageService;
	this.controllerDefinition.sessionState 			= sessionState;
	this.controllerDefinition.integrationService 	= integrationService;
	this.controllerDefinition.rulesetService 		= rulesetService;
	this.controllerDefinition.authClientProvider 	= authClientProvider;
	this.controllerDefinition.idmService 			= idmService;
	this.controllerDefinition.navigationService 	= navigationService;
	this.controllerDefinition.serviceProvider 		= servicesProvider;
	this.controllerDefinition.messagingService 		= messagingService;
	this.controllerDefinition.environmentService 	= environmentService;
	this.controllerDefinition.mergeBag 				= this.mergeBag.bind(this);
};

controllerState.prototype.mergeBag = function(bag) {
	this.controllerDefinition.bag = Object.assign(this.controllerDefinition.bag || {}, bag || {});
};

controllerState.prototype.setContext = function(request, response) {
	this.request = request;
	this.response = response;

	this.controllerDefinition.sessionState.setContext(this.request, this.response);
	this.controllerDefinition.navigationService.setContext(this.request, this.response);
	this.controllerDefinition.authClientProvider.setSessionState(this.controllerDefinition.sessionState);
	this.controllerDefinition.serviceProvider.setContext(this.controllerDefinition.sessionState, this.request, this.response, this.controllerDefinition.navigationService);

	//set this within all of the services
	Object.keys(this.controllerDefinition).forEach((prop) => {
		const service = this.controllerDefinition[prop];
		if (service && service.setAuthClientProvider) {
			service.setAuthClientProvider(this.controllerDefinition.authClientProvider);
		}
	});
};

controllerState.prototype.setComponents = function(componentInstances) {
	this.componentInstances = componentInstances;
};

controllerState.prototype.generateResponseHeaders = function() {
	this.controllerDefinition.sessionState.generateResponseHeaders();
	this.controllerDefinition.navigationService.generateResponseHeaders();
};

controllerState.prototype.deallocate = function() {
	this.controllerDefinition.sessionState.deallocate();
	this.controllerDefinition = null;
	this.request = null;
	this.response = null;
};

controllerState.prototype.getBag = function() {
	return this.controllerDefinition.bag;
};

controllerState.prototype.cleanValues = function(values) {
	if (Array.isArray(values)) {
		return values.map((v) => {
			return this.cleanValues(v);
		});
	}

	if (typeof(values) === 'object') {
		Object.keys(values).forEach((k) => {
			values[k] = this.cleanValues(values[k]);
		});

		return values;
	}

	if (values && values.replace) {
		values = values.replace(/\$\(/g, '&#36;(');
		values = values.replace(/\$\./g, '&#36;.')
	}

	return values;
};

controllerState.prototype._triggerComponentEvents = function(name, details) {
	return Promise.all(this.componentInstances.map((ci) => {
		if ((details._identifier && ci.identifier === details._identifier) || name === "load") {
			let result = null;

			//we need to trigger the event on this component
			ci.instance.storageService 		= this.controllerDefinition.storageService;
			ci.instance.sessionState 		= this.controllerDefinition.sessionState;
			ci.instance.integrationService 	= this.controllerDefinition.integrationService;
			ci.instance.rulesetService 		= this.controllerDefinition.rulesetService;
			ci.instance.authClientProvider 	= this.controllerDefinition.authClientProvider;
			ci.instance.idmService 			= this.controllerDefinition.idmService;
			ci.instance.navigationService 	= this.controllerDefinition.navigationService;
			ci.instance.serviceProvider 	= this.controllerDefinition.serviceProvider;
			ci.instance.messagingService 	= this.controllerDefinition.messagingService;
			ci.instance.environmentService 	= this.controllerDefinition.environmentService;
			ci.instance.parent 				= this.controllerDefinition;

			if (ci.instance.events[name]) {
				result = ci.instance.events[name].bind(ci.instance)(details);
			}

			if (result && result.then) {
				return result;
			}
		}

		return Promise.resolve();
	}));
};

controllerState.prototype.triggerEvent = function(name, details) {
	//ensure we clean any nasty values
	this.cleanValues(details);

	//trigger our components
	return this._triggerComponentEvents(name, details).then(() => {
		let result = null;

		if (this.controllerDefinition.events[name]) {
			result = this.controllerDefinition.events[name].bind(this.controllerDefinition)(details);
		}

		if (result && result.then) {
			return result.then(Promise.resolve).catch(Promise.reject);
		}

		return Promise.resolve();
	}).catch((err) => {
       	console.error(err);
		return Promise.resolve();
	});
};

module.exports = function(
	controllerDefinition,
	clientConfig,
	storageService,
	sessionState,
	integrationService,
	rulesetService,
	authClientProvider,
	idmService,
	navigationService,
	servicesProvider,
	messagingService,
	environmentService
) {
	if (!storageService) {
		storageService = require("../../shared/storageService")();
	}

	if (!sessionState) {
		sessionState = require("./sessionState")(controllerDefinition.sessionName);
	}

	if (!integrationService) {
		integrationService = require("../../shared/integrationService")();
	}

	if (!rulesetService) {
		rulesetService = require("../../shared/ruleService")();
	}

	if (!authClientProvider) {
		authClientProvider = require("../../shared/authClientProvider")(clientConfig);
	}

	if (!idmService) {
		idmService = require("../../shared/idmService")();
	}

	if (!navigationService) {
		navigationService = require("../../shared/navigationService")();
	}

	if (!servicesProvider) {
		servicesProvider = require("../../shared/iocProvider")();
	}

	if (!messagingService) {
		messagingService = require("../../shared/messagingService")();
	}

	if (!environmentService) {
		environmentService = require("../../shared/environmentService")();
	}

	return new controllerState(
		controllerDefinition,
		storageService,
		sessionState,
		integrationService,
		rulesetService,
		authClientProvider,
		idmService,
		navigationService,
		servicesProvider,
		messagingService,
		environmentService
	);
};