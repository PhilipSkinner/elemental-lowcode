const rulesController = function(app, fileLister, path) {
	this.app = app;
	this.fileLister = fileLister;

	this.initEndpoints();
};

rulesController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob('.sources/rules/**/*.json').then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

rulesController.prototype.getSingular = function(req, res, next) {
	this.fileLister.readJSONFile('.sources/rules/', req.params.name + '.json').then((content) => {
		res.json(content);
		next();
	});
};

rulesController.prototype.update = function(req, res, next) {
	this.fileLister.writeFile('.sources/rules/', req.params.name + '.json', JSON.stringify(req.body)).then(() => {
		res.status(204);
		res.send('');
		next();
	});
};

rulesController.prototype.create = function(req, res, next) {
	this.fileLister.writeFile('.sources/rules/', req.body.name + '.json', JSON.stringify(req.body)).then(() => {
		res.status(201);
		res.send('');
		next();
	});
};

rulesController.prototype.initEndpoints = function() {
	this.app.get('/rules', this.get.bind(this));
	this.app.get('/rules/:name', this.getSingular.bind(this));
	this.app.put('/rules/:name', this.update.bind(this));
	this.app.post('/rules', this.create.bind(this));
};

module.exports = function(app, fileLister, path) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}

	return new rulesController(app, fileLister);
};