const services = {};

const iocProvider = function(services, path) {
	this.services = services;
	this.path = path;
};

iocProvider.prototype._getRequires = function(fnString) {
	var regex = /^\((.*?)\).?=>/;

	if (fnString.indexOf("function") === 0) {
		regex = /^function.*?\((.*?)\)/;
	}

	return fnString
		.match(regex)[ 1 ].split( /\s*,\s*/ )
		.map( function( parameterName ) { return parameterName.trim(); } )
		.filter( function( parameterName ) { return parameterName.length > 0; } );
};

iocProvider.prototype.resolveRequirements = function(fn) {
	const requires = this._getRequires(fn.toString());

	if (requires.length === 0) {
		return new fn();
	}

	let params = [];
	requires.forEach((r) => {
		let resolvedRequirement = this.resolveService(r);

		if (!resolvedRequirement) {
			throw new Error(`Could not resolve dependency ${r}! It could not be found.`);
		}

		params.push(resolvedRequirement);
	});

	//can't call apply on a constructor :(
	let ret = null;
	try {
		ret = eval(`new fn(${params.map((p, index) => {
			return `params[${index}]`;
		}).join(',')})`);
	} catch(e) {
		if (e.toString().indexOf('fn is not a constructor') !== -1) {
			ret = fn.apply(null, params);
		} else {
			throw e;
		}
	}
	return ret;
};

iocProvider.prototype.resolveService = function(name) {
	if (!this.services[name]) {
		this.services[name] = require(this.path.join(this.path.dirname(process.env.DIR), "services", name));
	}

	return this.resolveRequirements(this.services[name]);
};

module.exports = function(path) {
	if (!path) {
		path = require("path");
	}

	return new iocProvider(services, path);
};