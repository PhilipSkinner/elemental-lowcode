[Back to Controllers](/documentation/websites/controllers)

# Session State

The session state service allows you to store data within a session cookie. This session cookie is simply base64 encoded and so should not contain any confidential information.

The service has the following methods:

* saveSession
* retrieveSession
* isAuthenticated
* getSubject
* getAccessToken
* setAccessToken
* getIdentityToken
* setIdentityToken
* getRefreshToken
* setRefreshToken

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

### isAuthenticated

This method can be used within your controllers to determine if a user is authenticated.

This can be called within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			if (this.sessionState.isAuthenticated()) {
				this.bag.authenticated = true;
			}
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

This method retrieves the current users access token - if they are authenticated. If the user is not authenticated then this method will return null.

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

### setAccessToken

This method can be used to set the access token for the current users session. This call will cause the user to become authenticated.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			this.sessionState.setAccessToken(myToken);
		}
	}
};
```

### getIdentityToken

This method retrieves the current users identity token - if they are authenticated. If the user is not authenticated then this method will return null.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			const token = this.sessionState.getIdentityToken();
		}
	}
};
```

### setIdentityToken

This method can be used to set the identity token for the current users session. This call will cause the user to become authenticated.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			this.sessionState.setIdentityToken(myToken);
		}
	}
};
```

### getRefreshToken

This method retrieves the current users refresh token - if they are authenticated. If the user is not authenticated then this method will return null.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			const token = this.sessionState.getRefreshToken();
		}
	}
};
```

### setRefreshToken

This method can be used to set the refresh token for the current users session. This call will cause the user to become authenticated.

This can be called from within your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			this.sessionState.setRefreshToken(myToken);
		}
	}
};
```