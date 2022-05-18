[Back to Index](/documentation)

# Integrations

The integrations service allows you to connect to third party systems and to surface that connection in a standard manner with standard authentication & authorization.

Each integration defines:

*   incoming requests
*   outgoing requests (to the third party system)
*   transformation logic
*   authorization rules

Here is an example integration definition:

```
{
    "name": "exampleGetRequest",
    "description": "Get a single post from our example third party system.",
    "method": "get",
    "variables": [
        {
            "name": "id",
            "type": "queryParam",
            "description": "The ID of the post to fetch"
        }
    ],
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
        "uri": "https://jsonplaceholder.typicode.com/posts/$(id)",
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

*   name - used to generate the URI for the integration
*   method - the HTTP method to be used to call the integration
*   variables - any variables that are required for the integration to be executed

Clicking on the name of an integration within the integrations section provides automatic documentation on how to call the integration.

### Outgoing request definition

The outgoing request definition is held within the `request` property of the integration definition object.

This object allows for the following confirmation options:

*   uri - the URI to call
*   method - the HTTP method to use to call the URI
*   schema - the expected shape of the response data

When a request is made to the integration, this configuration is used to call the third party system. If an error occurs, such as a 404 or the response does not match the defined schema then an error is thrown by the integration.

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

*   `system_admin`
*   `system_exec`
*   `integration_exec`
*   `[integration_name]_exec`

Each integration can have its security configured to:

*   Replace the existing roles with a new set of roles
*   Append roles to the default set of roles
*   Remove the need for any roles, accept any valid access token as authorization

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