[Back to Controllers](#/documentation/websites--controllers.md)

# Session State

The session state service allows you to store data within a session cookie. This session cookie is simply base64 encoded and so should not contain any confidential information.

The service has the following methods:

* saveSession
* retrieveSession
* getSubject
* getAccessToken

Each of these methods is described in more detail below.

### saveSession

Parameters:

* `sessionData` - any type, the data to be stored within the session cookie

This method sets the session data that will be sent to the users client once the current request has completed. This data can be of any type, including complex objects. This method call is synchronous.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			this.sessionState.saveSession({
				hello : "world"
			});
		}
	}
};
```

### retrieveSession

This method retrieves the current session data. If there is no session data then this will return null.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			this.bag.data = this.sessionState.retrieveSession();
		}
	}
};
```

### getSubject

This method retrieves the current users unique identitifer (subject identifier). If the user is not logged in then this method will return null.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			this.bag.subject = this.sessionState.getSubject();
		}
	}
};
```

### getAccessToken

This method retrieves the current users access token - if they are authenticated. If the user is not authenticated (via the IdP) then this method will return null.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			const token = this.sessionState.getAccessToken();
		}
	}
};
```