const controllerInstance = function(routeDefinition, path, clientConfig, passport, templateRenderer, fs, controllerState, roleCheckHandler) {
	this.routeDefinition = routeDefinition;
	this.path = path;
	this.passport = passport;
	this.templateRenderer = templateRenderer;
	this.fs = fs;
	this.controllerState = controllerState;
	this.clientConfig = clientConfig;
	this.roleCheckHandler = roleCheckHandler;
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
			} catch(e) {
				console.error(`Could not parse view ${this.routeDefinition.view} - ${e}`);
			}

			if (data === null) {
				return reject(new Error(`Cannot load view ${this.routeDefinition.view}`));
			}

			return resolve(data);
		});
	});
};

controllerInstance.prototype.handler = function(req, res, next) {
	const handleRequest = (req, res, next) => {
		//load our controller into its state machine
		let module = this.path.join(process.cwd(), process.env.DIR, this.routeDefinition.controller);
		delete require.cache[require.resolve(module)];
		let stateEngine = this.controllerState(require(module), this.clientConfig);
		stateEngine.setContext(req, res);

		//ensure our state engine triggers on load
		Promise.resolve().then(() => {
			if (req.method === "POST") {
				let body = req.body;

				if (body.__params) {
					body = JSON.parse(body.__params);
				}

				let event = {};
				if (req.files) {
					Object.keys(req.files).forEach((path) => {
						let parts = path.split("$$_$$");
						let current = event;
						for (var i = 0; i < parts.length; i++) {
							if (i === parts.length - 1) {
								current[parts[i]] = req.files[path];
							} else {
								if (!current[parts[i]]) {
									current[parts[i]] = {};
								}

								current = current[parts[i]];
							}
						}
					});
				}

				//generate our post event!
				let eventName = "postback";
				if (req.query && req.query._event) {
					eventName = req.query._event;
				}

				Object.keys(body).forEach((valName) => {
					//get the path version
					var parts = valName.split("$$_$$");
					let current = event;
					for (var i = 0; i < parts.length; i++) {
						if (i === parts.length - 1) {
							current[parts[i]] = body[valName];
						} else {
							if (!current[parts[i]]) {
								current[parts[i]] = {};
							}

							current = current[parts[i]];
						}
					}
				});

				return stateEngine.triggerEvent(eventName, this.ensureArrays(event));
			}

			if (req.method === "GET") {
				//do we have an event to trigger?
				if (req.query.event) {
					return stateEngine.triggerEvent(req.query.event, req.query);
				}
			}

			return Promise.resolve();
		}).then(() => {
			return stateEngine.triggerEvent("load", Object.assign(req.query, req.params));
		}).then(() => {
			stateEngine.generateResponseHeaders();

			// only render the view if we need to
			if (res.statusCode !== 200) {
				stateEngine = null;
				res.send('');
				next();
				return;
			}

			//load the view
			this.loadView().then((view) => {
				return this.templateRenderer.renderView(view, stateEngine.getBag());
			}).then((html) => {
				res.send(html);

				//clear the stateEngine
				stateEngine = null;

				next();
			}).catch((err) => {
				console.error(err);
				res.send(err.toString());
				next();
			});
		});
	};

	if (this.routeDefinition.secure && this.passport) {
		if (!(req.session && req.session.passport && req.session.passport.user && req.session.passport.user.accessToken)) {
			return this.passport.authenticate("oauth2")(req, res, next);
		} else if (this.routeDefinition.roles) {
			return this.roleCheckHandler.enforceRoles(handleRequest.bind(this), this.routeDefinition.roles.split(","))(req, res, next);
		}
	}

	return handleRequest(req, res, next);
};

controllerInstance.prototype.ensureArrays = function(obj) {
	let allNums = true;
	Object.keys(obj).forEach((k) => {
		if (parseInt(k) != k) {
			allNums = false;
		}

		if (typeof(obj[k]) === 'object') {
			obj[k] = this.ensureArrays(obj[k]);
		}
	});

	if (allNums) {
		let ret = [];
		Object.keys(obj).forEach((k) => {
			ret[parseInt(k)] = obj[k];
		});
		return ret;
	}

	return obj;
};

module.exports = function(routeDefinition, templateRenderer, clientConfig, passport, path, fs, controllerState, roleCheckHandler) {
	if (!path) {
		path = require("path");
	}

	if (!fs) {
		fs = require("fs");
	}

	if (!controllerState) {
		controllerState = require("./controllerState");
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new controllerInstance(routeDefinition, path, clientConfig, passport, templateRenderer, fs, controllerState, roleCheckHandler);
};