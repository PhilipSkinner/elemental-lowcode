const securityController = function(app, dir, fileLister, roleCheckHandler, db, bcrypt, path) {
	this.app = app;
	this.dir = dir;
	this.path = path;
	this.fileLister = fileLister;
	this.roleCheckHandler = roleCheckHandler;
	this.db = db;
	this.userDB = new this.db("User");
	this.bcrypt = bcrypt;

	this.connected = false;

	this.initEndpoints();
};

securityController.prototype.getClients = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "**/*.client.json")).then((results) => {
		res.json(results.map((r) => {
			return Object.assign(r, {
				client_id : r.name.slice(0, -7)
			});
		}));
		next();
	});
};

securityController.prototype.getClient = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, `${req.params.id}.client.json`).then((content) => {
		res.json(content);
		next();
	});
};

securityController.prototype.createClient = function(req, res, next) {
	this.fileLister.writeFile(this.dir, `${req.body.client_id}.client.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

securityController.prototype.updateClient = function(req, res, next) {
	this.fileLister.writeFile(this.dir, `${req.body.client_id}.client.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.deleteClient = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, `${req.params.id}.client.json`).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.getScopes = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "**/*.scope.json")).then((results) => {
		res.json(results.map((r) => {
			return Object.assign(r, {
				name : r.name.slice(0, -6)
			});
		}));
		next();
	});
};

securityController.prototype.getScope = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, `${req.params.name}.scope.json`).then((content) => {
		res.json(content);
		next();
	});
};

securityController.prototype.createScope = function(req, res, next) {
	this.fileLister.writeFile(this.dir, `${req.body.name}.scope.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

securityController.prototype.updateScope = function(req, res, next) {
	this.fileLister.writeFile(this.dir, `${req.body.name}.scope.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.deleteScope = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, `${req.params.name}.scope.json`).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype._connect = function() {
	if (this.connected) {
		return Promise.resolve();
	}

	return new Promise((resolve, reject) => {
		this.db.connect().then(() => {
			this.connected = true;
			return resolve();
		});
	});
}

securityController.prototype.getUsers = function(req, res, next) {
	this._connect().then(() => {
		return this.userDB.fetch();
	}).then((users) => {
		res.json(users);
		next();
	});
};

securityController.prototype.getUser = function(req, res, next) {
	this._connect().then(() => {
		return this.userDB.find(req.params.id);
	}).then((user) => {
		res.json(user);
		next();
	});
};

securityController.prototype.createUser = function(req, res, next) {
	this._connect().then(() => {
		//generate the password
		return new Promise((resolve, reject) => {
			this.bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					return reject(err);
				}

				return resolve(hash);
			});
		});
	}).then((password) => {
		req.body.password = password;
		return this.userDB.upsert(req.body.username, req.body, null);
	}).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

securityController.prototype.updateUser = function(req, res, next) {
	this._connect().then(() => {
		//do we need to generate a password?
		if (/^\$\d.\$\d{1,2}.*?\..*?$/gm.test(req.body.password) === false) {
			return new Promise((resolve, reject) => {
				this.bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return reject(err);
					}

					return resolve(hash);
				});
			});
		}

		return Promise.resolve(req.body.password);
	}).then((password) => {
		req.body.password = password;
		return this.userDB.upsert(req.params.id, req.body, null);
	}).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.deleteUser = function(req, res, next) {
	this._connect().then(() => {
		return this.userDB.destroy(req.params.id);
	}).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.getConfig = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, "main.json").then((content) => {
		res.json(content);
		next();
	});
};

securityController.prototype.saveConfig = function(req, res, next) {
	this.fileLister.writeFile(this.dir, "main.json", JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

securityController.prototype.initEndpoints = function() {
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

	this.app.get("/security/users", 			this.roleCheckHandler.enforceRoles(this.getUsers.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.get("/security/users/:id", 		this.roleCheckHandler.enforceRoles(this.getUser.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.post("/security/users", 			this.roleCheckHandler.enforceRoles(this.createUser.bind(this), 		["security_writer", "security_admin", "system_writer", "system_admin"]));
	this.app.put("/security/users/:id", 		this.roleCheckHandler.enforceRoles(this.updateUser.bind(this), 		["security_writer", "security_admin", "system_writer", "system_admin"]));
	this.app.delete("/security/users/:id",		this.roleCheckHandler.enforceRoles(this.deleteUser.bind(this), 		["security_writer", "security_admin", "system_writer", "system_admin"]));

	this.app.get("/security/config", 			this.roleCheckHandler.enforceRoles(this.getConfig.bind(this), 		["security_reader", "security_admin", "system_reader", "system_admin"]));
	this.app.put("/security/config", 			this.roleCheckHandler.enforceRoles(this.saveConfig.bind(this), 		["security_writer", "security_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, dir, fileLister, roleCheckHandler, db, bcrypt, path) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	if (!db) {
		db = require("../../shared/db")();
	}

	if (!bcrypt) {
		bcrypt = require("bcrypt");
	}

	if (!path) {
		path = require("path");
	}

	return new securityController(app, dir, fileLister, roleCheckHandler, db, bcrypt, path);
};