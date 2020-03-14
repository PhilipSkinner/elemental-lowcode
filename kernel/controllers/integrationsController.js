const integrationsController = function(app, fileLister, roleCheckHandler) {
	this.app = app;
	this.fileLister = fileLister;
	this.roleCheckHandler = roleCheckHandler;

	this.initEndpoints();
};

integrationsController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob(".sources/integration/**/*.json").then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

integrationsController.prototype.getSingular = function(req, res, next) {
	this.fileLister.readJSONFile(".sources/integration/", req.params.name + ".json").then((content) => {
		res.json(content);
		next();
	});
};

integrationsController.prototype.update = function(req, res, next) {
	this.fileLister.writeFile(".sources/integration/", req.params.name + ".json", JSON.stringify(req.body)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

integrationsController.prototype.delete = function(req, res, next) {
	this.fileLister.deleteFile(".sources/integration/", req.params.name + ".json").then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

integrationsController.prototype.create = function(req, res, next) {
	this.fileLister.writeFile(".sources/integration/", req.body.name + ".json", JSON.stringify(req.body)).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

integrationsController.prototype.initEndpoints = function() {
	this.app.get("/integrations", 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		["integration_reader", "integration_admin", "system_reader", "system_admin"]));
	this.app.get("/integrations/:name", 	this.roleCheckHandler.enforceRoles(this.getSingular.bind(this), ["integration_reader", "integration_admin", "system_reader", "system_admin"]));
	this.app.put("/integrations/:name", 	this.roleCheckHandler.enforceRoles(this.update.bind(this), 		["integration_writer", "integration_admin", "system_writer", "system_admin"]));
	this.app.delete("/integrations/:name", 	this.roleCheckHandler.enforceRoles(this.delete.bind(this), 		["integration_writer", "integration_admin", "system_writer", "system_admin"]));
	this.app.post("/integrations", 			this.roleCheckHandler.enforceRoles(this.create.bind(this), 		["integration_writer", "integration_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, fileLister, path, roleCheckHandler) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new integrationsController(app, fileLister, roleCheckHandler);
};