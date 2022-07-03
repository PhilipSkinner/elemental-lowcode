[Back to Index](/documentation)

# Messaging

The messaging system allows you to define queues and the handler to process the messages.

Each queue includes:

*   A name
*   Incoming message definition
*   Security configuration
*   A handler
*   Storage configuration

The messaging system comes with several storage engines, allowing the data to be presisted with different backends. The following backends are supported:

*   File system store
*   Postgres SQL
*   MySQL
*   MariaDB
*   MSSQL

Each queue will be backed by `filesystem` storage by default.

Here is an example queue definition:

```
{
    "name": "myQueue",
    "storageEngine" : "filesystem",
    "client_id": "my-client",
    "security" : {
        "mechanism": "default"
    },
    "roles": {
        "needsRole": true,
        "replace": true,
        "roles": [
            "one",
            "two"
        ]
    },
    "incoming": {
        "schema": {
            "type": "object",
            "properties": {
                "hello": {
                    "type": "string"
                },
                "world" : {
                    "type" : "string"
                }
            },
            "additionalProperties" : false,
            "required" : [
                "hello"
            ]
        }
    }
}
```

; and a queue handler:

```
module.exports = function(message) {
    return new Promise((resolve, reject) => {
        console.log(message);
        return resolve({
            result : "value"
        });
    });
};
```

The queue system then hosts an API that allows you to:

*   Push messages onto the queue
*   Get the status of a message
*   Delete a message

Each message sent into the queue gets given:

*   An ID
*   A status

An example message looks like:

```
{
    "id": "71b8f010-dd42-421f-8bb9-d736b6705e18",
    "queue": "myQueue",
    "status": "COMPLETE",
    "request": {
        "hello": "there",
        "world" : "yes"
    },
    "result": {
        "result" : "value"
    },
    "error": null
}
```

There are 4 message statuses:

*   `PENDING`
*   `INPROGRESS`
*   `COMPLETE`
*   `ERROR`

### Incoming Message Definition

The incoming message definition includes a schema defined with [JSON Schema](https://json-schema.org/). This definition is used to validate any messages that are added to the queue. If a message does not pass validation then it is rejected:

```
{
    "incoming" : {
        "schema" : {
            "type" : "array",
            "items" : {
                "type" : "string"
            }
        }
    }
}
```

### Handler Definition

A handler needs to return a function that takes the message as its only argument, and returns a `Promise`.

When your function starts to execute the message is marked as `INPROGRESS`.

When the promise resolves the value resolved from the promise will be stored as the messages result and the message will be marked as `COMPLETE`.

If the promise has a rejection, either intended or otherwise, the error will be stored on the message error property and the message will be marked as `ERROR`.

You can use the following services within your handler code:

* [authClientProvider](/src/support.documentation/services/authClientHandler)
* [environmentService](/src/support.documentation/services/environmentService)
* [idmService](/src/support.documentation/services/idmService)
* [integrationService](/src/support.documentation/services/integrationService)
* [messagingService](/src/support.documentation/services/messagingService)
* [rulesetService](/src/support.documentation/services/rulesetService)
* [serviceProvider](/src/support.documentation/services/serviceProvider)
* [storageService](/src/support.documentation/services/storageService)
* [locationService](/src/support.documentation/services/locationService)
* [blobService](/src/support.documentation/services/blobService)

### Security

A valid access token must be presented to the messaging service API in order to push, access or delete messages.

You can control the validation of this token within the queue definition by:

*   Configuring if a role is required
*   Overwrite the auto-generated system roles
*   Define your own roles

There are a number of default roles that the system sets on these API endpoints, these are:

*   `system_admin`
*   `system_writer`
*   `queue_writer`
*   `[queue_name]_writer`

; where `[queue_name]` is automatically replaced by the name of your queue.

#### Configuring if a role is required

You can modify the `needsRole` property on the `roles` object within the queue definition to be either true or false.

When this value is set to false, the system will validate the token only, it will not check that the token contains any of the required roles.

When this value is set to true, the system will validate the token and check for the existence of a role that allows access to the endpoint.

#### Overwriting the auto-generated system roles

You can modify the `replace` property on the `roles` object within the queue definition to be either true or false.

When this value is set to false, the system will keep the auto-generated roles in the list of roles that tokens are validated against.

When this value is set to true, the system will keep only the `system_admin` role from the list of default roles.

#### Define your own roles

You can add roles into the `roles` array on the `roles` object within the queue definition.

These roles should be simple string values.

#### Disabling security

It is possible to disable all security by setting the security mechanism to `none`:

```
{
    "security" : {
        "mechanism" : "none"
    }
}
```

If this value is set to anything other than `none` then the default RBAC authentication mechanism will be enforced.

## Storage Engines

Each queue can be configured to use a storage engine - which allows each queue to use the same data store or for each type to use its own unique data store.

The type of storage engine is configured via the `storageEngine` property. The supported values for this are:

*   `filesystem`
*   `sql`

Each of these options are covered in more detail below.

### `filesystem`

The file system backing store will record queue messages on the local file system.

*If hosting the application within docker, this means your messages will be lost if you upgrade and deploy a new version.*

The file system store is useful for development, but it should not be used for production workloads.

This store can be used for direct access to messages, but will suffer from potential message loss if the file stores location on the systems drive is not persistent across deployments.

### `sql`

The sql backing store allows for the use of:

*   Postgres
*   MySQL
*   MariaDB
*   MSSQL

This storage engine options requires a `connectionString` property to be defined within the data type:

```
{
    "name" : "myQueue",
    "storageEngine" : "sql",
    "connectionString" : "postgres://root:password@localhost:5432/todo"
}
```

The connection string property is made up of:

*   A sql dialect
*   The username
*   The password
*   The servers hostname/IP
*   The servers port
*   The databases name

The following dialects are supported:

*   Postgres - `postgres://`
*   MySQL - `mysql://`
*   MariaDB - `mariadb://`
*   MSSQL - `mssql://`