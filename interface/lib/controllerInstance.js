const controllerInstance = function(routeDefinition, path, templateRenderer, fs) {
	this.routeDefinition = routeDefinition;
	this.path = path;
	this.templateRenderer = templateRenderer;
	this.fs = fs;
};

controllerInstance.prototype.loadView = function() {
	return new Promise((resolve, reject) => {
		this.fs.readFile(this.path.join(process.env.DIR, this.routeDefinition.view), (err, content) => {
			if (err) {
				return reject(err);
			}

			let data = null;
			try {
				data = JSON.parse(content);
			} catch(e) {}

			if (data == null) {
				return reject(new Error(`Cannot load view ${this.routeDefinition.view}`));
			}

			return resolve(data);
		});
	});
};

controllerInstance.prototype.handler = function(req, res, next) {
	//load the view
	this.loadView().then((view) => {
		return this.templateRenderer.renderView(view);
	}).then((html) => {
		res.send(html);
		next();
	}).catch((err) => {
		res.send(err.toString());
		next();
	});
};

module.exports = function(routeDefinition, path, templateRenderer, fs) {
	if (!path) {
		path = require('path');
	}

	if (!templateRenderer) {
		templateRenderer = require('./templating/render')();
	}

	if (!fs) {
		fs = require('fs');
	}

	return new controllerInstance(routeDefinition, path, templateRenderer, fs);
};