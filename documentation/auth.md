[Back to Index](/documentation)

# Authentication & Authorization

Elemental comes with a built in [OIDC/Oauth2.0](https://openid.net/connect/) identity provider.

This identity provider can be used for issuing tokens for both users and applications. Those tokens are JWT (JSON Web Tokens) and are signed asymmetrically in order to ensure that the system can repudiate tokens issued outside of the system.

The issuance of tokens is normally handled automatically for your applications as and when a token is required - and a valid IdP issued token is required to make any call to any part of the system.

The IdP can be used to issue tokens to services external to elemental, and can be verified in the same way - this allows you to secure other (maybe pre-existing systems) in a consistent manner.

There are several configuration options for the IdP, these are:

* [Scopes](/documentation/auth/scopes)
* [Clients](/documentation/auth/clients)
* [Users](/documentation/auth/users)
* [Storage](/documentation/auth/storage)

Every system within elemental utilises RBAC (role-based access control) on its endpoints, coming with a number of [pre-defined roles](/documentation/auth/defaultRoles).