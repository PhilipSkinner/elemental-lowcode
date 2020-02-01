const websiteInstance = function(app, definition, controllerInstance, templateRenderer) {
	this.app = app;
	this.definition = definition;
	this.controllerInstance = controllerInstance;
	this.templateRenderer = templateRenderer;
};

websiteInstance.prototype.configureTag = function(tag) {
	this.templateRenderer.registerCustomTag(tag);
};

websiteInstance.prototype.configureRoute = function(route) {
	let instance = this.controllerInstance(this.definition.routes[route], this.templateRenderer);

	console.log(`Hosting ${route} on ${this.definition.name} - /${this.definition.name}${route}`);
	this.app.get(`/${this.definition.name}${route}`, instance.handler.bind(instance));
	this.app.post(`/${this.definition.name}${route}`, instance.handler.bind(instance));
};

websiteInstance.prototype.init = function() {
	return new Promise((resolve, reject) => {
		//setup our custom tags
		this.definition.tags.forEach((t) => {
			this.configureTag(t);
		});

		//setup our routes
		Object.keys(this.definition.routes).forEach((r) => {
			this.configureRoute(r);
		});

		return resolve();
	});
};

module.exports = function(app, definition, controllerInstance, templateRenderer) {
	if (!controllerInstance) {
		controllerInstance = require('./controllerInstance');
	}

	if (!templateRenderer) {
		templateRenderer = require('./templating/render')();
	}

	return new websiteInstance(app, definition, controllerInstance, templateRenderer);
};