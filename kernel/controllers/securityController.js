const securityController = function(app, identityDir, secretsDir, secretsStore, fileLister, roleCheckHandler, path) {
	this.app 				= app;
	this.identityDir 		= identityDir;
	this.secretsDir 		= secretsDir;
	this.secretsStore 		= secretsStore;
	this.path 				= path;
	this.fileLister 		= fileLister;
	this.roleCheckHandler 	= roleCheckHandler;

	this.initEndpoints();
};

securityController.prototype.getClients = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.identityDir, "**/*.client.json")).then((results) => {
		res.json(results.map((r) => {
			return Object.assign(r, {
				client_id : r.name.slice(0, -7)
			});
		}));
		next();
	});
};

securityController.prototype.getClient = function(req, res, next) {
	this.fileLister.readJSONFile(this.identityDir, `${req.params.id}.client.json`).then((content) => {
		res.json(content);
		next();
	});
};

securityController.prototype.createClient = function(req, res, next) {
	this.fileLister.writeFile(this.identityDir, `${req.body.client_id}.client.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

securityController.prototype.updateClient = function(req, res, next) {
	this.fileLister.writeFile(this.identityDir, `${req.body.client_id}.client.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.deleteClient = function(req, res, next) {
	this.fileLister.deleteFile(this.identityDir, `${req.params.id}.client.json`).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.getScopes = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.identityDir, "**/*.scope.json")).then((results) => {
		res.json(results.map((r) => {
			return Object.assign(r, {
				name : r.name.slice(0, -6)
			});
		}));
		next();
	});
};

securityController.prototype.getScope = function(req, res, next) {
	this.fileLister.readJSONFile(this.identityDir, `${req.params.name}.scope.json`).then((content) => {
		res.json(content);
		next();
	});
};

securityController.prototype.createScope = function(req, res, next) {
	this.fileLister.writeFile(this.identityDir, `${req.body.name}.scope.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

securityController.prototype.updateScope = function(req, res, next) {
	this.fileLister.writeFile(this.identityDir, `${req.body.name}.scope.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.deleteScope = function(req, res, next) {
	this.fileLister.deleteFile(this.identityDir, `${req.params.name}.scope.json`).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.getConfig = function(req, res, next) {
	this.fileLister.readJSONFile(this.identityDir, "main.json").then((content) => {
		res.json(content);
		next();
	});
};

securityController.prototype.saveConfig = function(req, res, next) {
	this.fileLister.writeFile(this.identityDir, "main.json", JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

/* SECRETS HANDLERS */

securityController.prototype.getSecrets = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.secretsDir, "**/*.secret.json")).then((results) => {
		Promise.all(results.map((r) => {
			return this.fileLister.readJSONFile(this.secretsDir, r.basename);
		})).then((all) => {
			res.json(all);
			next();
		});
	});
};

securityController.prototype.createSecret = function(req, res, next) {
	this.fileLister.writeFile(this.secretsDir, `${req.body.name}.secret.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.deleteSecret = function(req, res, next) {
	this.fileLister.deleteFile(this.secretsDir, `${req.params.name}.secret.json`).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.setSecret = function(req, res, next) {
	this.fileLister.writeFile(this.secretsStore, `${req.params.name}.secret.json`, JSON.stringify({
		value : req.body
	}, null, 4)).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

securityController.prototype.initEndpoints = function() {
	if (!this.app) {
		return;
	}

	this.app.get("/security/clients", 			this.roleCheckHandler.enforceRoles(this.getClients.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.get("/security/clients/:id", 		this.roleCheckHandler.enforceRoles(this.getClient.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.post("/security/clients", 			this.roleCheckHandler.enforceRoles(this.createClient.bind(this), 	["security_writer", "security_admin", "system_writer", "system_admin"]));
	this.app.put("/security/clients/:id", 		this.roleCheckHandler.enforceRoles(this.updateClient.bind(this), 	["security_writer", "security_admin", "system_writer", "system_admin"]));
	this.app.delete("/security/clients/:id", 	this.roleCheckHandler.enforceRoles(this.deleteClient.bind(this), 	["security_writer", "security_admin", "system_writer", "system_admin"]));

	this.app.get("/security/scopes", 			this.roleCheckHandler.enforceRoles(this.getScopes.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.get("/security/scopes/:name", 		this.roleCheckHandler.enforceRoles(this.getScope.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.post("/security/scopes", 			this.roleCheckHandler.enforceRoles(this.createScope.bind(this), 	["security_writer", "security_admin", "system_writer", "system_admin"]));
	this.app.put("/security/scopes/:name", 		this.roleCheckHandler.enforceRoles(this.updateScope.bind(this), 	["security_writer", "security_admin", "system_writer", "system_admin"]));
	this.app.delete("/security/scopes/:name", 	this.roleCheckHandler.enforceRoles(this.deleteScope.bind(this), 	["security_writer", "security_admin", "system_writer", "system_admin"]));

	this.app.get("/security/config", 			this.roleCheckHandler.enforceRoles(this.getConfig.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.put("/security/config", 			this.roleCheckHandler.enforceRoles(this.saveConfig.bind(this), 		["security_writer", "security_admin", "system_writer", "system_admin"]));

	this.app.get("/security/secrets", 			this.roleCheckHandler.enforceRoles(this.getSecrets.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.post("/security/secrets", 			this.roleCheckHandler.enforceRoles(this.createSecret.bind(this), 	["security_writer", "security_admin", "system_writer", "system_admin"]));
	this.app.delete("/security/secrets/:name", 	this.roleCheckHandler.enforceRoles(this.deleteSecret.bind(this), 	["security_writer", "security_admin", "system_writer", "system_admin"]));
	this.app.put("/security/secrets/:name", 	this.roleCheckHandler.enforceRoles(this.setSecret.bind(this), 		["security_writer", "security_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, identityDir, secretsDir, secretsStore, fileLister, roleCheckHandler, path) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	if (!path) {
		path = require("path");
	}

	return new securityController(app, identityDir, secretsDir, secretsStore, fileLister, roleCheckHandler, path);
};