const dataController = function(app, fileLister, storageService) {
	this.app = app;
	this.fileLister = fileLister;
	this.storageService = storageService;

	this.initEndpoints();
};

dataController.prototype.getDataTypes = function(req, res, next) {
	this.fileLister.executeGlob('.sources/data/**/*.json').then((results) => {
		//for each, fetch the total number of entities currently in the store
		Promise.all(results.map((r) => {
			return this.storageService.detailCollection(r.name);
		})).then((details) => {
			//map into our results
			for (var i = 0; i < results.length; i++) {
				results[i].count = details[i].count;
			}
			res.json(results);
			res.end();
		});
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

module.exports = function(app, fileLister, storageService) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}

	if (!storageService) {
		storageService = require('../../shared/storageService')();
	}

	return new dataController(app, fileLister, storageService);
};