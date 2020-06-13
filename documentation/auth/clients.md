[Back to Authentication & Authorization](/documentation/auth)

# Clients

Every authentication request to the IdP must be done on behalf of a client, with each client having:

* A unique identifier
* A secret
* A list of valid scopes
* A list of valid grant types
* A list of valid redirect uris (for auth/code flow)

## Scopes

A [scope](/documentation/auth/scopes) allows you to request a group of claims to be included on the JWT token.

A client can have access to 0 or more scopes, with that configuration provided as a space separated list of scopes:

```
{
	"scope" : "openid roles offline_access"
}
```

## Grants

The IdP supports the following grant types:

* `client_credentials`
* `authorization_code`
* `refresh_token`
* `password`

By default every client will be issued the `client_credentials` and `authorization_code` grants. If you want the system to support the automatic refreshing of tokens then the `refresh_token` grant must be added into your list of supported grants.

You can construct your own authentication/registration flow within your application by using the `password` grant to issue tokens. Once this is done the system will automatically manage the users session for you. See the [authClientProvider](/documentation/services/authClientProvider) service for more details on how to use these features.

*Note:* It is recommended that you do not use the `password` grant unless absolutely necessary as it can cause the leaking of credentials.

A client can have 0 or more grants configured, like so:

```
{
	"grants" : [
		"client_credentials",
		"password",
		"refresh_token"
	]
}
```

## Redirect URIs

In order to support the `authorization_code` grant flow the user needs to be redirected back to the client application in order to complete the authentication and token issuance process.

For this process to be secure the URL that the user is redirected back needs to be validated against a list of allowed redirect URIs. If you client supports the `authorization_code` grant then you must provide a list of valid redirect URIs on your client:

```
{
	"redirect_uris" : [
		"http://interface.elementalsystem.org/myApp/_auth"
	]
}
```