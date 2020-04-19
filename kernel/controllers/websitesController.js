const websitesController = function(app, dir, path, fileLister, roleCheckHandler) {
	this.app = app;
	this.dir = dir;
	this.path = path;
	this.fileLister = fileLister;
	this.roleCheckHandler = roleCheckHandler;

	this.initEndpoints();
};

websitesController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "*.website.json")).then((results) => {
		res.json(results.map((r) => {
			r.name = r.name.split(".").slice(0, -1).join(".");
			return r;
		}));
		next();
	});
};

websitesController.prototype.getWebsite = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, req.params.name + ".website.json").then((data) => {
		res.json(data);
		next();
	});
};

websitesController.prototype.updateWebsite = function(req, res, next) {
	this.fileLister.writeFile(this.dir, req.params.name + ".website.json", JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

websitesController.prototype.deleteWebsite = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, `${req.params.name}.website.json`).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

websitesController.prototype.getResource = function(req, res, next) {
	this.fileLister.readFile(this.dir, req.query.path).then((data) => {
		res.send(data);
		next();
	});
};

websitesController.prototype.createOrUpdateResource = function(req, res, next) {
	this.fileLister.ensureDir(this.path.join(this.dir, this.path.dirname(req.query.path))).then(() => {
		this.fileLister.writeFile(this.dir, req.query.path, req.body.resource).then(() => {
			res.status(204);
			res.send("");
			next();
		});
	});
};

websitesController.prototype.uploadStaticFile = function(req, res, next) {
	this.fileLister.ensureDir(this.path.join(this.dir, `${req.params.name}-static`)).then(() => {
		this.fileLister.writeFile(this.dir, this.path.join(`${req.params.name}-static`, req.files.resource.name), req.files.resource.data).then(() => {
			res.status(204);
			res.send("");
			next();
		});
	});
};

websitesController.prototype.getStaticFiles = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, `${req.params.name}-static/**/*`)).then((results) => {
		res.json(results.map((r) => {
			r.absolutePath = `/${req.params.name}/static/${r.basename}`;
			return r;
		}));
		next();
	});
};

websitesController.prototype.deleteStaticFile = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, this.path.join(`${req.params.name}-static`, req.params.filename)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

/*
 * Tagset controllers
 */

websitesController.prototype.getPossibleTags = function(req, res, next) {
	this.fileLister.readFile(this.path.join(__dirname, '../resources/tagsets'), `${req.params.name}.json`).then((data) => {
		res.send(data);
		next();
	});
};

websitesController.prototype.getProperties = function(req, res, next) {
	this.fileLister.readFile(this.path.join(__dirname, '../resources/properties'), `${req.params.name}.json`).then((data) => {
		res.send(data);
		next();
	});
};

websitesController.prototype.initEndpoints = function() {
	this.app.get("/properties/:name", 							this.roleCheckHandler.enforceRoles(this.getProperties.bind(this), 			["website_reader", "website_admin", "system_reader", "system_admin"]));
	this.app.get("/tags/:name", 								this.roleCheckHandler.enforceRoles(this.getPossibleTags.bind(this), 		["website_reader", "website_admin", "system_reader", "system_admin"]));

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
		path = require('path');
	}

	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new websitesController(app, dir, path, fileLister, roleCheckHandler);
};