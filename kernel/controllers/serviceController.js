const serviceController = function(app, dir, fileLister, roleCheckHandler, path, childProcess) {
	this.app 				= app;
	this.dir 				= dir;
	this.path 				= path;
	this.fileLister 		= fileLister;
	this.roleCheckHandler 	= roleCheckHandler;
	this.childProcess 		= childProcess;

	this.initEndpoints();
};

serviceController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "*.js")).then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

serviceController.prototype.getSingular = function(req, res, next) {
	this.fileLister.readFile(this.dir, req.params.name + ".js").then((content) => {
		res.json(content);
		next();
	});
};

serviceController.prototype.update = function(req, res, next) {
	this.fileLister.writeFile(this.dir, req.params.name + ".js", req.body.payload).then(() => {
		res.status(204);
		res.send("");
		next();
	}).catch((err) => {
		res.status(422);
		res.json({
			errors : err
		});
		next();
	});
};

serviceController.prototype.delete = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, req.params.name + ".js").then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

serviceController.prototype.create = function(req, res, next) {
	this.fileLister.writeFile(this.dir, req.body.name + ".js", req.body.payload).then(() => {
		res.status(201);
		res.send("");
		next();
	}).catch((err) => {
		res.status(422);
		res.json({
			errors : err
		});
		next();
	});
};

/* dependency controllers */
serviceController.prototype.getDependencies = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, "package.json").then((content) => {
		let ret = [];
		Object.keys(content.dependencies).forEach((k) => {
			ret.push({
				name : k,
				version : content.dependencies[k]
			});
		});

		res.json(ret);
		res.status(200);
		next();
	});
};

serviceController.prototype.deleteDependency = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, "package.json").then((content) => {
		delete(content.dependencies[req.params.name]);
		return this.fileLister.writeFile(this.dir, "package.json", JSON.stringify(content, null, 4));
	}).then(() => {
		res.send("");
		res.status(204);
		next();
	});
};

serviceController.prototype.updateDependency = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, "package.json").then((content) => {
		delete(content.dependencies[req.params.name]);
		content.dependencies[req.params.name] = req.body.version;
		return this.fileLister.writeFile(this.dir, "package.json", JSON.stringify(content, null, 4));
	}).then(() => {
		res.send("");
		res.status(204);
		next();
	});
};

serviceController.prototype.createDependency = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, "package.json").then((content) => {
		delete(content.dependencies[req.body.name]);
		content.dependencies[req.body.name] = req.body.version;
		return this.fileLister.writeFile(this.dir, "package.json", JSON.stringify(content, null, 4));
	}).then(() => {
		res.send("");
		res.status(204);
		next();
	});
};

serviceController.prototype.installDependencies = function(req, res, next) {
	const proc = this.childProcess.spawn("npm", [
		"i"
	], {
		cwd : this.dir
	});

	let ret = {
		stdout : '',
		stderr : ''
	};

	proc.stdout.on('data', (data) => {
		ret.stdout += data.toString('utf8');
	});

	proc.stderr.on('data', (data) => {
		ret.stderr += data.toString('utf8');
	});

	proc.on('close', (code) => {
		if (code !== 0) {
			ret.success = false;
		} else {
			ret.success = true;
		}

		res.json(ret);
		res.status(200);
		next();
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
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	if (!childProcess) {
		childProcess = require("child_process");
	}

	return new serviceController(app, dir, fileLister, roleCheckHandler, path, childProcess);
};