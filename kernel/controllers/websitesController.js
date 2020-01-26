const websitesController = function(app, fileLister) {
	this.app = app;
	this.fileLister = fileLister;

	this.initEndpoints();
};

websitesController.prototype.get = function(req, res, next) {
	this.fileLister.executeGlob('.sources/website/*.website.json').then((results) => {
		res.json(results.map((r) => {
			r.name = r.name.split('.').slice(0, -1).join('.');
			return r;
		}));
		next();
	});
};

websitesController.prototype.getWebsite = function(req, res, next) {
	this.fileLister.readJSONFile('.sources/website/', req.params.name + '.website.json').then((data) => {
		res.json(data);
		next();
	});
};

websitesController.prototype.updateWebsite = function(req, res, next) {
	this.fileLister.writeFile('.sources/website/', req.params.name + '.website.json', JSON.stringify(req.body, null, 4)).then(() => {
		res.status(204);
		res.send('');
		next();
	});
};

websitesController.prototype.getResource = function(req, res, next) {
	this.fileLister.readFile('.sources/website/', req.query.path).then((data) => {
		res.send(data);
		next();
	});
};

websitesController.prototype.createOrUpdateResource = function(req, res, next) {
	this.fileLister.writeFile('.sources/website/', req.query.path, req.body.resource).then(() => {
		res.status(204);
		res.send('');
		next();
	});
};

websitesController.prototype.initEndpoints = function() {
	this.app.get('/websites', this.get.bind(this));
	this.app.get('/websites/:name', this.getWebsite.bind(this));
	this.app.put('/websites/:name', this.updateWebsite.bind(this));
	this.app.get('/websites/:name/resource', this.getResource.bind(this));
	this.app.post('/websites/:name/resource', this.createOrUpdateResource.bind(this));
};

module.exports = function(app, fileLister) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}

	return new websitesController(app, fileLister);
};