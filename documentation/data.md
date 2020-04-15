[Back to Index](/documentation)

# Data

The data system allows you to create APIs to serve basic resources, providing you with:

* Basic CRUD operations (GET, POST, PUT, DELETE, PATCH)
* Ability to secure resources

## Data types

Each data type is a JSON document that contains:

* The name of the data type
* The data types keys for filtering (todo)
* The schema for the data type (JSON Schema document)
* The roles to authorize access to the data type

The following is an example data type definition:

```
{
    "name": "todoList",
    "keys": [],
    "roles" : {
    	"replace" : {
    		"read" : false,
    		"write" : true,
    		"delete" : true
    	},
    	"read" : [
    		"custom_reader_role"
    	],
    	"write" : [
    		"system_admin",
    		"custom_writer_role"
    	],
    	"delete" : [
    		"system_admin",
    		"custom_deleter_role"
    	],
    	"needsRole" : {
    		"read" : false,
    		"write" : true,
    		"delete" : true
    	}
    }
    "schema": {
        "type": "object",
        "properties": {
            "subject": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "entries": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string"
                        },
                        "description": {
                            "type": "string"
                        },
                        "completed": {
                            "type": "boolean"
                        }
                    }
                }
            }
        }
    }
}
```

## Accessing/modifying data

Each data type is automatically hosted on the storage service with 7 endpoints:

* `GET http://localhost:8006/[typeName]`
* `POST http://localhost:8006/[typeName]`
* `GET http://localhost:8006/[typeName]/.details`
* `GET http://localhost:8006/[typeName]/[entityId]`
* `PUT http://localhost:8006/[typeName]/[entityId]`
* `PATCH http://localhost:8006/[typeName]/[entityId]`
* `DELETE http://localhost:8006/[typeName][entityId]`

Documentation for the requests & responses for each data type can be found by clicking on the data types name within the data section of the administration. This documentation is automatically generated and displays information on the expected payloads, responses, headers and authorization details.

## Security

The roles section within a data type definition document supports the ability for you to define:

* Should the default roles be replaced with a new set of roles
* What are the extra (or complete) set of roles for operations
* Is a role required

**Operation Types**

There are three operation types that be carried out on a data type and its entities, these are:

* Read
* Write
* Delete

The roles for each of these can be controlled individually within the configuration, along with if a role is required for the operation and if the system default roles are to be left intact.

**Default Roles**

Each data type comes with a set of default roles that are used to protect its three types of operations:

* Read:
	- `system_admin`
	- `system_reader`
	- `data_reader`
	- `[typeName]_reader`
* Write:
	- `system_admin`
	- `system_writer`
	- `data_writer`
	- `[typeName]_writer`
* Delete:
	- `system_admin`
	- `system_writer`
	- `data_writer`
	- `[typeName]_writer`

; where `typeName` is automatically taken from your data types name. For example, if your data type is called `pets` then your data type will allow read operations if a token containint the `pets_reader` role is present.

**Disabling Default Roles**

The default roles can be disabled on a data type by using the replace property within the roles section:

```
{
	"roles" : {
		"replace" : {
			"read" : true,
			"write" : true,
			"delete" : true
		}
	}
}
```

The properties that are available on this replace property object are:

* read
* write
* delete

All three are boolean values. Setting them to true disables the default list of roles for each operation type and the system will rely upon you to specify your own roles for the operations.

**Specifying Roles**

Roles for the operations can be defined in one of three properties on the roles object:

* read
* write
* delete

Each of these properties is an array of string values - those values being the role names you want to use.

If you wanted to allow access to any token which has the role of `user` on it, you can provide the following config:

```
{
	"roles" : {
		"read" : [
			"user"
		],
		"write" : [
			"user"
		],
		"delete" : [
			"user"
		]
	}
}
```

**Disabling the need for roles**

If you do not want to protect a data type and its operation with any roles and just want to check that a valid access token has been used, you can specify if the operations need a role to be present in the needsRole property:

```
{
	"roles" : {
		"needsRole" : {
			"read" : false,
			"write" : true,
			"delete" : true
		}
	}
}
```

The needsRole object has three properties that can be set:

* read
* write
* delete

Each of these is a boolean. Setting a property to true will enforce a role being present on the token. Setting a property to false will only check if a valid token was presented to the storage API.