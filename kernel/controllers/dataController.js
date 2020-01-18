const dataController = function(app, fileLister) {
	this.app = app;
	this.fileLister = fileLister;

	this.initEndpoints();
};

dataController.prototype.getDataTypes = function(req, res, next) {
	this.fileLister.executeGlob('.sources/data/**/*.json').then((results) => {
		res.json(results.map((r) => {
			return {
				name : r
			};
		}));
		next();
	});
};

dataController.prototype.initEndpoints = function() {
	this.app.get('/data/types', this.getDataTypes.bind(this));
};

module.exports = function(app, fileLister) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}

	return new dataController(app, fileLister);
};