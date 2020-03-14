const dataController = function(app, fileLister, storageService, roleCheckHandler) {
	this.app = app;
	this.fileLister = fileLister;
	this.storageService = storageService;
	this.roleCheckHandler = roleCheckHandler;

	this.initEndpoints();
};

dataController.prototype.getDataTypes = function(req, res, next) {
	this.fileLister.executeGlob(".sources/data/**/*.json").then((results) => {		
		Promise.all(results.map((r) => {
			return this.storageService.detailCollection(r.name, req.headers.authorization.replace("Bearer ", ""));
		})).then((details) => {
			//map into our results
			for (var i = 0; i < results.length; i++) {
				results[i].count = details[i].count;
			}
			res.json(results);
			res.end();
		});
	});
};

dataController.prototype.getDataType = function(req, res, next) {
	this.fileLister.readJSONFile(".sources/data/", req.params.name + ".json").then((content) => {
		res.json(content);
		next();
	});
};

dataController.prototype.updateDataType = function(req, res, next) {
	this.fileLister.writeFile(".sources/data/", req.params.name + ".json", JSON.stringify(req.body)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

dataController.prototype.deleteDataType = function(req, res, next) {
	this.fileLister.deleteFile(".sources/data/", req.params.name + ".json").then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

dataController.prototype.createDataType = function(req, res, next) {
	this.fileLister.writeFile(".sources/data/", req.body.name + ".json", JSON.stringify(req.body)).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

dataController.prototype.initEndpoints = function() {
	this.app.get("/data/types", 			this.roleCheckHandler.enforceRoles(this.getDataTypes.bind(this), 	["datatype_reader", "datatype_admin", "system_reader", "system_admin"]));
	this.app.get("/data/types/:name", 		this.roleCheckHandler.enforceRoles(this.getDataType.bind(this), 	["datatype_reader", "datatype_admin", "system_reader", "system_admin"]));
	this.app.put("/data/types/:name", 		this.roleCheckHandler.enforceRoles(this.updateDataType.bind(this), 	["datatype_writer", "datatype_admin", "system_writer", "system_admin"]));
	this.app.delete("/data/types/:name", 	this.roleCheckHandler.enforceRoles(this.deleteDataType.bind(this), 	["datatype_writer", "datatype_admin", "system_writer", "system_admin"]));
	this.app.post("/data/types", 			this.roleCheckHandler.enforceRoles(this.createDataType.bind(this), 	["datatype_writer", "datatype_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, fileLister, storageService, roleCheckHandler) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!storageService) {
		storageService = require("../../shared/storageService")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new dataController(app, fileLister, storageService, roleCheckHandler);
};