[Back to Services](/documentation/services)

# Service Provider

The service provider gives you a mechanism to resolve your custom services within a website controller. It has the following methods available:

* resolveService
* resolveRequirements

These methods are covered in more detail below.

### resolveService

Parameters:

* `name` - string, the name of the service to resolve

Attempts to resolve the service named with the name parameter. If the system cannot resolve this, or any dependent services, then an exception will be thrown.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			const emailService = this.serviceProvider.getService("emailService");
			return emailService.sendEmail("me@philip-skinner.co.uk", "Hello", "How are you doing today?");
		}
	}
};
```

### resolveRequirements

Parameters:

* `fn` - function, the function to resolve the dependencies for

Attempts to resolve the dependencies for the function. If the system cannot resolve all of the dependencies then an exception will be thrown.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.serviceProvider.resolveRequirements((emailService, templateService) => {
				return templateService.renderTemplate("emailTemplate").then((output) => {
					return emailService.sendEmail("me@philip-skinner.co.uk", "Hello", output);
				});
			});
		}
	}
}
```