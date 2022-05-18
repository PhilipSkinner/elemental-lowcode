[Back to Services](/src/support.documentation/services)

# Identity Management Service

The identity management (idm) service allows you to manage users held within the identity provider. You can call the following methods on this service:

*   registerUser
*   getUser
*   updateUser

These methods are covered in more detail below.

### registerUser

Parameters:

*   `user` - object, contains the username and password for the new user
*   `authToken` - string, the access token to use to access the API *optional*

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

*   `username` - string, username of the user to fetch
*   `authToken` - string, the access token to use to access the API *optional*

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

### updateUser

Parameters:

*   `username` - string, the username of the user to update
*   `password` - string, the password to set on the user, set to null to leave unchanged
*   `claims` - object, an object that contains all of the claims for the user

Updates a users entry in the identity provider.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		changePassword : (event) => {
			return this.idmService.updateUser(event.bag.username, event.bag.password, {}).then(() => {
				...
			}).catch((err) => {
				...
			});
		}
	}
};
```