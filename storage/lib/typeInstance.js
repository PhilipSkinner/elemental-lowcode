const typeInstance = function(store, app, definition, uuid, ajv, roleCheckHandler) {
	this.store 				= store;
	this.app 				= app;
	this.definition 		= definition;
	this.uuid 				= uuid;
	this.ajv 				= ajv;
	this.roleCheckHandler 	= roleCheckHandler;

	//setup the _id property
	this.definition.schema.properties["_id"] = {
		"type" : "string"
	};
};

typeInstance.prototype.getHandler = function(req, res) {
	const filters = [];
	Object.keys(req.query).forEach((param) => {
		//filter_$.path.to.variable
		if (param.indexOf("filter_") === 0) {
			filters.push({
				path 	: param.slice(7),
				value 	: req.query[param]
			});
		}
	});

	this.store.getResources(this.definition.name, req.query.start, req.query.count, filters).then((data) => {
		res.json(data);
		res.end();
	}).catch((err) => {
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		res.end();
		return;
	});
};

typeInstance.prototype.getDetailsHandler = function(req, res) {
	this.store.getDetails(this.definition.name).then((data) => {
		res.json(data);
		res.end();
	}).catch((err) => {
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		res.end();
		return;
	});
};

typeInstance.prototype.createHandler = function(req, res) {
	//confirm that the structure is correct
	let validator = this.ajv.compile(this.definition.schema);

	if (!validator(req.body)) {
		res.json({
			errors : validator.errors
		});
		res.status(422);
		res.end();
		return;
	}

	let newId = this.uuid();

	this.store.createResource(this.definition.name, newId, req.body).then((success) => {
		if (!success) {
			res.json({
				errors : [
					"error constructing object"
				]
			});
			res.status(424);
			res.end();
			return;
		}

		res.header("Location", `/${this.definition.name}/${newId}`);
		res.status(201);
		res.send("");
		res.end();
		return;
	}).catch((err) => {
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		res.end();
		return;
	});
};

typeInstance.prototype.getSingleHandler = function(req, res) {
	this.store.getResource(this.definition.name, req.params.id).then((data) => {
		if (!data) {
			res.status(404);
			res.send("");
			res.end();
			return;
		}

		res.json(data);
		res.end();
	});
};

typeInstance.prototype.updateHandler = function(req, res) {
	let validator = this.ajv.compile(this.definition.schema);

	if (!validator(req.body)) {
		res.json({
			errors : validator.errors
		});
		res.status(422);
		res.end();
		return;
	}

	this.store.updateResource(this.definition.name, req.params.id, req.body).then((success) => {
		if (!success) {
			res.json({
				errors : [
					"error updating object"
				]
			});
			res.status(424);
			res.end();
			return;
		}

		res.header("Location", `/${this.definition.name}/${req.params.id}`);
		res.status(204);
		res.send("");
		res.end();
		return;
	}).catch((err) => {
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		res.end();
		return;
	});
};

typeInstance.prototype.deleteHandler = function(req, res) {
	this.store.deleteResource(this.definition.name, req.params.id).then((success) => {
		if (!success) {
			res.json({
				errors : [
					"error deleting object"
				]
			});
			res.status(424);
			res.end();
			return;
		}

		res.status(204);
		res.send("");
		res.end();
		return;
	}).catch((err) => {
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		res.end();
		return;
	});
};

typeInstance.prototype.patchHandler = function(req, res) {

	this.store.getResource(this.definition.name, req.params.id).then((resource) => {
		if (resource === null) {
			res.status(404);
			res.send("");
			res.end();
			return;
		}

		var newResource = Object.assign(resource, req.body);

		//check its schema
		let validator = this.ajv.compile(this.definition.schema);

		if (!validator(newResource)) {
			res.json({
				errors : validator.errors
			});
			res.status(422);
			res.end();
			return;
		}

		this.store.updateResource(this.definition.name, req.params.id, newResource).then((success) => {
			if (!success) {
				res.json({
					errors : [
						"error updating object"
					]
				});
				res.status(424);
				res.end();
				return;
			}

			res.header("Location", `/${this.definition.name}/${req.params.id}`);
			res.status(204);
			res.send("");
			res.end();
			return;
		});
	});
};

typeInstance.prototype.init = function() {
	return new Promise((resolve, reject) => {
		let readerRoles = [
			"system_admin",
			"system_reader",
			"data_reader",
			this.definition.name + "_reader"
		];
		let writerRoles = [
			"system_admin",
			"system_writer",
			"data_writer",
			this.definition.name + "_writer"
		];
		let deletionRoles = [
			"system_admin",
			"system_writer",
			"data_writer",
			this.definition.name + "_writer"
		];

		if (this.definition.roles) {
			//clear our roles if we've been told to
			if (this.definition.roles.replace) {
				if (this.definition.roles.replace.read === true) {
					readerRoles = ["system_admin",];
				}
				if (this.definition.roles.replace.write === true) {
					writerRoles = ["system_admin",];
				}
				if (this.definition.roles.replace.delete === true) {
					deletionRoles = ["system_admin",];
				}
			}

			//add in our custom roles if we have them
			if (this.definition.roles.read) {
				readerRoles = readerRoles.concat(this.definition.roles.read);
			}

			if (this.definition.roles.write) {
				writerRoles = writerRoles.concat(this.definition.roles.write);
			}

			if (this.definition.roles.delete) {
				deletionRoles = deletionRoles.concat(this.definition.roles.delete);
			}

			//finally, do we allow access for any roles?
			if (this.definition.roles.needsRole) {
				if (this.definition.roles.needsRole.read === false) {
					readerRoles = null;
				}
				if (this.definition.roles.needsRole.write === false) {
					writerRoles = null;
				}
				if (this.definition.roles.needsRole.delete === false) {
					deletionRoles = null;
				}
			}
		}

		console.log(`Initializing type ${this.definition.name}`);

		console.log(`Hosting GET /${this.definition.name}`);
		this.app.get(`/${this.definition.name}`, 			this.roleCheckHandler.enforceRoles(this.getHandler.bind(this), 			readerRoles));

		console.log(`Hosting GET /${this.definition.name}/.details`);
		this.app.get(`/${this.definition.name}/.details`, 	this.roleCheckHandler.enforceRoles(this.getDetailsHandler.bind(this), 	readerRoles));

		console.log(`Hosting POST /${this.definition.name}`);
		this.app.post(`/${this.definition.name}`, 			this.roleCheckHandler.enforceRoles(this.createHandler.bind(this), 		writerRoles));

		console.log(`Hosting GET /${this.definition.name}/:id`);
		this.app.get(`/${this.definition.name}/:id`, 		this.roleCheckHandler.enforceRoles(this.getSingleHandler.bind(this), 	readerRoles));

		console.log(`Hosting PUT /${this.definition.name}/:id`);
		this.app.put(`/${this.definition.name}/:id`, 		this.roleCheckHandler.enforceRoles(this.updateHandler.bind(this), 		writerRoles));

		console.log(`Hosting DELETE /${this.definition.name}/:id`);
		this.app.delete(`/${this.definition.name}/:id`, 	this.roleCheckHandler.enforceRoles(this.deleteHandler.bind(this), 		deletionRoles));

		console.log(`Hosting PATCH /${this.definition.name}/:id`);
		this.app.patch(`/${this.definition.name}/:id`, 		this.roleCheckHandler.enforceRoles(this.patchHandler.bind(this), 		writerRoles));

		return resolve();
	});
};

module.exports = function(store, app, definition, uuid, ajv, roleCheckHandler) {
	if (!uuid) {
		uuid = require("uuid/v4");
	}

	if (!ajv) {
		ajv = require("ajv")({
			allErrors : true
		});
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new typeInstance(store, app, definition, uuid, ajv, roleCheckHandler);
};