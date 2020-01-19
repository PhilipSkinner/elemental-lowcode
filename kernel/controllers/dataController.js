const dataController = function(app, fileLister, path) {
	this.app = app;
	this.fileLister = fileLister;

	this.initEndpoints();
};

dataController.prototype.getDataTypes = function(req, res, next) {
	this.fileLister.executeGlob('.sources/data/**/*.json').then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

dataController.prototype.getDataType = function(req, res, next) {
	this.fileLister.readJSONFile('.sources/data/', req.params.name + '.json').then((content) => {
		res.json(content);
		next();
	});
};

dataController.prototype.updateDataType = function(req, res, next) {	
	this.fileLister.writeFile('.sources/data/', req.params.name + '.json', JSON.stringify(req.body)).then(() => {
		res.status(204);
		res.send('');
		next();
	});
};

dataController.prototype.createDataType = function(req, res, next) {
	this.fileLister.writeFile('.sources/data/', req.body.name + '.json', JSON.stringify(req.body)).then(() => {
		res.status(201);
		res.send('');
		next();
	});
};

dataController.prototype.initEndpoints = function() {
	this.app.get('/data/types', this.getDataTypes.bind(this));
	this.app.get('/data/types/:name', this.getDataType.bind(this));
	this.app.put('/data/types/:name', this.updateDataType.bind(this));
	this.app.post('/data/types', this.createDataType.bind(this));
};

module.exports = function(app, fileLister, path) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}	

	return new dataController(app, fileLister);
};