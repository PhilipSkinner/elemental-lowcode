[Back to Authentication & Authorization](/documentation/auth)

# Scopes

Scopes are used to configure the group of claims that should be returned with a request.

A [client](/documentation/auth/clients) must be configured to have access to a particular scope - if it does not then there will be an error when an authentication request is attempted.

Scopes are configured with:

*   A name
*   A list of claims

When an authentication request is sent to the IdP with a scope, it will restrict the claims issues on the JWT token based upon the claims held within the scope(s) requested.

A raw scope configuration file looks like this:

```
{
	"name" : "name_email",
	"claims" : [
		"email",
		"firstname",
		"lastname",
		"name"
	]
}
```