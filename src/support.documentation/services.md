[Back to Index](/documentation)

# Services

Services are managed within an IoC (Inversion of Control) container, allowing them to be injected into:

*   Website Controllers
*   API Controllers

You can register your services within the Services section of the admin. Each service should follow the following pattern:

```
const service = function(serviceDep) {
	this.serviceDep = serviceDep;
};

service.prototype.something = function(value) {
	return value * this.serviceDep.getMultiplier();
};

module.exports = service;
```

Once a service is named it cannot be renamed.

A service can be resolved using the [service provider](/src/support.documentation/services/serviceProvider).

## Predefined services

There are a number of predefined services that can be access from within your controllers/handlers, these are:

* [authClientProvider](/src/support.documentation/services/authClientProvider)
* [environmentService](/src/support.documentation/services/environmentService)
* [idmService](/src/support.documentation/services/idmService)
* [integrationService](/src/support.documentation/services/integrationService)
* [messagingService](/src/support.documentation/services/messagingService)
* [rulesetService](/src/support.documentation/services/rulesetService)
* [serviceProvider](/src/support.documentation/services/serviceProvider)
* [storageService](/src/support.documentation/services/storageService)
* [locationService](/src/support.documentation/services/locationService)