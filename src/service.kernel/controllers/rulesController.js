const rulesController = function(app, dir, fileLister, roleCheckHandler, path, typeValidator) {
    this.app 				= app;
    this.dir 				= dir;
    this.path 				= path;
    this.fileLister 		= fileLister;
    this.roleCheckHandler 	= roleCheckHandler;
    this.typeValidator		= typeValidator;

    this.initEndpoints();
};

rulesController.prototype.get = function(req, res) {
    this.fileLister.executeGlob(this.path.join(this.dir, "**/*.json")).then((results) => {
        res.status(200);
        res.json(results.map((r) => {
            return r;
        }));
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

rulesController.prototype.getSingular = function(req, res) {
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

rulesController.prototype.update = function(req, res) {
    this.typeValidator.validate("ruleset", req.body).then(() => {
        if (req.params.name !== req.body.name) {
            return this.fileLister.deleteFile(this.dir, req.params.name + ".json").then(() => {
                return this.fileLister.writeFile(this.dir, req.body.name + ".json", JSON.stringify(req.body));
            });
        }

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

rulesController.prototype.delete = function(req, res) {
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

rulesController.prototype.create = function(req, res) {
    this.typeValidator.validate("ruleset", req.body).then(() => {
        return this.fileLister.writeFile(this.dir, req.body.name + ".json", JSON.stringify(req.body));
    }).then(() => {
        res.status(201);
        res.location("/rules/" + req.body.name);
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

rulesController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get("/rules", 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		["rule_reader", "rule_admin", "system_reader", "system_admin"]));
    this.app.get("/rules/:name", 	this.roleCheckHandler.enforceRoles(this.getSingular.bind(this), ["rule_reader", "rule_admin", "system_reader", "system_admin"]));
    this.app.put("/rules/:name", 	this.roleCheckHandler.enforceRoles(this.update.bind(this), 		["rule_writer", "rule_admin", "system_writer", "system_admin"]));
    this.app.delete("/rules/:name", this.roleCheckHandler.enforceRoles(this.delete.bind(this), 		["rule_writer", "rule_admin", "system_writer", "system_admin"]));
    this.app.post("/rules", 		this.roleCheckHandler.enforceRoles(this.create.bind(this), 		["rule_writer", "rule_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, dir, fileLister, path, roleCheckHandler, typeValidator) {
    if (!fileLister) {
        fileLister = require("../lib/fileLister")();
    }

    if (!path) {
        path = require("path");
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require("../../support.lib/roleCheckHandler")();
    }

    if (!typeValidator) {
        typeValidator = require("../lib/typeValidator")();
    }

    return new rulesController(app, dir, fileLister, roleCheckHandler, path, typeValidator);
};