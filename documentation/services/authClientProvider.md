[Back to Services](/documentation/services)

# Auth Client Provider

The auth client provider allows you to access the users authentication state, and to request access tokens - either user or application. You can access the following methods on this service:

* loginUser
* logoutUser
* getAccessToken
* tokenExpired
* refreshUserToken

These methods are covered in more detail below.

### loginUser

Parameters:

* `username` - string, the username of the user
* `password` - string, the password for the user

Authenticates using the `password` grant.

If you client has not got the `password` grant setup in its accepted grants then this will fail. To add this into your grants, modify your client config to contain a list of grants like this:

**Note:** This method is only available for website controllers.

```
{
	"grant_types": [
        "client_credentials",
        "authorization_code",
        "password"
    ]
}
```

You can then authenticate users using their username and password:


```
module.exports = {
	events : {
		login : (event) => {
			return this.authClientProvider.loginUser(
				event.bag.username,
				event.bag.password
			).then(() => {
				...
			}).catch((err) => {
				...
			});
		}
	}
};
```

### logoutUser

Logs the users session out.

If the user is not logged in, this will fail silently.

**Note:** This method is only available for website controllers.

Called from your controllers like so:

```

module.exports = {
	events : {
		logout : (event) => {
			this.authClientProvider.logoutUser();
		}
	}
};
```

### getAccessToken

This method fetches an access token to speak to third party APIs with. This access token will be either a user access token - if the current user is authenticated - or it will be a client token fetched using your clients credentials.

All clients are issued the client_credentials grant by default if a custom list of grant types is not set on the client config. If you override the client config with a custom list of grant types, expect this call to fail if the current user is not authenticated.

The response within the resolution of the promise can return a blank token - if no client is configured for the application for example.

**Note:** This method will only return user access tokens on website controllers, every other service will be returned the relevant client access token.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			this.authClientProvider.getAccessToken().then((token) => {
				...
			}).catch((err) => {
				...
			});
		}
	}
};
```

### tokenExpired

Parameters:

* `token` - string, the JWT token to check for expiration

Returns true if the token has expired, false if it has not.

Called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			if (this.authClientProvider.tokenExpired("token value")) {
				...
			}
		}
	}
}
```

### refreshUserToken

Refreshes the current users access & identity tokens and returns the newly refreshed access token.

This method returns a promise and will resolve a null access token if the user is either not logged in or does not have a refresh token.

Called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.authClientProvider.refreshUserToken().then((accessToken) => {
				...
			});
		}
	}
}
```