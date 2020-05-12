const controllerState = function(controllerDefinition, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, servicesProvider, messagingService) {
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
};

controllerState.prototype.setContext = function(request, response) {
	this.request = request;
	this.response = response;

	this.controllerDefinition.sessionState.setContext(this.request, this.response);
	this.controllerDefinition.navigationService.setContext(this.request, this.response);
	this.controllerDefinition.authClientProvider.setSessionState(this.controllerDefinition.sessionState);

	//set this within all of the services
	Object.keys(this.controllerDefinition).forEach((prop) => {
		const service = this.controllerDefinition[prop];
		if (service && service.setAuthClientProvider) {
			service.setAuthClientProvider(this.controllerDefinition.authClientProvider);
		}
	});
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
			return cleanValues(v);
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

controllerState.prototype.triggerEvent = function(name, details) {
	return new Promise((resolve, reject) => {
		let result = null;

		//ensure we clean any nasty values
		this.cleanValues(details);

		if (this.controllerDefinition.events[name]) {
			result = this.controllerDefinition.events[name].bind(this.controllerDefinition)(details);
		}

		if (result && result.then) {
			return result.then(resolve).catch(reject);
		}

		return resolve();
	});
};

module.exports = function(controllerDefinition, clientConfig, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, servicesProvider, messagingService) {
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

	return new controllerState(controllerDefinition, storageService, sessionState, integrationService, rulesetService, authClientProvider, idmService, navigationService, servicesProvider, messagingService);
};