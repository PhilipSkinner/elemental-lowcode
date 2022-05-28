[Back to APIs](/src/support.documentation/apis)

# Controllers

A controller is a function, which when executed, returns a function that will handle the incoming request and generate the outgoing response:

```
module.exports = function() {
	return (req, res, next) => {
		res.json({ hello : "world" });
		next();
	};
};
```

Controllers have access to numerous injected services, including:

* [authClientProvider](/src/support.documentation/services/authClientProvider)
* [environmentService](/src/support.documentation/services/environmentService)
* [idmService](/src/support.documentation/services/idmService)
* [integrationService](/src/support.documentation/services/integrationService)
* [rulesetService](/src/support.documentation/services/rulesetService)
* [serviceProvider](/src/support.documentation/services/serviceProvider)
* [storageService](/src/support.documentation/services/storageService)
* [locationService](/src/support.documentation/services/locationService)
* [blobService](/src/support.documentation/services/blobService)

Each of these are defined upon the controller instance as a property that can be access, for example:

```
module.exports = function() {
	return (req, res, next) => {
		this.storageService.getList("books", 1, 10).then((results) => {
			res.json(results);
			next();
		}).catch((err) => {
			res.json({
				error : err.toString()
			});
			next();
		});
	};
};
```