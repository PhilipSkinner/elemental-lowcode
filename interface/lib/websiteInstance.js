const websiteInstance = function(app, definition, controllerInstance) {
	this.app = app;
	this.definition = definition;
	this.controllerInstance = controllerInstance;
};

websiteInstance.prototype.configureRoute = function(route) {
	let instance = this.controllerInstance(this.definition.routes[route]);	

	console.log(`Hosting ${route} on ${this.definition.name} - /${this.definition.name}${route}`);
	this.app.get(`/${this.definition.name}${route}`, instance.handler.bind(instance));
};

websiteInstance.prototype.init = function() {
	return new Promise((resolve, reject) => {
		//setup our routes
		Object.keys(this.definition.routes).forEach((r) => {
			this.configureRoute(r);
		});

		return resolve();
	});
};

module.exports = function(app, definition, controllerInstance) {
	if (!controllerInstance) {
		controllerInstance = require('./controllerInstance');
	}

	return new websiteInstance(app, definition, controllerInstance);
};