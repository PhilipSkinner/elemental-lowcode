[Back to Services](/documentation/services)

# Rulesets Service

The rulesets service allows you to call into any rulesets defined within the system. It surfaces the following methods:

* callRuleset

These methods are covered in more detail below.

### callRuleset

Parameters:

* `name` - string, the name of the ruleset to call
* `facts` - object, the collection of facts to call the ruleset with
* `token` - string, the access token to use to access the API *optional*

Calls the named ruleset with the facts given and returns the JSON response (as a parsed object) within a promise. This method can reject with an error and needs to be handled correctly.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.rulsetService.callRuleset(
				"isValid",
				{
					my : 'value'
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