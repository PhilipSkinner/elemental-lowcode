[Back to Index](/src/support.documentation)

# Integrations

The integrations service allows you to connect to third party systems and to surface that connection in a standard manner with standard authentication & authorization.

Each integration defines:

* incoming requests
* outgoing requests (to the third party system)
* transformation logic
* authorization rules

Here is an example integration definition:

```
{
    "name": "exampleGetRequest",
    "description": "Get a single post from our example third party system.",
    "method": "get",
    "body" : {
        "type" : "object",
        "properties" : {
            "id" : {
                "type" : "number"
            }
        },
        "required" : [
            "id"
        ]
    },
    "queryParams": [
        {
            "name": "id",
            "type": "queryParam",
            "description": "The ID of the post to fetch"
        }
    ],
    "security" : {
        "mechanism" : "default"
    },
    "roles" : {
        "replace" : {
            "exec" : false
        },
        "exec" : [
            "custom_role",
            "another_role"
        ],
        "needsRole" : {
            "exec" : true
        }
    },
    "request": {
        "uri": "https://jsonplaceholder.typicode.com/posts/$.variables.id",
        "method": "get",
        "schema": {
            "type": "JSON",
            "value": {
                "type": "object",
                "properties": {
                    "userId": {
                        "type": "integer"
                    },
                    "id": {
                        "type": "integer"
                    },
                    "title": {
                        "type": "string"
                    },
                    "body": {
                        "type": "string"
                    }
                },
                "required": [
                    "userId",
                    "id",
                    "title",
                    "body"
                ]
            }
        }
    },
    "transformer": "(input) => { return input; }"
}
```

### Incoming request definition

The incoming request definition is taken from the following properties on the integration:

* name - used to generate the URI for the integration
* method - the HTTP method to be used to call the integration
* queryParams - any variables that come in via query parameters
* body - any variables that come in via the request body

Clicking on the name of an integration within the integrations section provides automatic documentation on how to call the integration.

### Outgoing request definition

The outgoing request definition is held within the `request` property of the integration definition object.

This object allows for the following confirmation options:

* uri - the URI to call
* method - the HTTP method to use to call the URI
* authentication - authentication mechanism for the outgoing request
* schema - the expected shape of the response data

When a request is made to the integration, this configuration is used to call the third party system. If an error occurs, such as a 404 or the response does not match the defined schema then an error is thrown by the integration.

#### Authentication

The following authentication mechanisms are supported on outgoing requests:

* HTTP basic
* Bearer token
* Query token
* Header token

##### HTTP Basic

To authenticate with the third party system using HTTP basic you need to provide a mechanism of `http_basic` plus the username and password to be used:

```
{
    "request": {
        "uri": "https://jsonplaceholder.typicode.com/posts/$.variables.id",
        "authentication" : {
            "mechanism" : "http_basic",
            "config" : {
                "username" : "$.variables.variable_name",
                "password" : "$.secret.secret_name"
            }
        }
    }
}
```

It is possible to access variables used to call the integration, or to access secrets scoped to the integrations service. You can use hardcoded values but it is not recommended - instead use the secrets manager with secrets scoped to only the integrations service.

##### Bearer Token

To authenticate with the third party system using a static bearer token use a mechanism of `token` along with a type of `bearer`:

```
{
    "request": {
        "uri": "https://jsonplaceholder.typicode.com/posts/$.variables.id",
        "authentication" : {
            "mechanism" : "token",
            "type" : "bearer",
            "config" : {
                "token" : "$.secret.secret_name"
            }
        }
    }
}
```

This will sent the token to the third party system as a bearer token within the authorization header - `Authorization: Bearer token_value`.

It is possible to access variables used to call the integration, or to access secrets scoped to the integrations service. You can use hardcoded values but it is not recommended - instead use the secrets manager with secrets scoped to only the integrations service.

##### Query Token

To authenticate with the third party system using a static bearer token use a mechanism of `token` along with a type of `query`:

```
{
    "request": {
        "uri": "https://jsonplaceholder.typicode.com/posts/$.variables.id",
        "authentication" : {
            "mechanism" : "token",
            "type" : "query",
            "config" : {
                "token" : "$.secret.secret_name",
                "param" : "token_param"
            }
        }
    }
}
```

This will be sent to the third party URI as a query/search parameter - `https://jsonplaceholder.typicode.com/posts/1?token_param=token_value`.

It is possible to access variables used to call the integration, or to access secrets scoped to the integrations service. You can use hardcoded values but it is not recommended - instead use the secrets manager with secrets scoped to only the integrations service.

##### Header Token

To authenticate with the third party system using a static header token use a mechanism of `token` along with a type of `header`:

```
{
    "request": {
        "uri": "https://jsonplaceholder.typicode.com/posts/$.variables.id",
        "authentication" : {
            "mechanism" : "token",
            "type" : "query",
            "config" : {
                "token" : "$.secret.secret_name",
                "header" : "x-api-key"
            }
        }
    }
}
```

This will be sent to the third party URI as a header - `x-api-key: token_value`.

It is possible to access variables used to call the integration, or to access secrets scoped to the integrations service. You can use hardcoded values but it is not recommended - instead use the secrets manager with secrets scoped to only the integrations service.

### Transformation logic

The integrations document contains a property named `transformer` which can be used to modify the response from the third party system. This is a simple anonymous javascript function that takes a single parameter:

*   input - the response from the third party, matching the defined schema

This function is to return a modified version of the response, the simplest transformer is a straight pass through:

```
{
	"transformer" : "(input) => { return input; }"
}
```

### Security

The `roles` section of the integration configuration allows you to define how authorization to execute the integration should be applied to incoming requests.

By default, each integration will only allow execution if an incoming token contains the following role claims:

* `system_admin`
* `system_exec`
* `integration_exec`
* `[integration_name]_exec`

Each integration can have its security configured to:

* Replace the existing roles with a new set of roles
* Append roles to the default set of roles
* Remove the need for any roles, accept any valid access token as authorization

Here is an example `roles` section:

```
{
    "roles" : {
        "replace" : {
            "exec" : true
        },
        "exec" : [
            "custom_role",
            "another_role"
        ],
        "needsRole" : {
            "exec" : true
        }
    }
}
```

#### Disabling Security

It is possible to disable security on your integration by setting the security mechanism to `none`:

```
{
    "security" : {
        "mechanism" : "none"
    }
}
```

If this value is set to anything other that `none` then the system will enforce default RBAC based authentication.
