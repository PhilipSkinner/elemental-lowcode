const controllerInstance = function(routeDefinition, path, templateRenderer, fs, controllerState) {
	this.routeDefinition = routeDefinition;
	this.path = path;
	this.templateRenderer = templateRenderer;
	this.fs = fs;
	this.controllerState = controllerState;
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
	//load our controller into its state machine

	let module = this.path.join(process.cwd(), process.env.DIR, this.routeDefinition.controller);
	delete require.cache[require.resolve(module)]
	let stateEngine = this.controllerState(require(module));
	stateEngine.setContext(req, res);

	//ensure our state engine triggers on load
	stateEngine.triggerEvent('load', Object.assign(req.query, req.params)).then(() => {
		if (req.method === 'POST') {
			//generate our post event!
			var event = {};
			Object.keys(req.body).forEach((valName) => {
				//get the path version
				var parts = valName.split('$$_$$');
				let current = event;
				for (var i = 0; i < parts.length; i++) {
					if (i === parts.length - 1) {
						current[parts[i]] = req.body[valName];
					} else {
						if (!current[parts[i]]) {
							current[parts[i]] = {};
						}

						current = current[parts[i]];
					}
				}
			});
			return stateEngine.triggerEvent('postback', event);
		}

		if (req.method === 'GET') {
			//do we have an event to trigger?
			if (req.query.event) {
				return stateEngine.triggerEvent(req.query.event);
			}
		}

		return Promise.resolve();
	}).then(() => {
		//load the view
		this.loadView().then((view) => {
			return this.templateRenderer.renderView(view, stateEngine.getBag());
		}).then((html) => {
			stateEngine.generateResponseHeaders();
			res.send(html);
			next();
		}).catch((err) => {
			console.error(err);
			res.send(err.toString());
			next();
		});
	});
};

module.exports = function(routeDefinition, templateRenderer, path, fs, controllerState) {
	if (!path) {
		path = require('path');
	}

	if (!fs) {
		fs = require('fs');
	}

	if (!controllerState) {
		controllerState = require('./controllerState');
	}

	return new controllerInstance(routeDefinition, path, templateRenderer, fs, controllerState);
};