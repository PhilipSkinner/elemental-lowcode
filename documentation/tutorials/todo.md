[Back to Tutorials](/documentation/tutorial)

# Todo list

This tutorial will take you through the construction of a todo list app where users can login/register for an account, and can then manage a number of todo lists.

## Authentication

We we utilise an authorization code flow authentication mechanism for this app.

The first step to enable this is to navigate to the security section on the elemental administration website (http://admin.elementalsystem.org) and to press on the add client option:

**Step 1**

![step1](https://i.postimg.cc/J0LbrMcq/Firefox-Screenshot-2020-03-15-T19-28-46-775-Z.png)

Click on the add client button on the security screen.

**Step 2**

Enter the following details into your client configuration:

```
{
    "client_id": "todo-client",
    "client_secret": "a secret for my todo client",
    "scope": "openid roles",
    "redirect_uris": [
        "http://interface.elementalsystem.org/todo/_auth"
    ]
}
```

; then press the save button in the bottom right hand corner.

![step2](https://i.postimg.cc/tCVjQbvf/Firefox-Screenshot-2020-03-15-T19-32-53-548-Z.png)

**Completed**

You have successfully added a new authentication client into the elemental system that you can use for your new todo website application.

## Storage

We are going to have to configure a new data type within the storage system to store everybodies todo lists. We'll add a datatype called `todoList` and define the schema for the objects that are to be stored within it.

**Step 1**

Navigate to the data section on the elemental admin and press on the big plus button in the bottom right to add a new data type.

![step1](https://i.postimg.cc/XJSr6xnS/Firefox-Screenshot-2020-03-15-T19-42-31-323-Z.png)

**Step 2**

![step2](https://i.postimg.cc/T2NtjW0M/Firefox-Screenshot-2020-03-15-T19-40-18-147-Z.png)

Enter the definition for the data type, the definition for this data type will be something like this:

```
{
    "name": "todoList",
    "keys": [],
    "roles" : {
        "replace" : {
            "read" : true,
            "write" : true,
            "delete" : true
        },
        "read" : [],
        "write" : [],
        "delete" : [],
        "needsRole" : {
            "read" : false,
            "write" : false,
            "delete" : false
        }
    },
    "schema": {
        "type": "object",
        "properties": {
            "subject": {
                "type": "string"
            },
            "name" : {
                "type" : "string"
            },
            "entries" : {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title" : {
                            "type" : "string"
                        },
                        "description" : {
                            "type" : "string"
                        },
                        "completed" : {
                            "type" : "boolean"
                        }
                    }
                }
            }
        }
    }
}
```

This definition allows each todo list to have:

* An owner (subject)
* A name
* A list of entries, each with a title, description and a flag indicating if it has been completed

**Completed**

We now have a data type that we can use to store our users data. We can now move onto the final step which is to create the website for this.

## Website

We now have everything we need to create the website that will contain the functionality we need for our todo application.

We're going to add a new website called todo and fill in the controllers interfaces and controllers.

**Step 1**

Navigate to the websites section on the elemental admin and add a new website with the plus button in the lower right hand corner of the screen.

![step1](https://i.postimg.cc/DwSQ2j38/Firefox-Screenshot-2020-03-15-T19-45-57-255-Z.png)

**Step 2**

Configure your website with the following details:

* Name : todo
* Client : todo-client

![step2](https://i.postimg.cc/mkqYMCQb/Firefox-Screenshot-2020-03-15-T19-51-03-897-Z.png)

**Step 3**

Add a new route with these properties:

* Route : /
* Security : system_admin

![step3](https://i.postimg.cc/L62YCy8r/Firefox-Screenshot-2020-03-15-T19-53-27-800-Z.png)

**Step 4**

Modify the controller on your `/` route so it contains the following definition:

```
module.exports = {
    bag : {
      lists : [],
      error : '',
    },
	events : {
		load : function(event) {
		    return this.storageService.getList(
                "todoList",
                1,
                10,
                this.sessionState.getAccessToken()
            ).then((result) => {
                this.bag.lists = result;
            }).catch((err) => {
                this.bag.error = err;
            });
		},
	}
};
```

![step4](https://i.postimg.cc/VsxQmTCV/Firefox-Screenshot-2020-03-15-T19-56-37-541-Z.png)

We now have a controller that will load all of the todo list elements that are relevant to our currently logged in user.

*Todo: Storage service does not allow filtering at the moment and so this will return all users data!*

**Tutorial stops here due to missing features in storage system**