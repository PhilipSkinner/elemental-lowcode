[Back to Services](/src/support.documentation/services)

# Environment Service

The environment service allows you to fetch values based upon the environment that the system is running in. You can access the following methods
on this service:

*   getEnvironmentalVariable
*   listEnvironmentVariables
*   getSecret
*   listSecrets

These methods are covered in more detail below.

### getEnvironmentalVariable

Parameters:

*   `name` - string, the name of the environmental variable

Returns the value of the environmental variable, if defined, on the system.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			let logLevel = this.environmentService.getEnvironmentalVariable("DEGUG") === "1" ? "debug" : "error";
		}
	}
};
```

### listEnvironmentVariables

Returns a list of all environmental variables, excluding secrets.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			let env = this.environmentService.listEnvironmentVariables();
		}
	}
};
```

### getSecret

Parameters:

*   `name` - string, the name of the secret as defined within the security center

Returns the value of the named secret.

This can be called from your services like so:

```
const emailProvider = function(environmentService) {
    this.client = require('@sendgrid/mail');
    this.client.setApiKey(environmentService.getSecret("sendGridKey"));
};

emailProvider.prototype.sendEmail = function(from, subject, body, to) {
	const msg = {
		to: to,
		from: from,
		subject: subject,
		text: body,
		html: body,
    };
    return this.client.send(msg);
};

module.exports = emailProvider;
```

; and from within your controllers:

```
module.exports = {
	events : {
		load : (event) => {
			let secretValue = this.environmentService.getSecret("mySecret");
		}
	}
};
```

### listSecrets

Returns a list of all secrets.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			let secrets = this.environmentService.listSecrets();
		}
	}
};
```