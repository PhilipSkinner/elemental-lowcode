[Back to Authentication & Authorization](/documentation/auth)

# Users

Users are credentials that any `authorization_code` or `password` grant challenges are checked against, plus they contain any claim values:

```
{
	"username" : "admin",
    "password": "$2b$10$uQP8/fUQ.sHzupBgqUq2luWNVZo4mNm2Lh/HrYPvxz3JPWG8ZFHeS",
    "registered": "2020-06-13T21:50:31.653Z",
    "claims": {
    	"email" : "my@email.com",
        "roles": [
            "system_admin"
        ]
    }
}
```

Claims will be included within the generated JWT token, aslong as that claim is included within any of the [scopes](/documentation/auth/scopes) requested by the client. Claims can have 1 value or multiple, and can be complex objects (if required) - but must not be abused or your tokens will become unweildy.

Passwords are hashed and one way encrypted with a unique salt per user. To change the password for user, enter a plain text password into the document in place of the encrypted password.

All users can login to any client - there is no tenancy within the user database.