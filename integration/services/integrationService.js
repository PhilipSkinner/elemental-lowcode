const integrationService = function(app, configReader, integrationInstance, roleCheckHandler) {
	this.app = app;
	this.configReader = configReader;
	this.integrationInstance = integrationInstance;
	this.roleCheckHandler = roleCheckHandler;
	this.hostedEndpoints = [];
};

integrationService.prototype.constructInstance = function(name, config) {
	let instance = this.integrationInstance(name, config);	
	const readerRoles = [
		"system_admin",
		"system_reader",
		"integration_reader",
		`${name}_reader`
	];

	if (config.method === "get") {
		console.log("Starting", name, "on", `/${name}`);		
		this.app.get(`/${name}`, this.roleCheckHandler.enforceRoles(instance.handler.bind(instance), readerRoles));
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
		const discoveryRoles = [
			"system_admin",
			"system_reader",
			"integration_reader"
		];
		//and add our discovery endpoint
		this.app.get("/", this.roleCheckHandler.enforceRoles((req, res, next) => {
			res.json({
				endpoints : this.hostedEndpoints
			});
			next();
			return;
		}, discoveryRoles));
	});
}

module.exports = function(app, configReader, integrationInstance, roleCheckHandler) {
	if (!configReader) {
		configReader = require("./configReader")();
	}

	if (!integrationInstance) {
		//don"t exec as we don"t want this to be a singleton!
		integrationInstance = require("./integrationInstance");
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new integrationService(app, configReader, integrationInstance, roleCheckHandler);
}