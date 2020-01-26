const controllerState = function(controllerDefinition, storageService) {
	this.controllerDefinition = controllerDefinition;
	this.controllerDefinition.storageService = storageService;
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

module.exports = function(controllerDefinition, storageService) {
	if (!storageService) {
		storageService = require('../../shared/storageService')();
	}

	return new controllerState(controllerDefinition, storageService);
};