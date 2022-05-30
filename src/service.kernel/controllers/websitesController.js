const websitesController = function(app, dir, path, fileLister, roleCheckHandler) {
    this.app = app;
    this.dir = dir;
    this.path = path;
    this.fileLister = fileLister;
    this.roleCheckHandler = roleCheckHandler;

    this.initEndpoints();
};

websitesController.prototype.get = function(req, res) {
    this.fileLister.executeGlob(this.path.join(this.dir, "*.website.json")).then((results) => {
        res.status(200);
        res.json(results.map((r) => {
            r.name = r.name.split(".").slice(0, -1).join(".");
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

websitesController.prototype.getWebsite = function(req, res) {
    this.fileLister.readJSONFile(this.dir, req.params.name + ".website.json").then((data) => {
        res.status(200);
        res.json(data);
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

websitesController.prototype.updateWebsite = function(req, res) {
    this.fileLister.writeFile(this.dir, req.params.name + ".website.json", JSON.stringify(req.body, null, 4)).then(() => {
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

websitesController.prototype.deleteWebsite = function(req, res) {
    this.fileLister.deleteFile(this.dir, `${req.params.name}.website.json`).then(() => {
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

websitesController.prototype.getResource = function(req, res) {
    this.fileLister.readFile(this.dir, req.query.path).then((data) => {
        res.status(200);
        res.send(data);
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

websitesController.prototype.createOrUpdateResource = function(req, res) {
    this.fileLister.writeFile(this.dir, req.query.path, req.body.resource).then(() => {
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

websitesController.prototype.uploadStaticFile = function(req, res) {
    this.fileLister.writeFile(this.path.join(this.dir, `${req.params.name}-static`), req.body.name, Buffer.from(req.body.file, "base64")).then(() => {
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

websitesController.prototype.getStaticFiles = function(req, res) {
    this.fileLister.executeGlob(this.path.join(this.dir, `${req.params.name}-static/**/*`)).then((results) => {
        res.status(200);
        res.json(results.map((r) => {
            r.absolutePath = `/${req.params.name}/static/${r.basename}`;
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

websitesController.prototype.deleteStaticFile = function(req, res) {
    this.fileLister.deleteFile(this.dir, this.path.join(`${req.params.name}-static`, req.params.filename)).then(() => {
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

/*
 * Tagset controllers
 */

websitesController.prototype.getTagsets = function(req, res) {
    this.fileLister.executeGlob(this.path.join(this.dir, "tagsets/**/*.json")).then((results) => {
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

websitesController.prototype.getPossibleTags = function(req, res) {
    this.fileLister.readFile(this.path.join(__dirname, "../resources/tagsets"), `${req.params.name}.json`).then((data) => {
        res.status(200);
        res.send(data);
        res.end();
    }).catch(() => {
        return this.fileLister.readFile(this.dir, `tagsets/${req.params.name}.json`).then((data) => {
            res.status(200);
            res.send(data);
            res.end();
        });
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

websitesController.prototype.saveTagset = function(req, res) {
    this.fileLister.writeFile(this.path.join(this.dir, "tagsets"), `${req.params.name}.json`, JSON.stringify(req.body, null, 4)).then(() => {
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

websitesController.prototype.deleteTagset = function(req, res) {
    this.fileLister.deleteFile(this.path.join(this.dir, "tagsets"), `${req.params.name}.json`).then(() => {
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

websitesController.prototype.getProperties = function(req, res) {
    this.fileLister.readFile(this.path.join(__dirname, "../resources/properties"), `${req.params.name}.json`).then((data) => {
        res.status(200);
        res.send(data);
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

/*
 * Config controllers
 */

websitesController.prototype.getConfig = function(req, res) {
    this.fileLister.readJSONFile(this.dir, "main.json").then((content) => {
        res.status(200);
        res.json(content);
        res.end();
    }).catch(() => {
        res.status(200);
        res.json({});
        res.end();
    });
};

websitesController.prototype.saveConfig = function(req, res) {
    this.fileLister.writeFile(this.dir, "main.json", JSON.stringify(req.body, null, 4)).then(() => {
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

websitesController.prototype.initEndpoints = function() {
    if (!this.app) {
        return;
    }

    this.app.get("/properties/:name", 							this.roleCheckHandler.enforceRoles(this.getProperties.bind(this), 			["website_reader", "website_admin", "system_reader", "system_admin"]));
    this.app.get("/tags/", 										this.roleCheckHandler.enforceRoles(this.getTagsets.bind(this), 				["website_reader", "website_admin", "system_reader", "system_admin"]));
    this.app.get("/tags/:name", 								this.roleCheckHandler.enforceRoles(this.getPossibleTags.bind(this), 		["website_reader", "website_admin", "system_reader", "system_admin"]));
    this.app.put("/tags/:name", 								this.roleCheckHandler.enforceRoles(this.saveTagset.bind(this), 				["website_writer", "website_admin", "system_writer", "system_admin"]));
    this.app.delete("/tags/:name", 								this.roleCheckHandler.enforceRoles(this.deleteTagset.bind(this), 			["website_writer", "website_admin", "system_writer", "system_admin"]));

    this.app.get("/websitesConfig", 							this.roleCheckHandler.enforceRoles(this.getConfig.bind(this), 				["website_reader", "website_admin", "system_reader", "system_admin"]));
    this.app.put("/websitesConfig", 							this.roleCheckHandler.enforceRoles(this.saveConfig.bind(this), 				["website_writer", "website_admin", "system_writer", "system_admin"]));

    this.app.get("/websites", 									this.roleCheckHandler.enforceRoles(this.get.bind(this), 					["website_reader", "website_admin", "system_reader", "system_admin"]));
    this.app.get("/websites/:name", 							this.roleCheckHandler.enforceRoles(this.getWebsite.bind(this), 				["website_reader", "website_admin", "system_reader", "system_admin"]));
    this.app.put("/websites/:name", 							this.roleCheckHandler.enforceRoles(this.updateWebsite.bind(this), 			["website_writer", "website_admin", "system_writer", "system_admin"]));
    this.app.delete("/websites/:name", 							this.roleCheckHandler.enforceRoles(this.deleteWebsite.bind(this), 			["website_writer", "website_admin", "system_writer", "system_admin"]));
    this.app.get("/websites/:name/resource", 					this.roleCheckHandler.enforceRoles(this.getResource.bind(this), 			["website_writer", "website_admin", "system_writer", "system_admin"]));
    this.app.post("/websites/:name/resource", 					this.roleCheckHandler.enforceRoles(this.createOrUpdateResource.bind(this), 	["website_writer", "website_admin", "system_writer", "system_admin"]));
    this.app.get("/websites/:name/staticfiles", 				this.roleCheckHandler.enforceRoles(this.getStaticFiles.bind(this), 			["website_reader", "website_admin", "system_reader", "system_admin"]));
    this.app.post("/websites/:name/staticfiles", 				this.roleCheckHandler.enforceRoles(this.uploadStaticFile.bind(this), 		["website_writer", "website_admin", "system_writer", "system_admin"]));
    this.app.delete("/websites/:name/staticfiles/:filename", 	this.roleCheckHandler.enforceRoles(this.deleteStaticFile.bind(this), 		["website_writer", "website_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, dir, path, fileLister, roleCheckHandler) {
    if (!path) {
        path = require("path");
    }

    if (!fileLister) {
        fileLister = require("../lib/fileLister")();
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require("../../support.lib/roleCheckHandler")();
    }

    return new websitesController(app, dir, path, fileLister, roleCheckHandler);
};