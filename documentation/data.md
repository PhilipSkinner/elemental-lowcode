[Back to Index](/documentation)

# Data

The data system allows you to create APIs to serve basic resources, providing you with:

* Basic CRUD operations (GET, POST, PUT, DELETE, PATCH)
* Automatically generated OpenAPI definitions
* OpenAPI (swagger) browser built into the admin
* Ability to secure resources

The data system comes with several storage engines, allowing the data to be presisted with different backends. The following backends are supported:

* In memory store
* File system store
* Postgres SQL
* MySQL
* MariaDB
* MSSQL

## Data types

Each data type is a JSON document that contains:

* The name of the data type
* The data types keys for filtering (todo)
* The schema for the data type (JSON Schema document)
* The roles to authorize access to the data type
* Keys/constraints defined on the resource
* The storage engine to back the data onto

The following is an example data type definition:

```
{
    "storageEngine" : "filesystem",
    "name": "todoList",
    "keys": [
        {
            "type" : "unique",
            "paths" : "$.name"
        }
    ],
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

## Storage Engines

Each data type can be configured to use a storage engine - which allows each type to use the same data store or for each type to use its own unique data store.

The type of storage engine is configured via the `storageEngine` property. The supported values for this are:

* `memory`
* `filesystem`
* `sql`

Each of these options are covered in more detail below.

### `memory`

The memory backing store keeps data within memory - its contents will be loaded every time the application reloads.

This type of store is useful for caches, but should not be used for storing authoratative data as it will be lost.

### `filesystem`

The file system backing store will record entities on the local file system.

*If hosting the application within docker, this means your data will be lost if you upgrade and deploy a new version.*

The file system store is useful for development, but it should not be used for production workloads as it needs to scan all entries from the hard drive when doing filtering or applying constraints.

This store can be used for direct access to data, but will suffer from potential data loss if the file stores location on the systems drive is not persistent across deployments.

### `sql`

The sql backing store allows for the use of:

* Postgres
* MySQL
* MariaDB
* MSSQL

This storage engine options requires a `connectionString` property to be defined within the data type:

```
{
    "name" : "todoList",
    "storageEngine" : "sql",
    "connectionString" : "postgres://root:password@localhost:5432/todo"
}
```

The connection string property is made up of:

* A sql dialect
* The username
* The password
* The servers hostname/IP
* The servers port
* The databases name

The following dialects are supported:

* Postgres - `postgres://`
* MySQL - `mysql://`
* MariaDB - `mariadb://`
* MSSQL - `mssql://`

## Accessing/modifying data

Each datatype gets mapped into an automatically generated, heirarchial RESTful API. Each datatype comes with an automatically generated OpenAPI specification which can be access via:

```
http://storage.elementalsystem.org/[typeName]/.definition
```

Each datatype gets hosted on its own collection endpoint:

```
http://storage.elementalsystem.org/[typeName]
http://storage.elementalsystem.org/[typeName]/[id]
http://storage.elementalsystem.org/[typeName]/.details
```

; which supports `GET`, `POST`, `PUT`, `PATCH` and `DELETE` operations.

Collections (arrays) within the datatype definition get hosted on their own subcollections, automatically scoped by the parent object:

```
http://storage.elementalsystem.org/[typeName]/[parentId]/[subTypeName]
http://storage.elementalsystem.org/[typeName]/[parentId]/[subTypeName]/[id]
http://storage.elementalsystem.org/[typeName]/[parentId]/[subTypeName]/.details
```

These subcollection endpoints support `GET`, `POST`, `PUT`, `PATCH` and `DELETE` operations.

Complex objects are broken down into into their own paths, in other words having a property of type object within your root type will yield a new endpoint on the API for accessing the properties within that child object:

```
http://storage.elementalsystem.org/[typeName]/[subTypeObject]
```

These child object endpoints only support `GET`, `PUT` and `PATCH`.

Documentation for the requests & responses for each data type can be found by clicking on the data types name within the data section of the administration. This documentation is automatically generated and displays information on the expected payloads, responses, headers and authorization details. OpenAPI specification documents are automatically generated for every datatype, and this documentation browser is powered by Swagger.

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

## Constraints

The keys collection on the document allows you to specify constraints within the data. The following constraints are supported:

* unique

**Unique Keys**

A unique key allows you to control the uniqueness of items within the data collection. To create a unique key you need to specify the paths within your object that hold the values you wish to be unique:

````
{
    "keys" : [
        {
            "type" : "unique",
            "paths" : [
                "$.username"
            ]
        }
    ]
}
````

You can include multiple paths within your unique key constraints, to create multi-value unique constraints:

````
{
    "keys" : [
        {
            "type" : "unique",
            "paths" : [
                "$.firstname",
                "$.surname"
            ]
        }
    ]
}
````