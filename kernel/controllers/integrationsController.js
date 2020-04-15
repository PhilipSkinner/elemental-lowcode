const integrationsController = function(app, dir, fileLister, roleCheckHandler, path, typeValidator) {
	this.app 				= app;
	this.dir 				= dir;
	this.path 				= path;
	this.fileLister 		= fileLister;
	this.roleCheckHandler 	= roleCheckHandler;
	this.typeValidator		= typeValidator;

	this.initEndpoints();
};

integrationsController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "**/*.json")).then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

integrationsController.prototype.getSingular = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, req.params.name + ".json").then((content) => {
		res.json(content);
		next();
	});
};

integrationsController.prototype.update = function(req, res, next) {
	//validate the JSON
	this.typeValidator.validate("integration", req.body).then(() => {
		this.fileLister.writeFile(this.dir, req.params.name + ".json", JSON.stringify(req.body)).then(() => {
			res.status(204);
			res.send("");
			next();
		});
	}).catch((err) => {
		res.status(422);
		res.json({
			errors : err
		});
		next();
	});
};

integrationsController.prototype.delete = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, req.params.name + ".json").then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

integrationsController.prototype.create = function(req, res, next) {
	this.typeValidator.validate("integration", req.body).then(() => {
		this.fileLister.writeFile(this.dir, req.body.name + ".json", JSON.stringify(req.body)).then(() => {
			res.status(201);
			res.send("");
			next();
		});
	}).catch((err) => {
		res.status(422);
		res.json({
			errors : err
		});
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

module.exports = function(app, dir, fileLister, path, roleCheckHandler, typeValidator) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!path) {
		path = require("path");
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	if (!typeValidator) {
		typeValidator = require('../lib/typeValidator')();
	}

	return new integrationsController(app, dir, fileLister, roleCheckHandler, path, typeValidator);
};