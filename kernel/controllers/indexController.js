const indexController = function(app, dir, fileLister, roleCheckHandler, path) {
	this.app = app;
	this.dir = dir;
	this.path = path;
	this.fileLister = fileLister;
	this.roleCheckHandler = roleCheckHandler;

	this.initEndpoints();
};

indexController.prototype.get = function(req, res, next) {
	this.fileLister.tarDir(this.dir).then((buffer) => {
		res.end(buffer);
		next();
	});
};

indexController.prototype.post = function(req, res, next) {
	this.fileLister.extractTar(this.dir, req.files.import.data).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

indexController.prototype.initEndpoints = function() {
	this.app.get("/", 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		["system_reader", "system_admin"]));
	this.app.post("/", 			this.roleCheckHandler.enforceRoles(this.post.bind(this), 		["system_writer", "system_admin"]));
};

module.exports = function(app, dir, fileLister, path, roleCheckHandler) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!path) {
		path = require("path");
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new indexController(app, dir, fileLister, roleCheckHandler, path);
};