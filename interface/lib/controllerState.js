const controllerState = function(controllerDefinition, storageService, sessionState) {
	this.controllerDefinition = controllerDefinition;
	this.controllerDefinition.storageService = storageService;
	this.controllerDefinition.sessionState = sessionState;
};

controllerState.prototype.setContext = function(request, response) {
	this.request = request;
	this.response = response;

	this.controllerDefinition.sessionState.setContext(this.request, this.response);
};

controllerState.prototype.generateResponseHeaders = function() {
	this.controllerDefinition.sessionState.generateResponseHeaders();
};

controllerState.prototype.getBag = function() {
	return this.controllerDefinition.bag;
};

controllerState.prototype.triggerEvent = function(name, details) {
	return new Promise((resolve, reject) => {
		let result = null;

		if (this.controllerDefinition.events[name]) {
			result = this.controllerDefinition.events[name].bind(this.controllerDefinition)(details);
		}

		if (result && result.then) {
			return result.then(resolve).catch(reject);
		}

		return resolve();
	});
};

module.exports = function(controllerDefinition, storageService, sessionState) {
	if (!storageService) {
		storageService = require('../../shared/storageService')();
	}

	if (!sessionState) {
		sessionState = require('./sessionState')(controllerDefinition.sessionName);
	}

	return new controllerState(controllerDefinition, storageService, sessionState);
};