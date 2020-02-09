const integrationsController = function(app, fileLister, path) {
	this.app = app;
	this.fileLister = fileLister;

	this.initEndpoints();
};

integrationsController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob('.sources/integration/**/*.json').then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

integrationsController.prototype.getSingular = function(req, res, next) {
	this.fileLister.readJSONFile('.sources/integration/', req.params.name + '.json').then((content) => {
		res.json(content);
		next();
	});
};

integrationsController.prototype.update = function(req, res, next) {
	this.fileLister.writeFile('.sources/integration/', req.params.name + '.json', JSON.stringify(req.body)).then(() => {
		res.status(204);
		res.send('');
		next();
	});
};

integrationsController.prototype.delete = function(req, res, next) {
	this.fileLister.deleteFile('.sources/integration/', req.params.name + '.json').then(() => {
		res.status(204);
		res.send('');
		next();
	});
};

integrationsController.prototype.create = function(req, res, next) {
	this.fileLister.writeFile('.sources/integration/', req.body.name + '.json', JSON.stringify(req.body)).then(() => {
		res.status(201);
		res.send('');
		next();
	});
};

integrationsController.prototype.initEndpoints = function() {
	this.app.get('/integrations', this.get.bind(this));
	this.app.get('/integrations/:name', this.getSingular.bind(this));
	this.app.put('/integrations/:name', this.update.bind(this));
	this.app.delete('/integrations/:name', this.delete.bind(this));
	this.app.post('/integrations', this.create.bind(this));
};

module.exports = function(app, fileLister, path) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}

	return new integrationsController(app, fileLister);
};