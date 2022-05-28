[Back to Services](/src/support.documentation/services)

# Blob Service

The blob service allows you to upload, download and retrieve meta data relating to files/folders within blob stores. It supports the following methods:

* details
* upload
* download
* delete

These methods are covered in more detail below.

### details

Parameters:

* `storeName` - the name of the store to query
* `path` - the full path of the file/folder within the store
* `authToken` - an optional authentication token to use, if left blank the system will attempt to generate one automatically for you

Looks up details for the given path. If this path is a folder then this will return a list of the objects within that folder. This method is async.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.details = await this.blobService.details('imageStore', '/path/to/folder');
        }
    }
};
```

### upload

Parameters:

* `storeName` - the name of the store to upload to
* `path` - the full path of the location where you wish to store the file
* `file` - the object containing the file data
* `authToken` - an optional authentication token to use, if left blank the system will attempt to generate one automatically for you

Uploads a file to the blob store.

This is designed to be used within interface controllers - any valid input of type file will generate an appropriate `file` value when it is bound to an event value. If this is to be used within another component (such as a queue handler) then the `file` parameter needs to be in the following structure:

```
{
    data            : Buffer(),     //data in here
    tempFilePath    : './tmp/file', //or pass in a path to the file on the local file system
}
```

Given a view with the following definition:

```
{
    "tag": "html",
    "children": [
        {
            "tag": "head",
            "children": []
        },
        {
            "tag": "body",
            "children": [
                {
                    "tag": "form",
                    "submit": {
                        "eventName": "submit"
                    },
                    "children": [
                        {
                            "tag": "input",
                            "type": "text",
                            "bind": "$.bag.path"
                        },
                        {
                            "tag": "input",
                            "type": "file",
                            "bind": "$.bag.file"
                        },
                        {
                            "tag": "button",
                            "text": "Upload",
                            "type": "submit"
                        }
                    ],
                    "enctype": "multipart/form-data"
                }
            ]
        }
    ]
}
```

The file can be uploaded to a blob store using the following controller code:

```
module.exports = {
    bag : {
        path : "/myfile"
    },
    events : {
        load : async function(event) {

        },
        submit : async function(event) {
            await this.blobService.upload("local", event.bag.path, event.bag.file);
        }
    }
}
```

### download

Parameters:

* `storeName` - the name of the store to download from
* `path` - the full path of the file/folder within the store
* `authToken` - an optional authentication token to use, if left blank the system will attempt to generate one automatically for you

Downloads the binary data for the object within the blob store.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.data = await this.blobService.download('imageStore', '/path/to/folder');
        }
    }
};
```

### delete

Parameters:

* `storeName` - the name of the store to delete from
* `path` - the full path of the file/folder within the store
* `authToken` - an optional authentication token to use, if left blank the system will attempt to generate one automatically for you

Deletes the path from the store. If this path is a folder then all files/folders within it will also be deleted.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            await this.blobService.delete('imageStore', '/path/to/folder');
        }
    }
};
```