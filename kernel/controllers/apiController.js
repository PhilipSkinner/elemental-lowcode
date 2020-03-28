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
			return r;
		}));
		next();
	});
};

apiController.prototype.getApi = function(req, res, next) {
	return fileLister.readJSONFile(this.dir, req.params.name + ".api.json").then((content) => {
		res.json(content);
		next();
	});
};

apiController.prototype.getService = function(req, res, next) {
	return fileLister.readFile(this.dir + req.params.name + "/services/", req.params.service + ".js").then((content) => {
		res.send(content);
		next();
	});
};

apiController.prototype.getController = function(req, res, next) {
	return fileLister.readFile(this.dir + req.params.name + "/controllers/", req.params.service + ".js").then((content) => {
		res.send(content);
		next();
	});
};

apiController.prototype.createApi = function(req, res, next) {
	return fileLister.writeFile(this.dir, req.body.name + ".api.json", JSON.stringify(req.body, null, 4)).then((content) => {
		res.status(201);
		res.send("");
		next();
	});
};

apiController.prototype.createService = function(req, res, next) {
	//needs to add it into the services on the API definition aswell
	return fileLister.writeFile(this.dir + req.params.name + "/services/", req.body.name + ".js", req.body.content).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

apiController.prototype.initEndpoints = function() {
	this.app.get("/apis", 								this.roleCheckHandler.enforceRoles(this.getApis.bind(this), 			["api_reader", "api_admin", "system_reader", "system_admin"]));	
	this.app.get("/apis/:name", 						this.roleCheckHandler.enforceRoles(this.getApi.bind(this), 				["api_reader", "api_admin", "system_reader", "system_admin"]));	
	this.app.get("/apis/:name/services/:service", 		this.roleCheckHandler.enforceRoles(this.getService.bind(this), 			["api_reader", "api_admin", "system_reader", "system_admin"]));	
	this.app.get("/apis/:name/controllers/:controller", this.roleCheckHandler.enforceRoles(this.getController.bind(this), 		["api_reader", "api_admin", "system_reader", "system_admin"]));

	//create
	this.app.post("/apis", 								this.roleCheckHandler.enforceRoles(this.createApi.bind(this), 			["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.post("/apis/:name/services", 				this.roleCheckHandler.enforceRoles(this.createService.bind(this), 		["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.post("/apis/:name/controllers", 			this.roleCheckHandler.enforceRoles(this.createController.bind(this), 	["api_writer", "api_admin", "system_writer", "system_admin"]));

	//update
	this.app.put("/apis/:name", 						this.roleCheckHandler.enforceRoles(this.updateApi.bind(this), 			["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.put("/apis/:name/services/:service", 		this.roleCheckHandler.enforceRoles(this.updateService.bind(this), 		["api_writer", "api_admin", "system_writer", "system_admin"]));
	this.app.put("/apis/:name/controllers/:controller", this.roleCheckHandler.enforceRoles(this.updateController.bind(this), 	["api_writer", "api_admin", "system_writer", "system_admin"]));	
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