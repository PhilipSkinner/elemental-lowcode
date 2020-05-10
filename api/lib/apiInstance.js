const apiInstance = function(app, definition, roleCheckHandler) {
	this.app = app;
	this.definition = definition;
	this.singletons = {};
	this.transatives = {};
	this.roleCheckHandler = roleCheckHandler;
};

apiInstance.prototype.generateContainer = function() {
	return new Promise((resolve, reject) => {
		console.info("Generating IOC container...");

		Object.keys(this.definition.services || {}).forEach((s) => {
			var service = this.definition.services[s];
			if (service.type === "singleton") {
				console.info(`Registering singleton service ${s}`);
				this.singletons[s] = {
					code 	: service._code,
					params 	: this._getRequires(service._code.toString())
				};
			} else {
				console.info(`Registering transative service ${s}`);
				this.transatives[s] = {
					code 	: service._code,
					params 	: this._getRequires(service._code.toString())
				};
			}
		});

		//now attempt to resolve all of the singletons
		this.resolveSingletons();

		console.info("IOC container setup complete");

		return resolve();
	});
};

apiInstance.prototype.resolveRequirements = function(params, code, isTransative) {
	if (params.length === 0) {
		return code();
	}

	//find each of our requirements in the singletons
	let execParams = [];
	params.forEach((p) => {
		let resolvedRequirement = null;
		if (this.singletons[p]) {
			var singleton = this.singletons[p];
			if (singleton.instance) {
				console.info(`Resolved include ${p}`);
				resolvedRequirement = singleton.instance;
			} else {
				//attempt to resolve it
				console.info(`Attempting to resolve ${p}`);
				resolvedRequirement = this.resolveRequirements(singleton.params, singleton.code, false);
			}
		} else {
			if (!isTransative) {
				throw new Error(`Could not resolve dependency ${p}! Check if you have a singleton that is referencing a transative.`);
			} else if (this.transatives[p]) {
				let transative = this.transatives[p];

				//attempt to resolve the transative
				console.info(`Attempting to resolve ${p}`);
				resolvedRequirement = this.resolveRequirements(transative.params, transative.code, true);
			}
		}

		if (!resolvedRequirement) {
			throw new Error(`Could not resolve dependency ${p}! It could not be found.`);
		}

		execParams.push(resolvedRequirement);
	});

	return code.apply(null, execParams);
};

apiInstance.prototype.resolveSingletons = function() {
	console.info("Resolving singletons...");

	Object.keys(this.singletons).forEach((s) => {
		//get our params
		var single = this.singletons[s];

		if (single.instance) {
			return;
		}

		if (single.params.length > 0) {
			console.info(`Resolving singleton ${s}`);
			this.singletons[s].instance = this.resolveRequirements(single.params, single.code, false);
		} else {
			console.info(`Resolved parameterless singleton ${s}`);
			this.singletons[s].instance = this.resolveRequirements(single.params, single.code, false);
		}
	});

	console.info("Resolution successful!");
};

apiInstance.prototype._getRequires = function(fnString) {
	var regex = /^\((.*?)\).?=>/;

	if (fnString.indexOf("function") === 0) {
		regex = /^function.*?\((.*?)\)/;
	}

	return fnString
		.match(regex)[ 1 ].split( /\s*,\s*/ )
		.map( function( parameterName ) { return parameterName.trim(); } )
		.filter( function( parameterName ) { return parameterName.length > 0; } );
};

apiInstance.prototype.resolveController = function(name) {
	let params = this._getRequires(this.definition.controllers[name].toString());
	return this.resolveRequirements(params, this.definition.controllers[name], true);
};

apiInstance.prototype.setupEndpoints = function() {
	return new Promise((resolve, reject) => {
		console.info("Setting up API endpoints...");

		const originalReaderRoles = [
			"system_admin",
			"system_reader",
			"api_reader",
			`${this.definition.name}_reader`
		];

		const originalWriterRoles = [
			"system_admin",
			"system_writer",
			"api_writer",
			`${this.definition.name}_writer`
		];

		Object.keys(this.definition.routes || {}).forEach((route) => {
			let routeConfig = this.definition.routes[route];
			let routePath = `/${this.definition.name}${route}`;
			console.info(`Setting up routes for ${routePath}`);

			if (routeConfig.get) {
				let readerRoles = JSON.parse(JSON.stringify(originalReaderRoles));
				if (routeConfig.get.replace) {
					readerRoles = ["system_admin"];
				}

				if (routeConfig.get.roles) {
					readerRoles = readerRoles.concat(routeConfig.get.roles);
				}

				if (routeConfig.get.needsRole === false) {
					readerRoles = null;
				}

				console.info(`Setting up GET on ${routePath}`);
				console.log(readerRoles);
				this.app.get(routePath, this.roleCheckHandler.enforceRoles((req, res, next) => {
					this.resolveController(routeConfig.get.controller)(req, res, next);
				}, readerRoles));
			}

			if (routeConfig.post) {
				let writerRoles = JSON.parse(JSON.stringify(originalWriterRoles));
				if (routeConfig.post.replace) {
					writerRoles = ["system_admin"];
				}

				if (routeConfig.post.roles) {
					writerRoles = writerRoles.concat(routeConfig.post.roles);
				}

				if (routeConfig.post.needsRole === false) {
					writerRoles = null;
				}

				console.info(`Setting up POST on ${routePath}`);
				this.app.post(routePath, this.roleCheckHandler.enforceRoles((req, res, next) => {
					this.resolveController(routeConfig.post.controller)(req, res, next);
				}, writerRoles));
			}
		});

		console.info("Endpoint setup complete");

		return resolve();
	});
};

apiInstance.prototype.init = function() {
	console.info(`Initializing ${this.definition.name} API instance...`);

	return this.generateContainer().then(() => {
		return this.setupEndpoints();
	});
};

module.exports = function(app, definition, roleCheckHandler) {
	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new apiInstance(app, definition, roleCheckHandler);
};