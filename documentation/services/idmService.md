[Back to Services](/documentation/services)

# Identity Management Service

The identity management (idm) service allows you to manage users held within the identity provider. You can call the following methods on this service:

* registerUser
* getUser

These methods are covered in more detail below.

### registerUser

Parameters:

* `user` - object, contains the username and password for the new user
* `authToken` - string, the access token to use to access the API *optional*

Creates a new user on the identity provider.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.idmService.registerUser({
				username : "dave",
				password : "davidson"
			}).then((newUser) => {
				...
			}).catch((err) => {
				...
			});
		}
	}
};
```

### getUser

Parameters:

* `username` - string, username of the user to fetch
* `authToken` - string, the access token to use to access the API *optional*

Fetches the user from the identity provider.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.idmService.getUser("dave").then((user) => {
				...
			}).catch((err) => {
				...
			});
		}
	}
};
```