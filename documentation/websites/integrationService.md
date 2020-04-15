[Back to Controllers](/documentation/websites/controllers)

# Integrations Service

The integrations service allows you to call into any integrations defined within the system. It surfaces the following methods:

* callIntegration

These methods are covered in more detail below.

### callIntegration

Parameters:

* `name` - string, the name of the ruleset to call
* `method` - string, the HTTP method to call the integration using
* `params` - object, the query parameters (or body) to send to the integration endpoint
* `token` - string, the access token to use to access the API *optional*

Calls the named integration with the paramters given and returns the JSON response (as a parsed object) within a promise. This method can reject with an error and needs to be handled correctly.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.integrationService.callIntegration(
				"getWeatherReport",
				"get",
				{
					location : "Cullingworth, UK"
				}
			).then((result) => {
				...
			}).catch((err) => {
				...
			});
		}
	}
};
```