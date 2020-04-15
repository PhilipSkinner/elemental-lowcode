const dataController = function(app, dir, fileLister, storageService, roleCheckHandler, path, typeValidator) {
	this.app 				= app;
	this.dir 				= dir;
	this.fileLister 		= fileLister;
	this.storageService 	= storageService;
	this.roleCheckHandler 	= roleCheckHandler;
	this.path 				= path;
	this.typeValidator 		= typeValidator;

	this.initEndpoints();
};

dataController.prototype.getDataTypes = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "**/*.json")).then((results) => {
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
	this.fileLister.readJSONFile(this.dir, req.params.name + ".json").then((content) => {
		res.json(content);
		next();
	});
};

dataController.prototype.updateDataType = function(req, res, next) {
	this.typeValidator.validate("datatype", req.body).then(() => {
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

dataController.prototype.deleteDataType = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, req.params.name + ".json").then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

dataController.prototype.createDataType = function(req, res, next) {
	this.typeValidator.validate("datatype", req.body).then(() => {
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

dataController.prototype.initEndpoints = function() {
	this.app.get("/data/types", 			this.roleCheckHandler.enforceRoles(this.getDataTypes.bind(this), 	["datatype_reader", "datatype_admin", "system_reader", "system_admin"]));
	this.app.get("/data/types/:name", 		this.roleCheckHandler.enforceRoles(this.getDataType.bind(this), 	["datatype_reader", "datatype_admin", "system_reader", "system_admin"]));
	this.app.put("/data/types/:name", 		this.roleCheckHandler.enforceRoles(this.updateDataType.bind(this), 	["datatype_writer", "datatype_admin", "system_writer", "system_admin"]));
	this.app.delete("/data/types/:name", 	this.roleCheckHandler.enforceRoles(this.deleteDataType.bind(this), 	["datatype_writer", "datatype_admin", "system_writer", "system_admin"]));
	this.app.post("/data/types", 			this.roleCheckHandler.enforceRoles(this.createDataType.bind(this), 	["datatype_writer", "datatype_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, dir, fileLister, storageService, roleCheckHandler, path, typeValidator) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!storageService) {
		storageService = require("../../shared/storageService")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	if (!path) {
		path = require("path");
	}

	if (!typeValidator) {
		typeValidator = require("../lib/typeValidator")();
	}

	return new dataController(app, dir, fileLister, storageService, roleCheckHandler, path, typeValidator);
};