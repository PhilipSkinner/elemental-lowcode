const apiController = function(app, fileLister, path) {
	this.app = app;
	this.fileLister = fileLister;

	this.initEndpoints();
};

apiController.prototype.getApis = function(req, res, next) {
	this.fileLister.executeGlob('.sources/api/**/*.api.json').then((results) => {
		res.json(results.map((r) => {
			return r;
		}));
		next();
	});
};

apiController.prototype.getApi = function(req, res, next) {
	return fileLister.readJSONFile('.sources/api/', req.params.name + '.api.json').then((content) => {
		res.json(content);
		next();
	});
};

apiController.prototype.getService = function(req, res, next) {
	return fileLister.readFile('.sources/api/' + req.params.name + '/services/', req.params.service + '.js').then((content) => {
		res.send(content);
		next();
	});
};

apiController.prototype.getController = function(req, res, next) {
	return fileLister.readFile('.sources/api/' + req.params.name + '/controllers/', req.params.service + '.js').then((content) => {
		res.send(content);
		next();
	});
};

apiController.prototype.createApi = function(req, res, next) {
	return fileLister.writeFile('.sources/api/', req.body.name + '.api.json', JSON.stringify(req.body, null, 4)).then((content) => {
		res.status(201);
		res.send('');
		next();
	});
};

apiController.prototype.createService = function(req, res, next) {
	//needs to add it into the services on the API definition aswell
	return fileLister.writeFile('.sources/api/' + req.params.name + '/services/', req.body.name + '.js', req.body.content).then(() => {
		res.status(201);
		res.send('');
		next();
	});
};

apiController.prototype.initEndpoints = function() {
	this.app.get('/apis', this.getApis.bind(this));	
	this.app.get('/apis/:name', this.getApi.bind(this));	
	this.app.get('/apis/:name/services/:service', this.getService.bind(this));	
	this.app.get('/apis/:name/controllers/:controller', this.getController.bind(this));

	//create
	this.app.post('/apis', this.createApi.bind(this));
	this.app.post('/apis/:name/services', this.createService.bind(this));
	this.app.post('/apis/:name/controllers', this.createController.bind(this));

	//update
	this.app.put('/apis/:name', this.updateApi.bind(this));
	this.app.put('/apis/:name/services/:service', this.updateService.bind(this));
	this.app.put('/apis/:name/controllers/:controller', this.updateController.bind(this));	
};

module.exports = function(app, fileLister, path) {
	if (!fileLister) {
		fileLister = require('../lib/fileLister')();
	}	

	return new apiController(app, fileLister);
};