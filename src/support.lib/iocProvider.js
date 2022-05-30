const services = {
    environmentService 	: require("./environmentService")(),
    hostnameResolver 	: require("./hostnameResolver")(),
    storageService 		: require("./storageService")(),
    integrationService 	: require("./integrationService")(),
    rulesetService 		: require("./ruleService")(),
    idmService 			: require("./idmService")(),
    authClientProvider 	: require("./authClientProvider")(),
    messagingService 	: require("./messagingService")(),
    sessionState 		: require("../service.interface/lib/sessionState")(),
    navigationService 	: null
};

const iocProvider = function(services, path) {
    this.services = services;
    this.path = path;
};

iocProvider.prototype.setContext = function(sessionState, request, response, navigationService) {
    services.authClientProvider.setSessionState(sessionState);
    services.sessionState.setContext(request, response);
    services.navigationService = navigationService;
};

iocProvider.prototype._getRequires = function(fnString) {
    var regex = /^\(?(.*?)\)?[ \t]*?=>/;

    if (fnString.indexOf("function") === 0) {
        regex = /^function.*?\((.*?)\)/;
    }

    const matches = fnString.match(regex);	

    if (!matches) {
        return [];
    }

    return matches[1].split( /\s*,\s*/ )
        .map( function( parameterName ) {
            return parameterName.trim(); 
        } )
        .filter( function( parameterName ) {
            return parameterName.length > 0; 
        } );
};

iocProvider.prototype.resolveRequirements = function(fn) {
    if (typeof(fn) === "object") {
        return fn;
    }

    const requires = this._getRequires(fn.toString());

    if (requires.length === 0) {
        try {
            return new fn();
        } catch(e) {
            return fn();
        }
    }

    let params = [];
    requires.forEach((r) => {		
        let resolvedRequirement = null;
        if (services[r]) {
            resolvedRequirement = services[r];
        } else {
            resolvedRequirement = this.resolveService(r);
        }

        if (!resolvedRequirement) {
            throw new Error(`Could not resolve dependency ${r}! It could not be found.`);
        }

        params.push(resolvedRequirement);
    });

    //can"t call apply on a constructor :(
    let ret = null;
    try {
        ret = eval(`new fn(${params.map((p, index) => {
            return `params[${index}]`;
        }).join(",")})`);
    } catch(e) {
        if (e.toString().indexOf("fn is not a constructor") !== -1) {
            ret = fn.apply(null, params);
        } else {
            throw e;
        }
    }
    return ret;
};

iocProvider.prototype.resolveService = function(name) {
    try {
        let module = this.path.join(process.cwd(), this.path.dirname(process.env.DIR), "services", name);
        delete require.cache[require.resolve(module)];
        this.services[name] = require(module);

        return this.resolveRequirements(this.services[name]);
    } catch(e) {
        return null;
    }
};

module.exports = function(path) {
    if (!path) {
        path = require("path");
    }

    return new iocProvider(services, path);
};