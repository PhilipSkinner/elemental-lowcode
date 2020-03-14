const rulesController = function(app, fileLister, roleCheckHandler) {
	this.app = app;
	this.fileLister = fileLister;
	this.roleCheckHandler = roleCheckHandler;

	this.initEndpoints();
};

rulesController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob(".sources/rules/**/*.json").then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

rulesController.prototype.getSingular = function(req, res, next) {
	this.fileLister.readJSONFile(".sources/rules/", req.params.name + ".json").then((content) => {
		res.json(content);
		next();
	});
};

rulesController.prototype.update = function(req, res, next) {
	this.fileLister.writeFile(".sources/rules/", req.params.name + ".json", JSON.stringify(req.body)).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

rulesController.prototype.create = function(req, res, next) {
	this.fileLister.writeFile(".sources/rules/", req.body.name + ".json", JSON.stringify(req.body)).then(() => {
		res.status(201);
		res.send("");
		next();
	});
};

rulesController.prototype.initEndpoints = function() {
	this.app.get("/rules", 			this.roleCheckHandler.enforceRoles(this.get.bind(this), 		["rule_reader", "rule_admin", "system_reader", "system_admin"]));
	this.app.get("/rules/:name", 	this.roleCheckHandler.enforceRoles(this.getSingular.bind(this), ["rule_reader", "rule_admin", "system_reader", "system_admin"]));
	this.app.put("/rules/:name", 	this.roleCheckHandler.enforceRoles(this.update.bind(this), 		["rule_writer", "rule_admin", "system_writer", "system_admin"]));
	this.app.post("/rules", 		this.roleCheckHandler.enforceRoles(this.create.bind(this), 		["rule_writer", "rule_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, fileLister, path, roleCheckHandler) {
	if (!fileLister) {
		fileLister = require("../lib/fileLister")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new rulesController(app, fileLister, roleCheckHandler);
};