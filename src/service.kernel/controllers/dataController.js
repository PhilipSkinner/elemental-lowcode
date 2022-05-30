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

dataController.prototype.getDataTypes = function(req, res) {
    let results = null;
    this.fileLister.executeGlob(this.path.join(this.dir, "**/*.json")).then((_results) => {
        results = _results;
        return Promise.all(results.map((r) => {
            return this.storageService.detailCollection(r.name, req.headers.authorization.replace("Bearer ", ""))
                .then((details) => {
                    return Promise.resolve(details);
                }).catch(() => {
                    return Promise.resolve({ count : 0 });
                });
        }));
    }).then((details) => {
        //map into our results
        for (var i = 0; i < results.length; i++) {
            results[i].count = details[i] ? details[i].count : 0;
        }
        res.status(200);
        res.json(results);
        res.end();
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

dataController.prototype.getDataType = function(req, res) {
    this.fileLister.readJSONFile(this.dir, req.params.name + ".json").then((content) => {
        res.status(200);
        res.json(content);
        res.end();
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

dataController.prototype.updateDataType = function(req, res) {
    this.typeValidator.validate("datatype", req.body).then(() => {
        return this.fileLister.writeFile(this.dir, req.params.name + ".json", JSON.stringify(req.body));
    }).then(() => {
        res.status(204);
        res.end();
    }).catch((err) => {
        if (Array.isArray(err)) {
            res.status(422);
            res.json({
                errors : err
            });
        } else {
            res.status(500);
            res.json({
                errors : [
                    err.toString()
                ]
            });
        }

        res.end();
    });
};

dataController.prototype.deleteDataType = function(req, res) {
    this.fileLister.deleteFile(this.dir, req.params.name + ".json").then(() => {
        res.status(204);
        res.end();
    }).catch((err) => {
        res.status(500);
        res.json({
            errors : [
                err.toString()
            ]
        });
        res.end();
    });
};

dataController.prototype.createDataType = function(req, res) {
    this.typeValidator.validate("datatype", req.body).then(() => {
        return this.fileLister.writeFile(this.dir, req.body.name + ".json", JSON.stringify(req.body));
    }).then(() => {
        res.status(201);
        res.location("/data/types/" + req.body.name);
        res.end();
    }).catch((err) => {
        if (Array.isArray(err)) {
            res.status(422);
            res.json({
                errors : err
            });
        } else {
            res.status(500);
            res.json({
                errors : [
                    err.toString()
                ]
            });
        }

        res.end();
    });
};

dataController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

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
        storageService = require("../../support.lib/storageService")();
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require("../../support.lib/roleCheckHandler")();
    }

    if (!path) {
        path = require("path");
    }

    if (!typeValidator) {
        typeValidator = require("../lib/typeValidator")();
    }

    return new dataController(app, dir, fileLister, storageService, roleCheckHandler, path, typeValidator);
};