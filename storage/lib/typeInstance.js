const typeInstance = function(store, app, definition, uuid, ajv) {
	this.store 		= store;
	this.app 		= app;
	this.definition = definition;
	this.uuid 		= uuid;
	this.ajv 		= ajv;

	//setup the _id property
	this.definition.schema.properties["_id"] = {
		"type" : "string"
	};
};

typeInstance.prototype.getHandler = function(req, res, next) {
	this.store.getResources(this.definition.name, req.query.start, req.query.count).then((data) => {
		res.json(data);
		next();
	}).catch((err) => {
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		next();
		return;
	});
};

typeInstance.prototype.createHandler = function(req, res, next) {
	//confirm that the structure is correct	
	let validator = this.ajv.compile(this.definition.schema);

	if (!validator(req.body)) {		
		res.json({
			errors : validator.errors
		});
		res.status(422);
		next();
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
			next();
			return;
		}
		
		res.header('Location', `/${this.definition.name}/${newId}`);
		res.status(201);
		res.send('');		
		next();
		return;
	}).catch((err) => {		
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		next();
		return;
	});
};

typeInstance.prototype.getSingleHandler = function(req, res, next) {
	this.store.getResource(this.definition.name, req.params.id).then((data) => {
		if (!data) {
			res.status(404);
			res.send('');
			next();
			return;
		}

		res.json(data);
		next();
	});
};

typeInstance.prototype.updateHandler = function(req, res, next) {
	let validator = this.ajv.compile(this.definition.schema);

	if (!validator(req.body)) {		
		res.json({
			errors : validator.errors
		});
		res.status(422);		
		next();
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
			next();
			return;
		}
		
		res.header('Location', `/${this.definition.name}/${req.params.id}`);
		res.status(204);
		res.send('');		
		next();
		return;		
	}).catch((err) => {
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		next();
		return;
	});
};

typeInstance.prototype.deleteHandler = function(req, res, next) {
	this.store.deleteResource(this.definition.name, req.params.id).then((success) => {
		if (!success) {
			res.json({
				errors : [					
					"error deleting object"					
				]
			});
			res.status(424);
			next();
			return;
		}

		res.status(204);
		res.send('');
		next();
		return;
	}).catch((err) => {
		res.json({
			errors : [err.toString()]
		});
		res.status(500);
		next();
		return;
	});
};

typeInstance.prototype.patchHandler = function(req, res, next) {

	this.store.getResource(this.definition.name, req.params.id).then((resource) => {
		if (resource == null) {
			res.status(404);
			res.send('');
			next();
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
			next();
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
				next();
				return;
			}
			
			res.header('Location', `/${this.definition.name}/${req.params.id}`);
			res.status(204);
			res.send('');		
			next();
			return;	
		});
	});	
};

typeInstance.prototype.init = function() {
	return new Promise((resolve, reject) => {
		console.log(`Initializing type ${this.definition.name}`);

		console.log(`Hosting GET /${this.definition.name}`);
		this.app.get(`/${this.definition.name}`, 		this.getHandler.bind(this));
		
		console.log(`Hosting POST /${this.definition.name}`);		
		this.app.post(`/${this.definition.name}`, 		this.createHandler.bind(this));

		console.log(`Hosting GET /${this.definition.name}/:id`);
		this.app.get(`/${this.definition.name}/:id`, 	this.getSingleHandler.bind(this));
		
		console.log(`Hosting PUT /${this.definition.name}/:id`);
		this.app.put(`/${this.definition.name}/:id`, 	this.updateHandler.bind(this));
		
		console.log(`Hosting DELETE /${this.definition.name}/:id`);
		this.app.delete(`/${this.definition.name}/:id`, this.deleteHandler.bind(this));

		console.log(`Hosting PATCH /${this.definition.name}/:id`);
		this.app.patch(`/${this.definition.name}/:id`, 	this.patchHandler.bind(this));

		return resolve();
	});
}

module.exports = function(store, app, definition, uuid, ajv) {
	if (!uuid) {
		uuid = require('uuid/v4');
	}

	if (!ajv) {
		ajv = require('ajv')({
			allErrors : true
		});
	}

	return new typeInstance(store, app, definition, uuid, ajv);
};