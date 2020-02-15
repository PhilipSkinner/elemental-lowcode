const securityController = function(app, fileLister, roleCheckHandler, db) {
	this.app = app;
	this.fileLister = fileLister;
	this.roleCheckHandler = roleCheckHandler;
	this.db = db;
	this.userDB = new this.db('User');

	this.connected = false;

	this.initEndpoints();
};

securityController.prototype.getClients = function(req, res, next) {
	this.fileLister.executeGlob('.sources/identity/**/*.client.json').then((results) => {
		res.json(results.map((r) => {
			return Object.assign(r, {
				client_id : r.name.slice(0, -7)
			});
		}));
		next();
	});
};

securityController.prototype.getClient = function(req, res, next) {
	this.fileLister.readJSONFile('.sources/identity/', req.params.id + '.client.json').then((content) => {
		res.json(content);
		next();
	});
};

securityController.prototype.createClient = function(req, res, next) {
	this.fileLister.writeFile('.sources/identity/', `${req.body.client_id}.client.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(201);
		res.send('');
		next();
	});	
};

securityController.prototype.updateClient = function(req, res, next) {
	this.fileLister.writeFile('.sources/identity/', `${req.body.client_id}.client.json`, JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send('');
		next();
	});	
};

securityController.prototype.getConfig = function(req, res, next) {
	this.fileLister.readJSONFile('.sources/identity/config.json').then((result) => {
		res.json(result);
		next();
	}).catch((err) => {
		//return defaults
		const defaults = {
			scopes : [],			
		};

		//save it first
		this.fileLister.writeFile('.sources/identity', 'config.json', JSON.stringify(defaults, null, 4)).then(() => {
			res.json(defaults);
			next();
		});
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

securityController.prototype.initEndpoints = function() {
	this.app.get('/security/clients', 		this.roleCheckHandler.enforceRoles(this.getClients.bind(this), 		['security_reader', 'security_admin', 'system_reader', 'system_admin']));		
	this.app.get('/security/clients/:id', 	this.roleCheckHandler.enforceRoles(this.getClient.bind(this), 		['security_reader', 'security_admin', 'system_reader', 'system_admin']));		
	this.app.post('/security/clients', 		this.roleCheckHandler.enforceRoles(this.createClient.bind(this), 	['security_writer', 'security_admin', 'system_reader', 'system_admin']));		
	this.app.put('/security/clients/:id', 	this.roleCheckHandler.enforceRoles(this.updateClient.bind(this), 	['security_writer', 'security_admin', 'system_reader', 'system_admin']));		

	this.app.get('/security/config', 		this.roleCheckHandler.enforceRoles(this.getConfig.bind(this), 		['security_reader', 'security_admin', 'system_reader', 'system_admin']));		

	this.app.get('/security/users', 		this.roleCheckHandler.enforceRoles(this.getUsers.bind(this), 		['security_reader', 'security_admin', 'system_reader', 'system_admin']));		
};

module.exports = function(app, fileLister, roleCheckHandler, db) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}	

	if (!roleCheckHandler) {
		roleCheckHandler = require('../../shared/roleCheckHandler')();
	}

	if (!db) {
		db = require('../../shared/db')();
	}

	return new securityController(app, fileLister, roleCheckHandler, db);
};