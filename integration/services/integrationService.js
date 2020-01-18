const integrationService = function(app, configReader, integrationInstance) {
	this.app = app;
	this.configReader = configReader;
	this.integrationInstance = integrationInstance;
	this.hostedEndpoints = [];
};

integrationService.prototype.constructInstance = function(name, config) {
	let instance = this.integrationInstance(name, config);	
	if (config.method === "get") {
		console.log("Starting", name, "on", `/${name}`);
		this.app.get(`/${name}`, instance.handler.bind(instance));
		this.hostedEndpoints.push(`/${name}`);
	}
};

integrationService.prototype.init = function(dir) {
	return this.configReader.readConfigFromDir(dir).then((config) => {
		//for each item lets boot up an integration instance
		Object.keys(config).forEach((integrationName) => {
			this.constructInstance(integrationName, config[integrationName]);
		});

		console.log("Discovery endpoint hosted");
		//and add our discovery endpoint
		this.app.get('/', (req, res, next) => {
			res.json({
				endpoints : this.hostedEndpoints
			});
			next();
			return;
		});
	});
}

module.exports = function(app, configReader, integrationInstance) {
	if (!configReader) {
		configReader = require('./configReader')();
	}

	if (!integrationInstance) {
		//don't exec as we don't want this to be a singleton!
		integrationInstance = require('./integrationInstance');
	}

	return new integrationService(app, configReader, integrationInstance);
}