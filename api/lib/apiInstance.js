const apiInstance = function(app, definition) {
	this.app = app;
	this.definition = definition;
	this.singletons = {};
	this.transatives = {};
};

apiInstance.prototype.generateContainer = function() {
	return new Promise((resolve, reject) => {
		console.log(`Generating IOC container...`);

		Object.keys(this.definition.services).forEach((s) => {
			var service = this.definition.services[s];
			if (service.type === 'singleton') {
				console.log(`Registering singleton service ${s}`);
				this.singletons[s] = {
					code 	: service._code,
					params 	: this._getRequires(service._code.toString())
				};
			} else {
				console.log(`Registering transative service ${s}`);
				this.transatives[s] = {
					code 	: service._code,
					params 	: this._getRequires(service._code.toString())
				};
			}
		});

		//now attempt to resolve all of the singletons
		this.resolveSingletons();

		console.log(`IOC container setup complete`);

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
				console.log(`Resolved include ${p}`);
				resolvedRequirement = singleton.instance;
			} else {
				//attempt to resolve it				
				console.log(`Attempting to resolve ${p}`);
				resolvedRequirement = this.resolveRequirements(singleton.params, singleton.code, false);
			}
		} else {
			if (!isTransative) {
				throw new Error(`Could not resolve dependency ${p}! Check if you have a singleton that is referencing a transative.`);
			} else if (this.transatives[p]) {
				let transative = this.transatives[p];				
				
				//attempt to resolve the transative
				console.log(`Attempting to resolve ${p}`);
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
	console.log(`Resolving singletons...`);

	Object.keys(this.singletons).forEach((s) => {
		//get our params
		var single = this.singletons[s];

		if (single.instance) {			
			return;
		}

		if (single.params.length > 0) {
			console.log(`Resolving singleton ${s}`);
			this.singletons[s].instance = this.resolveRequirements(single.params, single.code, false);
		} else {
			console.log(`Resolved parameterless singleton ${s}`);
			this.singletons[s].instance = this.resolveRequirements(single.params, single.code, false);
		}
	});

	console.log(`Resolution successful!`);
};

apiInstance.prototype._getRequires = function(fnString) {	
	var regex = /^\((.*?)\).?=>/;

	if (fnString.indexOf('function') === 0) {
		regex = /^function.*?\((.*?)\)/;
	}

	return fnString
		.match(regex)[ 1 ].split( /\s*,\s*/ )
		.map( function( parameterName ) { return parameterName.trim(); } )
		.filter( function( parameterName ) { return parameterName.length > 0; } );		
}

apiInstance.prototype.resolveController = function(name) {		
	let params = this._getRequires(this.definition.controllers[name].toString());
	return this.resolveRequirements(params, this.definition.controllers[name], true);
};

apiInstance.prototype.setupEndpoints = function() {
	return new Promise((resolve, reject) => {
		console.log(`Setting up API endpoints...`);

		Object.keys(this.definition.routing).forEach((route) => {
			let routeConfig = this.definition.routing[route];
			let routePath = `/${this.definition.name}${route}`;
			console.log(`Setting up routes for ${routePath}`);

			if (routeConfig.get) {
				console.log(`Setting up GET on ${routePath}`);
				this.app.get(routePath, (req, res, next) => {
					this.resolveController(routeConfig.get.controller)(req, res, next);
				});
			}

			if (routeConfig.post) {
				console.log(`Setting up POST on ${routePath}`);
				this.app.post(routePath, (req, res, next) => {
					this.resolveController(routeConfig.post.controller)(req, res, next);
				});	
			}
		});

		console.log(`Endpoint setup complete`);

		return resolve();
	});
};

apiInstance.prototype.init = function() {	
	console.log(`Initializing ${this.definition.name} API instance...`);		
	
	return this.generateContainer().then(() => {
		return this.setupEndpoints();
	});
};

module.exports = function(app, definition) {
	return new apiInstance(app, definition);
};