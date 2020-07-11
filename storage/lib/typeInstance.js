const typeInstance = function(store, app, definition, uuid, ajv, roleCheckHandler, jsonpath, hostnameResolver) {
	this.store 				= store;
	this.app 				= app;
	this.definition 		= definition;
	this.uuid 				= uuid;
	this.ajv 				= ajv;
	this.roleCheckHandler 	= roleCheckHandler;
	this.jsonpath 			= jsonpath;
	this.hostnameResolver 	= hostnameResolver;
	this.schemas 			= {};

	//setup the id property
	this.definition.schema.properties["id"] = {
		"type" : "string"
	};
};

typeInstance.prototype.determineIdentifiers = function(req) {
	const inverted = {};
	Object.keys(req.params).forEach((k) => {
		inverted[req.params[k]] = k;
	});
	const identifiers = [];
	let last = '';
	let lastIdentifier = null;
	req.path.toLowerCase().split('/').forEach((p, index, arr) => {
		if (p === '' || p === '.details') {
			return;
		}

		if (Object.keys(inverted).indexOf(p) === -1) {
			if (last === '') {
				last = p;
			} else {
				last = `${last}_${p}`;
			}
			lastIdentifier = null;
		} else {
			lastIdentifier = p;
			identifiers.push({
				type 		: last,
				identifier 	: p
			});
		}
	});

	if (last !== '' && lastIdentifier === null) {
		identifiers.push({
			type 		: last,
			identifier 	: null
		});
	}

	return identifiers;
}

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

	const identifiers = this.determineIdentifiers(req);
	let prom = new Promise((resolve) => {
		resolve(true);
	});

	//has a parent?
	if (identifiers.length > 1) {
		const parent = identifiers.slice(-2)[0];
		filters.push({
			path 	: "$.parent",
			value 	: parent.identifier
		});
		prom = this.store.getResource(parent.type, parent.identifier);
	}

	//the items we are getting is the last in the list
	const toFetch = identifiers.slice(-1)[0];

	prom.then((result) => {
		if (!result) {
			res.status(404).end();
			return;
		}

		this.store.getResources(toFetch.type, req.query.start, req.query.count, filters).then((data) => {
			res.json(data);
			res.end();
		}).catch((err) => {
			res.status(500).json({
				errors : [err.toString()]
			}).end();
			return;
		});
	});
};

typeInstance.prototype.getDetailsHandler = function(req, res) {
	const identifiers = this.determineIdentifiers(req);
	const toFetch = identifiers.slice(-1)[0];
	let parent = {
		identifier : null
	};

	let prom = new Promise((resolve) => {
		resolve(true);
	});
	if (identifiers.length > 1) {
		//we have a parent to check
		parent = identifiers.slice(-2)[0];
		prom = this.store.getResource(parent.type, parent.identifier);
	}

	prom.then((result) => {
		if (!result) {
			res.status(404).end();
			return;
		}

		return this.store.getDetails(toFetch.type, parent.identifier).then((data) => {
			res.json(data);
			res.end();
		});
	}).catch((err) => {
		res.status(500).json({
			errors : [err.toString()]
		}).end();
		return;
	});
};

typeInstance.prototype.isUnique = function(data) {
	const ret = {
		isUnique 	: true,
		errors 		: []
	};

	if (!this.definition.keys) {
		return Promise.resolve(ret);
	}

	return new Promise((resolve, reject) => {
		Promise.all(this.definition.keys.map((key) => {
			if (key.type !== "unique") {
				return Promise.resolve(null);
			}

			return this.store.getResources(this.definition.name, 0, 1, key.paths.map((p) => {
				return {
					path 	: p,
					value 	: this.jsonpath.query(data, p)[0]
				};
			})).then((res) => {
				return Promise.resolve({
					isUnique 	: res.length === 0,
					errors 		: res.length === 0 ? [] : [
						`Duplicate key error - ${key.paths.join(', ')}`
					]
				});
			});
		})).then((results) => {
			if (results && results.length > 0) {
				results.forEach((keyResult) => {
					if (keyResult && keyResult.isUnique === false) {
						ret.isUnique = false;
						ret.errors = ret.errors.concat(keyResult.errors);
					}
				});
			}

			return resolve(ret);
		});
	});
};

typeInstance.prototype.createHandler = function(req, res) {
	const identifiers = this.determineIdentifiers(req);

	//the item we are updating is the last in the list
	const toFetch = identifiers.slice(-1)[0];

	let validator = this.ajv.compile(this.schemas[toFetch.type]);
	let parent = null;
	let prom = new Promise((resolve) => {
		resolve(true);
	});

	if (!validator(req.body)) {
		res.status(422).json({
			errors : validator.errors
		}).end();
		return;
	}

	let newId = this.uuid();

	//does it need a parent setting?
	if (identifiers.length > 1) {
		parent = identifiers.slice(-2)[0];
		req.body.parent = parent.identifier;
		prom = this.store.getResource(parent.type, parent.identifier);
	}

	this.isUnique(req.body).then((result) => {
		if (!result.isUnique) {
			res.status(409).json({
				errors : result.errors
			}).end();
			return;
		}

		prom.then((result) => {
			if (!result) {
				res.status(404).end();
				return;
			}

			this.store.createResource(toFetch.type, newId, req.body).then((success) => {
				if (!success) {
					res.status(424).json({
						errors : [
							"error constructing object"
						]
					}).end();
					return;
				}

				res.header("Location", `/${this.definition.name}/${newId}`);
				res.status(201);
				res.send("");
				res.end();
				return;
			}).catch((err) => {
				res.status(500).json({
					errors : [err.toString()]
				}).end();
				return;
			});
		});
	});
};

typeInstance.prototype.getSingleHandler = function(req, res, next) {
	const identifiers = this.determineIdentifiers(req);

	//the item we are fetching is the last in the list
	const toFetch = identifiers.slice(-1)[0];

	//if the identifier is null just call next
	if (toFetch.identifier === null && identifiers.length > 1) {
		//we're finding a single child item
		const filters = [];
		const parent = identifiers.slice(-2)[0];

		//does the parent exist?
		this.store.getResource(parent.type, parent.identifier).then((data) => {
			if (!data) {
				res.status(404).end();
				return;
			}

			filters.push({
				path 	: "$.parent",
				value 	: parent.identifier
			});

			this.store.getResources(toFetch.type, 1, 1, filters).then((data) => {
				if (data.length === 1 && data[0]) {
					res.json(data[0]).end();
				} else {
					res.json({}).end();
				}
			}).catch((err) => {
				res.status(500).json({
					errors : [err.toString()]
				}).end();
				return;
			});
		});
	} else {
		this.store.getResource(toFetch.type, toFetch.identifier).then((data) => {
			if (!data) {
				res.status(404).send("").end();
				return;
			}

			res.json(data);
			res.end();
		});
	}
};

typeInstance.prototype.updateHandler = function(req, res) {
	const identifiers = this.determineIdentifiers(req);

	//the item we are updating is the last in the list
	const toFetch = identifiers.slice(-1)[0];

	let validator = this.ajv.compile(this.schemas[toFetch.type]);

	if (!validator(req.body)) {
		res.status(422).json({
			errors : validator.errors
		}).end();
		return;
	}

	//if the identifier is null, we are dealing with the parent object so just need to check that
	let checkObj = toFetch;
	if (toFetch.identifier === null && identifiers.length > 1) {
		checkObj = identifiers.slice(-2)[0];
	}

	let parentObj = null;
	if (identifiers.length > 1) {
		parentObj = identifiers.slice(-2)[0];
	}

	this.store.getResource(checkObj.type, checkObj.identifier).then((data) => {
		if (!data) {
			res.status(404).send("").end();
			return;
		}

		//new single child object
		if (toFetch.identifier === null) {
			toFetch.identifier = this.uuid();
		}

		//set the parent identifier
		if (parentObj !== null) {
			req.body.parent = parentObj.identifier;
		}

		return this.store.updateResource(toFetch.type, toFetch.identifier, req.body).then((success) => {
			if (!success) {
				res.status(424).json({
					errors : [
						"error updating object"
					]
				}).end();
				return;
			}

			res.header("Location", req.path);
			res.status(204);
			res.send("");
			res.end();
			return;
		}).catch((err) => {
			res.status(500).json({
				errors : [err.toString()]
			}).end();
			return;
		});
	});
};

typeInstance.prototype.deleteHandler = function(req, res) {
	const identifiers = this.determineIdentifiers(req);

	//the item we are deleting is the last in the list
	const toFetch = identifiers.slice(-1)[0];

	this.store.getResource(toFetch.type, toFetch.identifier).then((data) => {
		if (!data) {
			res.status(404).send("").end();
			return;
		}

		return this.store.deleteResource(toFetch.type, toFetch.identifier).then((success) => {
			if (!success) {
				res.status(424).json({
					errors : [
						"error deleting object"
					]
				}).end();
				return;
			}

			res.status(204);
			res.send("");
			res.end();
			return;
		}).catch((err) => {
			res.status(500).res.json({
				errors : [err.toString()]
			}).end();
			return;
		});
	});
};

typeInstance.prototype.patchHandler = function(req, res) {
	const identifiers = this.determineIdentifiers(req);

	//the item we are patching is the last in the list
	const toFetch = identifiers.slice(-1)[0];

	let validator = this.ajv.compile(this.schemas[toFetch.type]);

	//if the identifier is null just call next
	if (toFetch.identifier === null && identifiers.length > 1) {
		//we're finding a single child item
		const filters = [];
		const parent = identifiers.slice(-2)[0];

		filters.push({
			path 	: "$.parent",
			value 	: parent.identifier
		});

		this.store.getResources(toFetch.type, 1, 1, filters).then((data) => {
			if (data === null || data.length === 0) {
				res.status(404).send("").end();
				return;
			}

			let resource = data[0];

			var newResource = Object.assign(resource, req.body);

			//check its schema
			if (!validator(newResource)) {
				res.status(422).json({
					errors : validator.errors
				}).end();
				return;
			}

			//ensure relationships/values are set
			toFetch.identifier = resource.id;
			newResource.parent = parent.identifier;

			this.store.updateResource(toFetch.type, toFetch.identifier, newResource).then((success) => {
				if (!success) {
					res.status(424).json({
						errors : [
							"error updating object"
						]
					}).end();
					return;
				}

				res.header("Location", req.path);
				res.status(204);
				res.send("");
				res.end();
				return;
			});
		})
	} else {
		this.store.getResource(toFetch.type, toFetch.identifier).then((resource) => {
			if (resource === null || typeof(resource) === "undefined") {
				res.status(404).send("").end();
				return;
			}

			var newResource = Object.assign(resource, req.body);

			//check its schema
			if (!validator(newResource)) {
				res.status(422).json({
					errors : validator.errors
				}).end();
				return;
			}

			this.store.updateResource(toFetch.type, toFetch.identifier, newResource).then((success) => {
				if (!success) {
					res.status(424).json({
						errors : [
							"error updating object"
						]
					}).end();
					return;
				}

				res.header("Location", req.path);
				res.status(204);
				res.send("");
				res.end();
				return;
			});
		});
	}
};

typeInstance.prototype.swaggerGen = function(paths) {
	const generatedPaths = {};
	const errorSchema = {
		type : "object",
		properties : {
			errors : {
				type : "array",
				items : {
					type : "string"
				}
			}
		}
	};

	paths.forEach((p) => {
		const def = {
			summary 		: "",
			description 	: "",
			operationId 	: `${p.method}_${p.path.replace(/\//g, "_")}`,
			tags 			: [
				this.definition.name
			],
			consumes 		: [
				"application/json"
			],
			produces 		: [
				"application/json"
			],
			responses 		: {
				401 : {
					description : "Unauthorized access - missing bearer token"
				},
				403 : {
					description : "Forbidden - you do not have the correct level of access"
				}
			},
			security : [
				{
					bearerToken : p.roles || []
				}
			],
			parameters : []
		};

		//setup our schemas
		if (!this.schemas[p.name]) {
			this.schemas[p.name] = p.schema;
		}

		if (p.method === "get") {
			if (p.type === "singular") {
				def.responses["404"] = {
					description : "Resource not found"
				};

				def.responses["200"] = {
					description : "The resource",
					schema 		: p.schema
				};
			}

			if (p.type === "listing") {
				def.responses["200"] = {
					description : "The list of resources",
					schema 		: {
						type 	: "array",
						items 	: p.schema
					}
				};

				def.parameters.push({
					name 		: "start",
					in 			: "query",
					description : "This parameter can be used to specify the starting object index that records should be pulled for. This index starts at 1. The default for this value is 1.",
					required 	: false,
					type 		: "integer"
				});

				def.parameters.push({
					name 		: "count",
					in 			: "query",
					description	: "This parameter can be used to specify the number of objects to be returned. The default for this value is 5.",
					required 	: false,
					type 		: "integer"
				});
			}
		}

		if (p.method === "delete") {
			def.responses["204"] = {
				description : "Resource deleted",
				headers 	: {}
			};

			def.responses["404"] = {
					description : "Resource not found",
					schema 		: errorSchema
				};

			def.responses["424"] = {
				description : "Could not delete entity from datastore",
				schema 		: errorSchema
			};
		}

		if (["post", "put", "patch"].indexOf(p.method) !== -1) {
			if (p.method === "post") {
				def.responses["201"] = {
					description : "Resource created",
					headers : {
						Location : {
							type 		: "string",
							description : "Location of newly created resource"
						}
					}
				};

				def.responses["409"] = {
					description : "Resource conflict",
					schema 		: errorSchema
				}
			} else {
				def.responses["204"] = {
					description : "Resource updated"
				};

				def.responses["404"] = {
					description : "Resource not found",
					schema 		: errorSchema
				};
			}

			def.responses["422"] = {
				description : "Unprocessable entity - does not match schema",
				schema 		: errorSchema
			};

			def.responses["424"] = {
				description	: "Could not store entity in datastore",
				schema 		: errorSchema
			};

			if (p.method === "post" && p.schema && p.schema.properties && p.schema.properties.id) {
				//remove the ID from the body
				delete(p.schema.properties.id);
			}

			def.parameters.push({
				name 		: "body",
				in 			: "body",
				description : "The objects properties",
				required 	: true,
				schema 		: p.schema
			});
		}

		//determine any path params
		const regex = /\:(\w+)/g;
		let m;
		let updatedPath = p.path;
		while ((m = regex.exec(p.path)) !== null) {
    		if (m.index === regex.lastIndex) {
        		regex.lastIndex++;
			}

			if(m.length === 2) {
				updatedPath = updatedPath.replace(`:${m[1]}`, "{" + m[1] + "}");
				def.parameters.push({
					name 		: m[1],
					in 			: "path",
					description : `The ${m[1]}`,
					required 	: true,
					schema 		: {
						type 	: "string"
					}
				});
			}
		}

		generatedPaths[updatedPath] = generatedPaths[updatedPath] || {};
		generatedPaths[updatedPath][p.method] = def;
	});

	return (req, res) => {
		res.json({
			swagger 	: "2.0",
			info 		: {
				description : this.definition.description,
				title 		: this.definition.name
			},
			host 		: this.hostnameResolver.resolveStorage().replace(/https?:\/\//, ''),
			basePath 	: "/",
			paths 		: generatedPaths,
			tags 		: [
				{
					name : this.definition.name
				}
			],
			schemes : [
				"http"
			],
			securityDefinitions : {
				bearerToken : {
					type 	: "apiKey",
					name 	: "Authorization",
					in 		: "header"
				}
			}
		});
		res.status(200);
		res.end();
	};
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

		const paths = this.determinePaths("", this.definition.name, this.normaliseName(this.definition.name), this.definition.schema);

		//assign the roles
		paths.forEach((p) => {
			let roles = readerRoles;

			if (["created", "update", "patch"].indexOf(p.type) !== -1) {
				roles = writerRoles;
			}

			if (["delete"].indexOf(p.type) !== -1) {
				roles = deletionRoles;
			}

			p.roles = roles;
		});

		//construct our definition
		console.log(`Hosting GET /${this.normaliseName(this.definition.name)}/swagger.json`);
		this.app.get(`/${this.normaliseName(this.definition.name)}/.definition`, this.swaggerGen(paths));

		//setup the paths
		paths.forEach((p) => {
			const handler = this.determineHandler(p.type).bind(this);

			console.log(`Hosting ${p.method.toUpperCase()} "${p.path}"`);
			this.app[p.method](p.path, this.roleCheckHandler.enforceRoles(handler, p.roles));
		});

		return resolve();
	});
};

typeInstance.prototype.determineHandler = function(type) {
	if (type === "listing") {
		return this.getHandler;
	}

	if (type === "details") {
		return this.getDetailsHandler;
	}

	if (type === "create") {
		return this.createHandler;
	}

	if (type === "singular") {
		return this.getSingleHandler;
	}

	if (type === "update") {
		return this.updateHandler;
	}

	if (type === "delete") {
		return this.deleteHandler;
	}

	if (type === "patch") {
		return this.patchHandler;
	}

	console.warn(`Could not determine handler for type ${type}`);
	return function() {};
};

typeInstance.prototype.normaliseName = function(name) {
	return name.toLowerCase().replace(' ', '_');
};

typeInstance.prototype.determinePaths = function(parentPath, name, fullName, schema, noIdentifier) {
	let ret = [];

	//normalise our names
	let normName = this.normaliseName(name);
	let singularPath = `${parentPath}/${normName}/:${normName}Id`;

	if (noIdentifier) {
		singularPath = `${parentPath}/${normName}`;
	}

	let simpleSchema = {
		type 		: "object",
		properties 	: {}
	};

	if (schema.type === "object" && schema.properties) {
		Object.keys(schema.properties).forEach((p) => {
			if (["object", "array"].indexOf(schema.properties[p].type) === -1) {
				simpleSchema.properties[p] = schema.properties[p];
			}
		});
	} else {
		simpleSchema = schema;
	}

	//push in our paths
	if (!noIdentifier) {
		ret.push({
			method 		: "get",
			path 		: `${parentPath}/${normName}`,
			type 		: "listing",
			schema 		: simpleSchema,
			name 		: fullName
		});

		ret.push({
			method 	: "get",
			path 	: `${parentPath}/${normName}/.details`,
			type 	: "details",
			schema 	: simpleSchema,
			name 	: fullName
		});

		ret.push({
			method 	: "post",
			path 	: `${parentPath}/${normName}`,
			type 	: "create",
			schema 	: simpleSchema,
			name 	: fullName
		});
	}

	ret.push({
		method 	: "get",
		path 	: singularPath,
		type 	: "singular",
		schema 	: simpleSchema,
		name 	: fullName
	});

	ret.push({
		method 	: "put",
		path 	: singularPath,
		type 	: "update",
		schema 	: simpleSchema,
		name 	: fullName
	});

	if (!noIdentifier) {
		ret.push({
			method 	: "delete",
			path 	: singularPath,
			type 	: "delete",
			schema 	: simpleSchema,
			name 	: fullName
		});
	}

	ret.push({
		method 	: "patch",
		path 	: singularPath,
		type 	: "patch",
		schema 	: simpleSchema,
		name 	: fullName
	});

	if (schema.type === "object" && schema.properties) {
		Object.keys(schema.properties).forEach((prop) => {
			let childName = this.normaliseName(`${fullName}_${prop}`);

			if (schema.properties[prop].type === "array" && schema.properties[prop].items && schema.properties[prop].items.type === "object") {
				//need a new set of paths!
				ret = ret.concat(this.determinePaths(singularPath, prop, childName, schema.properties[prop].items));
			}

			if (schema.properties[prop].type === "object") {
				//need another new set of paths, without the identifiers though!
				ret = ret.concat(this.determinePaths(singularPath, prop, childName, schema.properties[prop], true));
			}
		});
	}

	return ret;
};

module.exports = function(store, app, definition, uuid, ajv, roleCheckHandler, jsonpath, hostnameResolver) {
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

	if (!jsonpath) {
		jsonpath = require("jsonpath");
	}

	if (!hostnameResolver) {
		hostnameResolver = require("../../shared/hostnameResolver")();
	}

	return new typeInstance(store, app, definition, uuid, ajv, roleCheckHandler, jsonpath, hostnameResolver);
};