const apiController = function(app, dir, fileLister, roleCheckHandler, path) {
	this.app = app;
	this.dir = dir;
	this.fileLister = fileLister;
	this.roleCheckHandler = roleCheckHandler;
	this.path = path;

	this.initEndpoints();
};

apiController.prototype.getApis = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "**/*.api.json")).then((results) => {
		res.json(results.map((r) => {
			r.name = r.name.substring(0, r.name.length - 4);
			return r;
		}));
		next();
	});
};

apiController.prototype.getApi = function(req, res, next) {
	return this.fileLister.readJSONFile(this.dir, req.params.name + ".api.json").then((content) => {
		res.json(content);
		next();
	});
};

apiController.prototype.getService = function(req, res, next) {
	return this.fileLister.readFile(this.path.join(this.dir, req.params.name, "/services/"), req.params.service).then((content) => {
		res.send(content);
		next();
	});
};

apiController.prototype.getController = function(req, res, next) {
	return this.fileLister.readFile(this.path.join(this.dir, req.params.name, "/controllers/"), req.params.controller).then((content) => {
		res.send(content);
		next();
	});
};

apiController.prototype.createApi = function(req, res, next) {
	return this.fileLister.writeFile(this.dir, req.body.name + ".api.json", JSON.stringify(req.body, null, 4)).then((content) => {
		res.status(201);
		res.send("");
		next();
	});
};

apiController.prototype.createService = function(req, res, next) {
	return this.fileLister.writeFile(this.path.join(this.dir, req.params.name, "/services/"), req.body.name, req.body.content).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

apiController.prototype.createController = function(req, res, next) {
	return this.fileLister.writeFile(this.path.join(this.dir, req.params.name, "/controllers/"), req.body.name, req.body.content).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

apiController.prototype.updateApi = function(req, res, next) {
	return this.fileLister.writeFile(this.dir, req.body.name + ".api.json", JSON.stringify(req.body, null, 4)).then((content) => {
		res.status(204);
		res.send("");
		next();
	});
};

apiController.prototype.updateService = function(req, res, next) {
	return this.fileLister.writeFile(this.path.join(this.dir, req.params.name, "/services/"), req.params.service, req.body.content).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

apiController.prototype.updateController = function(req, res, next) {
	return this.fileLister.writeFile(this.path.join(this.dir, req.params.name, "/controllers/"), req.params.controller, req.body.content).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

apiController.prototype.deleteApi = function(req, res, next) {
	return this.fileLister.deleteFile(this.dir, req.params.name + ".api.json").then((content) => {
		res.status(204);
		res.send("");
		next();
	}).catch((err) => {
		res.status(404);
		res.send("");
		next();
	});
};

apiController.prototype.deleteService = function(req, res, next) {
	return this.fileLister.deleteFile(this.path.join(this.dir, req.params.name, "/services/"), req.params.service).then(() => {
		res.status(204);
		res.send("");
		next();
	}).catch((err) => {
		res.status(404);
		res.send("");
		next();
	});
};

apiController.prototype.deleteController = function(req, res, next) {
	return this.fileLister.deleteFile(this.path.join(this.dir, req.params.name, "/controllers/"), req.params.controller).then(() => {
		res.status(204);
		res.send("");
		next();
	}).catch((err) => {
		res.status(404);
		res.send("");
		next();
	});
};

apiController.prototype.initEndpoints = function() {
	this.app.get("/apis", 									this.roleCheckHandler.enforceRoles(this.getApis.bind(this), 			["api_reader", "api_admin", "system_reader", "system_admin"]));
	this.app.get("/apis/:name", 							this.roleCheckHandler.enforceRoles(this.getApi.bind(this), 				["api_reader", "api_admin", "system_reader", "system_admin"]));
	this.app.get("/apis/:name/services/:service", 			this.roleCheckHandler.enforceRoles(this.getService.bind(this), 			["api_reader", "api_admin", "system_reader", "system_admin"]));
	this.app.get("/apis/:name/controllers/:controller", 	this.roleCheckHandler.enforceRoles(this.getController.bind(this), 		["api_reader", "api_admin", "system_reader", "system_admin"]));

	//create
	this.app.post("/apis", 									this.roleCheckHandler.enforceRoles(this.createApi.bind(this), 			["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.post("/apis/:name/services", 					this.roleCheckHandler.enforceRoles(this.createService.bind(this), 		["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.post("/apis/:name/controllers", 				this.roleCheckHandler.enforceRoles(this.createController.bind(this), 	["api_writer", "api_admin", "system_writer", "system_admin"]));

	//update
	this.app.put("/apis/:name", 							this.roleCheckHandler.enforceRoles(this.updateApi.bind(this), 			["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.put("/apis/:name/services/:service", 			this.roleCheckHandler.enforceRoles(this.updateService.bind(this), 		["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.put("/apis/:name/controllers/:controller", 	this.roleCheckHandler.enforceRoles(this.updateController.bind(this), 	["api_writer", "api_admin", "system_writer", "system_admin"]));

	//delete
	this.app.delete("/apis/:name", 							this.roleCheckHandler.enforceRoles(this.deleteApi.bind(this), 			["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.delete("/apis/:name/services/:service", 		this.roleCheckHandler.enforceRoles(this.deleteService.bind(this), 		["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.delete("/apis/:name/controllers/:controller", 	this.roleCheckHandler.enforceRoles(this.deleteController.bind(this), 	["api_writer", "api_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, dir, fileLister, roleCheckHandler, path) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	if (!path) {
		path = require("path");
	}

	return new apiController(app, dir, fileLister, roleCheckHandler, path);
};