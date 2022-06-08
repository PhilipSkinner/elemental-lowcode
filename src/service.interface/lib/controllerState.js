const controllerState = function(
    controllerDefinition,
    storageService,
    sessionState,
    integrationService,
    rulesetService,
    authClientProvider,
    idmService,
    navigationService,
    serviceProvider,
    messagingService,
    environmentService,
    locationService
) {
    this.controllerDefinition                       = controllerDefinition;
    this.controllerDefinition.storageService        = storageService;
    this.controllerDefinition.sessionState          = sessionState;
    this.controllerDefinition.integrationService    = integrationService;
    this.controllerDefinition.rulesetService        = rulesetService;
    this.controllerDefinition.authClientProvider    = authClientProvider;
    this.controllerDefinition.idmService            = idmService;
    this.controllerDefinition.navigationService     = navigationService;
    this.controllerDefinition.serviceProvider       = serviceProvider;
    this.controllerDefinition.messagingService      = messagingService;
    this.controllerDefinition.environmentService    = environmentService;
    this.controllerDefinition.locationService       = locationService;
    this.controllerDefinition.mergeBag              = this.mergeBag.bind(this);
};

controllerState.prototype.mergeBag = function(bag) {
    this.controllerDefinition.bag = Object.assign(this.controllerDefinition.bag || {}, bag || {});
};

controllerState.prototype.getHeader = function(request, header) {
    if (!request || !request.headers) {
        return null;
    }

    return request.headers[header];
};

controllerState.prototype.setContext = function(request, response) {
    this.request = request;
    this.response = response;

    this.controllerDefinition.context = {
        client : {
            ip      : this.getHeader(request, "x-forwarded-for") || (this.request.socket && this.request.socket.remoteAddress ? this.request.socket.remoteAddress : null),
            agent   : this.getHeader(request, "user-agent")
        }
    };
    this.controllerDefinition.sessionState.setContext(this.request, this.response);
    this.controllerDefinition.navigationService.setContext(this.request, this.response);
    this.controllerDefinition.authClientProvider.setSessionState(this.controllerDefinition.sessionState);
    this.controllerDefinition.serviceProvider.setContext(this.controllerDefinition.sessionState, this.request, this.response, this.controllerDefinition.navigationService);

    //set this within all of the services
    Object.keys(this.controllerDefinition).forEach((prop) => {
        const service = this.controllerDefinition[prop];
        if (service && service.setAuthClientProvider) {
            service.setAuthClientProvider(this.controllerDefinition.authClientProvider);
        }
    });
};

controllerState.prototype.setComponents = function(componentInstances) {
    this.componentInstances = componentInstances;
};

controllerState.prototype.generateResponseHeaders = function() {
    if (this.controllerDefinition.sessionState && this.controllerDefinition.sessionState.generateResponseHeaders) {
        this.controllerDefinition.sessionState.generateResponseHeaders();    
    }
    
    if (this.controllerDefinition.navigationService && this.controllerDefinition.navigationService.generateResponseHeaders) {
        this.controllerDefinition.navigationService.generateResponseHeaders();    
    }    
};

controllerState.prototype.deallocate = function() {
    if (this.controllerDefinition.sessionState && this.controllerDefinition.sessionState.deallocate) {
        this.controllerDefinition.sessionState.deallocate();    
    }
    
    this.controllerDefinition = null;
    this.request = null;
    this.response = null;
};

controllerState.prototype.getBag = function() {
    return typeof(this.controllerDefinition.bag) === "undefined" || this.controllerDefinition.bag === null ? {} : this.controllerDefinition.bag;
};

controllerState.prototype.cleanValues = function(values) {
    if (Array.isArray(values)) {
        return values.map((v) => {
            return this.cleanValues(v);
        });
    }

    if (typeof(values) === "object") {
        Object.keys(values).forEach((k) => {
            values[k] = this.cleanValues(values[k]);
        });

        return values;
    }

    if (values && values.replace) {
        values = values.replace(/\$\(/g, "&#36;(");
        values = values.replace(/\$\./g, "&#36;.");
    }

    return values;
};

controllerState.prototype._triggerComponentEvents = function(name, details) {
    return Promise.all((this.componentInstances || []).map((ci) => {
        if ((details._identifier && ci.identifier === details._identifier) || name === "load") {
            try {
                let result = null;

                //we need to trigger the event on this component
                ci.instance.storageService      = this.controllerDefinition.storageService;
                ci.instance.sessionState        = this.controllerDefinition.sessionState;
                ci.instance.integrationService  = this.controllerDefinition.integrationService;
                ci.instance.rulesetService      = this.controllerDefinition.rulesetService;
                ci.instance.authClientProvider  = this.controllerDefinition.authClientProvider;
                ci.instance.idmService          = this.controllerDefinition.idmService;
                ci.instance.navigationService   = this.controllerDefinition.navigationService;
                ci.instance.serviceProvider     = this.controllerDefinition.serviceProvider;
                ci.instance.messagingService    = this.controllerDefinition.messagingService;
                ci.instance.environmentService  = this.controllerDefinition.environmentService;
                ci.instance.locationService     = this.controllerDefinition.locationService;
                ci.instance.parent              = this.controllerDefinition;

                if (ci.instance.events[name]) {
                    result = ci.instance.events[name].bind(ci.instance)(details);
                }

                if (result && result.then) {
                    return result;
                } else {
                    return Promise.resolve(result);
                }
            } catch(e) {
                return Promise.reject(e);
            }         
        }

        return Promise.resolve();
    }));
};

controllerState.prototype.triggerEvent = function(name, details) {
    //ensure we clean any nasty values
    this.cleanValues(details);

    //trigger our components
    return this._triggerComponentEvents(name, details).then(() => {
        let result = null;

        if (this.controllerDefinition.events[name]) {
            result = this.controllerDefinition.events[name].bind(this.controllerDefinition)(details);
        }

        if (result && result.then) {
            return result;
        }    

        return Promise.resolve(result);        
    }).catch((err) => {
        return Promise.reject(err);
    });
};

module.exports = function(
    controllerDefinition,
    clientConfig,
    storageService,
    sessionState,
    integrationService,
    rulesetService,
    authClientProvider,
    idmService,
    navigationService,
    serviceProvider,
    messagingService,
    environmentService,
    locationService
) {
    if (!storageService) {
        storageService = require("../../support.lib/storageService")();
    }

    if (!sessionState) {
        sessionState = require("./sessionState")(controllerDefinition.sessionName);
    }

    if (!integrationService) {
        integrationService = require("../../support.lib/integrationService")();
    }

    if (!rulesetService) {
        rulesetService = require("../../support.lib/ruleService")();
    }

    if (!authClientProvider) {
        authClientProvider = require("../../support.lib/authClientProvider")(clientConfig);
    }

    if (!idmService) {
        idmService = require("../../support.lib/idmService")();
    }

    if (!navigationService) {
        navigationService = require("../../support.lib/navigationService")();
    }

    if (!serviceProvider) {
        serviceProvider = require("../../support.lib/iocProvider")();
    }

    if (!messagingService) {
        messagingService = require("../../support.lib/messagingService")();
    }

    if (!environmentService) {
        environmentService = require("../../support.lib/environmentService")();
    }

    if (!locationService) {
        locationService = require("../../support.lib/locationService")();
    }

    return new controllerState(
        controllerDefinition,
        storageService,
        sessionState,
        integrationService,
        rulesetService,
        authClientProvider,
        idmService,
        navigationService,
        serviceProvider,
        messagingService,
        environmentService,
        locationService
    );
};