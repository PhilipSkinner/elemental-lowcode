const websitesController = function(app, fileLister) {
	this.app = app;
	this.fileLister = fileLister;

	this.initEndpoints();
};

websitesController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob('.sources/website/**/*.website.json').then((results) => {
		res.json(results.map((r) => {
			r.name = r.name.split('.').slice(0, -1).join('.');
			return r;
		}));
		next();
	});
};

websitesController.prototype.initEndpoints = function() {
	this.app.get('/websites', this.get.bind(this));
};

module.exports = function(app, fileLister) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}

	return new websitesController(app, fileLister);
};