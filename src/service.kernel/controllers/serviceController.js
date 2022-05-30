const serviceController = function(app, dir, fileLister, roleCheckHandler, path, childProcess) {
    this.app 				= app;
    this.dir 				= dir;
    this.path 				= path;
    this.fileLister 		= fileLister;
    this.roleCheckHandler 	= roleCheckHandler;
    this.childProcess 		= childProcess;

    this.initEndpoints();
};

serviceController.prototype.get = function(req, res) {
    this.fileLister.executeGlob(this.path.join(this.dir, "*.js")).then((results) => {
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

serviceController.prototype.getSingular = function(req, res) {
    this.fileLister.readFile(this.dir, req.params.name + ".js").then((content) => {
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

serviceController.prototype.update = function(req, res) {
    this.fileLister.writeFile(this.dir, req.params.name + ".js", req.body.payload).then(() => {
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

serviceController.prototype.delete = function(req, res) {
    this.fileLister.deleteFile(this.dir, req.params.name + ".js").then(() => {
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

serviceController.prototype.create = function(req, res) {
    this.fileLister.writeFile(this.dir, req.body.name + ".js", req.body.payload).then(() => {
        res.status(201);
        res.location("/services/" + req.body.name);
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

/* dependency controllers */
serviceController.prototype.getDependencies = function(req, res) {
    this.fileLister.readJSONFile(this.dir, "package.json").then((content) => {
        let ret = [];
        Object.keys(content.dependencies).forEach((k) => {
            ret.push({
                name : k,
                version : content.dependencies[k]
            });
        });

        res.status(200);
        res.json(ret);
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

serviceController.prototype.deleteDependency = function(req, res) {
    this.fileLister.readJSONFile(this.dir, "package.json").then((content) => {
        delete(content.dependencies[req.params.name]);
        return this.fileLister.writeFile(this.dir, "package.json", JSON.stringify(content, null, 4));
    }).then(() => {
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

serviceController.prototype.updateDependency = function(req, res) {
    this.fileLister.readJSONFile(this.dir, "package.json").then((content) => {
        delete(content.dependencies[req.params.name]);
        content.dependencies[req.params.name] = req.body.version;
        return this.fileLister.writeFile(this.dir, "package.json", JSON.stringify(content, null, 4));
    }).then(() => {
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

serviceController.prototype.createDependency = function(req, res) {
    this.fileLister.readJSONFile(this.dir, "package.json").then((content) => {
        delete(content.dependencies[req.body.name]);
        content.dependencies[req.body.name] = req.body.version;
        return this.fileLister.writeFile(this.dir, "package.json", JSON.stringify(content, null, 4));
    }).then(() => {
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

serviceController.prototype.installDependencies = function(req, res) {
    const proc = this.childProcess.spawn("npm", [
        "i"
    ], {
        cwd : this.dir
    });

    let ret = {
        stdout : "",
        stderr : ""
    };

    proc.stdout.on("data", (data) => {
        ret.stdout += data.toString("utf8");
    });

    proc.stderr.on("data", (data) => {
        ret.stderr += data.toString("utf8");
    });

    proc.on("close", (code) => {
        if (code !== 0) {
            ret.success = false;
        } else {
            ret.success = true;
        }

        res.json(ret);
        res.status(200);
        res.end();
    });
};

serviceController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get("/services", 				this.roleCheckHandler.enforceRoles(this.get.bind(this), 				["service_reader", "service_admin", "system_reader", "system_admin"]));
    this.app.get("/services/:name", 		this.roleCheckHandler.enforceRoles(this.getSingular.bind(this), 		["service_reader", "service_admin", "system_reader", "system_admin"]));
    this.app.put("/services/:name", 		this.roleCheckHandler.enforceRoles(this.update.bind(this), 				["service_writer", "service_admin", "system_writer", "system_admin"]));
    this.app.delete("/services/:name", 		this.roleCheckHandler.enforceRoles(this.delete.bind(this), 				["service_writer", "service_admin", "system_writer", "system_admin"]));
    this.app.post("/services", 				this.roleCheckHandler.enforceRoles(this.create.bind(this), 				["service_writer", "service_admin", "system_writer", "system_admin"]));

    this.app.get("/dependencies", 			this.roleCheckHandler.enforceRoles(this.getDependencies.bind(this), 	["service_reader", "service_admin", "system_reader", "system_admin"]));
    this.app.put("/dependencies/:name", 	this.roleCheckHandler.enforceRoles(this.updateDependency.bind(this), 	["service_writer", "service_admin", "system_writer", "system_admin"]));
    this.app.delete("/dependencies/:name", 	this.roleCheckHandler.enforceRoles(this.deleteDependency.bind(this),	["service_writer", "service_admin", "system_writer", "system_admin"]));
    this.app.post("/dependencies", 			this.roleCheckHandler.enforceRoles(this.createDependency.bind(this), 	["service_writer", "service_admin", "system_writer", "system_admin"]));
    this.app.patch("/dependencies", 		this.roleCheckHandler.enforceRoles(this.installDependencies.bind(this), ["service_writer", "service_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, dir, fileLister, path, roleCheckHandler, childProcess) {
    if (!fileLister) {
        fileLister = require("../lib/fileLister")();
    }

    if (!path) {
        path = require("path");
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require("../../support.lib/roleCheckHandler")();
    }

    if (!childProcess) {
        childProcess = require("child_process");
    }

    return new serviceController(app, dir, fileLister, roleCheckHandler, path, childProcess);
};