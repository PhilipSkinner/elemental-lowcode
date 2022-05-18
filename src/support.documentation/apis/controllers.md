[Back to APIs](/documentation/apis)

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

*   [authClientProvider](/documentation/services/authClientProvider)
*   [environmentService](/documentation/services/environmentService)
*   [idmService](/documentation/services/idmService)
*   [integrationService](/documentation/services/integrationService)
*   [rulesetService](/documentation/services/rulesetService)
*   [serviceProvider](/documentation/services/serviceProvider)
*   [storageService](/documentation/services/storageService)

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