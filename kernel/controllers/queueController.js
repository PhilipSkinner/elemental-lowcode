const queueController = function(app, dir, fileLister, roleCheckHandler, path) {
	this.app 				= app;
	this.dir 				= dir;
	this.path 				= path;
	this.fileLister 		= fileLister;
	this.roleCheckHandler 	= roleCheckHandler;

	this.initEndpoints();
};

queueController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob(this.path.join(this.dir, "*.queue.json")).then((results) => {
		res.json(results.map((r) => {
			r.name = r.name.slice(0, -6);
			return r;
		}));
		next();
	});
};

queueController.prototype.getSingular = function(req, res, next) {
	this.fileLister.readJSONFile(this.dir, req.params.name + ".queue.json").then((content) => {
		res.json(content);
		next();
	});
};

queueController.prototype.update = function(req, res, next) {
	this.fileLister.writeFile(this.dir, req.params.name + ".queue.json", JSON.stringify(req.body)).then(() => {
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

queueController.prototype.delete = function(req, res, next) {
	this.fileLister.deleteFile(this.dir, req.params.name + ".queue.json").then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

queueController.prototype.create = function(req, res, next) {
	this.fileLister.writeFile(this.dir, req.body.name + ".queue.json", JSON.stringify(req.body)).then(() => {
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

queueController.prototype.getHandler = function(req, res, next) {
	this.fileLister.readFile(this.dir, req.params.name + ".queue.js").then((content) => {
		res.status(200);
		res.send(content);
		next();
	});
};

queueController.prototype.setHandler = function(req, res, next) {
	this.fileLister.writeFile(this.dir, req.params.name + ".queue.js", req.body.payload).then(() => {
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

queueController.prototype.initEndpoints = function() {
	this.app.get("/queues", 				this.roleCheckHandler.enforceRoles(this.get.bind(this), 				["queue_reader", "queue_admin", "system_reader", "system_admin"]));
	this.app.get("/queues/:name", 			this.roleCheckHandler.enforceRoles(this.getSingular.bind(this), 		["queue_reader", "queue_admin", "system_reader", "system_admin"]));
	this.app.put("/queues/:name", 			this.roleCheckHandler.enforceRoles(this.update.bind(this), 				["queue_writer", "queue_admin", "system_writer", "system_admin"]));
	this.app.delete("/queues/:name", 		this.roleCheckHandler.enforceRoles(this.delete.bind(this), 				["queue_writer", "queue_admin", "system_writer", "system_admin"]));
	this.app.post("/queues", 				this.roleCheckHandler.enforceRoles(this.create.bind(this), 				["queue_writer", "queue_admin", "system_writer", "system_admin"]));
	this.app.get("/queues/:name/handler", 	this.roleCheckHandler.enforceRoles(this.getHandler.bind(this), 			["queue_reader", "queue_admin", "system_reader", "system_admin"]));
	this.app.put("/queues/:name/handler", 	this.roleCheckHandler.enforceRoles(this.setHandler.bind(this), 			["queue_writer", "queue_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, dir, fileLister, path, roleCheckHandler, typeValidator) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!path) {
		path = require("path");
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new queueController(app, dir, fileLister, roleCheckHandler, path);
};