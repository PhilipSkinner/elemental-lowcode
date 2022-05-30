const apiController = function(app, dir, fileLister, roleCheckHandler, path) {
    this.app = app;
    this.dir = dir;
    this.fileLister = fileLister;
    this.roleCheckHandler = roleCheckHandler;
    this.path = path;

    this.initEndpoints();
};

apiController.prototype.getApis = function(req, res) {
    this.fileLister.executeGlob(this.path.join(this.dir, "**/*.api.json")).then((results) => {
        res.status(200);
        res.json(results.map((r) => {
            r.name = r.name.substring(0, r.name.length - 4);
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

apiController.prototype.getApi = function(req, res) {
    return this.fileLister.readJSONFile(this.dir, req.params.name + ".api.json").then((content) => {
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

apiController.prototype.getController = function(req, res) {
    return this.fileLister.readFile(this.path.join(this.dir, req.params.name, "/controllers/"), req.params.controller).then((content) => {
        res.status(200);
        res.send(content);
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

apiController.prototype.createApi = function(req, res) {
    return this.fileLister.writeFile(this.dir, req.body.name + ".api.json", JSON.stringify(req.body, null, 4)).then(() => {
        res.status(201);
        res.location("/apis/" + req.body.name);
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

apiController.prototype.createController = function(req, res) {
    return this.fileLister.writeFile(this.path.join(this.dir, req.params.name, "/controllers/"), req.body.name, req.body.content).then(() => {
        res.status(201);
        res.location("/apis/" + req.params.name + "/controllers/" + req.body.name);
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

apiController.prototype.updateApi = function(req, res) {
    return this.fileLister.writeFile(this.dir, req.body.name + ".api.json", JSON.stringify(req.body, null, 4)).then(() => {
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

apiController.prototype.updateController = function(req, res) {
    return this.fileLister.writeFile(this.path.join(this.dir, req.params.name, "/controllers/"), req.params.controller, req.body.content).then(() => {
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

apiController.prototype.deleteApi = function(req, res) {
    return this.fileLister.deleteFile(this.dir, req.params.name + ".api.json").then(() => {
        res.status(204);
        res.end();
    }).catch(() => {
        res.status(404);
        res.end();
    });
};

apiController.prototype.deleteController = function(req, res) {
    return this.fileLister.deleteFile(this.path.join(this.dir, req.params.name, "/controllers/"), req.params.controller).then(() => {
        res.status(204);
        res.end();
    }).catch(() => {
        res.status(404);
        res.end();
    });
};

apiController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get("/apis", 									this.roleCheckHandler.enforceRoles(this.getApis.bind(this), 			["api_reader", "api_admin", "system_reader", "system_admin"]));
    this.app.get("/apis/:name", 							this.roleCheckHandler.enforceRoles(this.getApi.bind(this), 				["api_reader", "api_admin", "system_reader", "system_admin"]));
    this.app.get("/apis/:name/controllers/:controller", 	this.roleCheckHandler.enforceRoles(this.getController.bind(this), 		["api_reader", "api_admin", "system_reader", "system_admin"]));

    //create
    this.app.post("/apis", 									this.roleCheckHandler.enforceRoles(this.createApi.bind(this), 			["api_writer", "api_admin", "system_writer", "system_admin"]));
    this.app.post("/apis/:name/controllers", 				this.roleCheckHandler.enforceRoles(this.createController.bind(this), 	["api_writer", "api_admin", "system_writer", "system_admin"]));

    //update
    this.app.put("/apis/:name", 							this.roleCheckHandler.enforceRoles(this.updateApi.bind(this), 			["api_writer", "api_admin", "system_writer", "system_admin"]));
    this.app.put("/apis/:name/controllers/:controller", 	this.roleCheckHandler.enforceRoles(this.updateController.bind(this), 	["api_writer", "api_admin", "system_writer", "system_admin"]));

    //delete
    this.app.delete("/apis/:name", 							this.roleCheckHandler.enforceRoles(this.deleteApi.bind(this), 			["api_writer", "api_admin", "system_writer", "system_admin"]));
    this.app.delete("/apis/:name/controllers/:controller", 	this.roleCheckHandler.enforceRoles(this.deleteController.bind(this), 	["api_writer", "api_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, dir, fileLister, roleCheckHandler, path) {
    if (!fileLister) {
        fileLister = require("../lib/fileLister")();
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require("../../support.lib/roleCheckHandler")();
    }

    if (!path) {
        path = require("path");
    }

    return new apiController(app, dir, fileLister, roleCheckHandler, path);
};