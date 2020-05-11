const serviceController = function(app, dir, fileLister, roleCheckHandler, path) {
	this.app 				= app;
	this.dir 				= dir;
	this.path 				= path;
	this.fileLister 		= fileLister;
	this.roleCheckHandler 	= roleCheckHandler;

	this.initEndpoints();
};

serviceController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "**/*.js")).then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

serviceController.prototype.getSingular = function(req, res, next) {
	this.fileLister.readFile(this.dir, req.params.name + ".js").then((content) => {
		res.json(content);
		next();
	});
};

serviceController.prototype.update = function(req, res, next) {
	this.fileLister.writeFile(this.dir, req.params.name + ".js", req.body.payload).then(() => {
		res.status(204);
		res.send("");
		next();
	}).catch((err) => {
		res.status(422);
		res.json({
			errors : err
		});
		next();
	});
};

serviceController.prototype.delete = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, req.params.name + ".js").then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

serviceController.prototype.create = function(req, res, next) {
	this.fileLister.writeFile(this.dir, req.body.name + ".js", req.body.payload).then(() => {
		res.status(201);
		res.send("");
		next();
	}).catch((err) => {
		res.status(422);
		res.json({
			errors : err
		});
		next();
	});
};

serviceController.prototype.initEndpoints = function() {
	this.app.get("/services", 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		["service_reader", "service_admin", "system_reader", "system_admin"]));
	this.app.get("/services/:name", 	this.roleCheckHandler.enforceRoles(this.getSingular.bind(this), ["service_reader", "service_admin", "system_reader", "system_admin"]));
	this.app.put("/services/:name", 	this.roleCheckHandler.enforceRoles(this.update.bind(this), 		["service_writer", "service_admin", "system_writer", "system_admin"]));
	this.app.delete("/services/:name", 	this.roleCheckHandler.enforceRoles(this.delete.bind(this), 		["service_writer", "service_admin", "system_writer", "system_admin"]));
	this.app.post("/services", 			this.roleCheckHandler.enforceRoles(this.create.bind(this), 		["service_writer", "service_admin", "system_writer", "system_admin"]));
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

	return new serviceController(app, dir, fileLister, roleCheckHandler, path);
};