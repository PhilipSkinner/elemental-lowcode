[Back to Services](/documentation/services)

# Storage Service

The storage service allows you to access data types defined within the storage system. It provides the following methods:

*   detailCollection
*   getList
*   getEntity
*   createEntity
*   updateEntity
*   patchEntity
*   deleteEntity

Each of these methods is covered in more detail below.

### detailCollection

Parameters:

*   `name` - string, the name of the collection to detail
*   `token` - string, the access token to use to access the API *optional*

Returns the JSON response from the relevant .details endpoint on the storage service. More details on this response payload can be found within the [storage system documentation](/documentation/data).

This method returns a Promise which can resolve or reject. You must make sure to handle rejections correctly.

This can be called from within a controller like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.storageService.detailCollection(
				"books"
			).then((result) => {

			}).catch((err) => {

			});
		}
	}
};
```

### getList

Parameters:

*   `path` - string, the root path of the collection to fetch from
*   `start` - integer, the index of the first item to retrieve
*   `count` - integer, the maximum number of items to retrieve
*   `filters` - object, the filters to apply when fetching items
*   `token` - string, the access token to use to access the API *optional*

Returns a paginated list of entities from the named collection. More details on this response payload can be found within the [storage system documentation](/documentation/data).

Filters can be applied to the entities to only include items that have certain values. Filters are based upon the JSON path of the value within the entity and match (equality) against a single value.

This method returns a Promise which can resolve or reject. You must make sure to handle rejections correctly.

This can be called from within a controller like so:

```
module.exports = {
	events : {
		myEvent : (event) => {
			return this.storageService.getList(
				`authors/${event.authorId}/books`,
				1,
				10,
				{
					"$.rating" : "10"
				}
			).then((result) => {

			}).catch((err) => {

			});
		}
	}
};
```

### getEntity

Parameters:

*   `path` - string, the root path of the collection to fetch from
*   `id` - guid (string), the id of the entity to retrieve
*   `token` - string, the access token to use to access the API *optional*

Returns a single entity from the named collection. More details on this response payload can be found within the [storage system documentation](/documentation/data).

This method returns a Promise which can resolve or reject. You must make sure to handle rejections correctly.

This can be called from within a controller like so:

```
module.exports = {
	events : {
		myEvent : (event) => {
			return this.storageService.getEntity(
				`authors/${event.authorId}/books`,
				"16aeb990-4f40-4060-892c-bebe9456de3f"
			).then((result) => {

			}).catch((err) => {

			});
		}
	}
};
```

### createEntity

Parameters:

*   `path` - string, the root path of the collection to create the entity in
*   `entity` - object, an object that matches the definition of entities within the named collection, the contents of which will be used to create the new entity
*   `token` - string, the access token to use to access the API *optional*

Creates a new entity within the named collection. More details on this response payload can be found within the [storage system documentation](/documentation/data).

This method returns a Promise which can resolve or reject. You must make sure to handle rejections correctly. This promise will return the newly created object as the result.

This can be called from within a controller like so:

```
module.exports = {
	events : {
		myEvent : (event) => {
			return this.storageService.createEntity(
				`authors/${event.authorId}/books`,
				{
					hello : "world"
				}
			).then((result) => {

			}).catch((err) => {

			});
		}
	}
};
```

### updateEntity

Parameters:

*   `path` - string, the root path of the collection to update an entity in
*   `id` - guid, the id of the entity to update
*   `entity` - object, an object that matches the definition of entities within the named collection, the contents of which will replace the entity with the given id
*   `token` - string, the access token to use to access the API *optional*

Updates an entity within the collection. More details on this response payload can be found within the [storage system documentation](/documentation/data).

This method returns a Promise which can resolve or reject. You must make sure to handle rejections correctly.

This can be called from within a controller like so:

```
module.exports = {
	events : {
		myEvent : (event) => {
			return this.storageService.updateEntity(
				`authors/${event.authorId}/books`,
				"16aeb990-4f40-4060-892c-bebe9456de3f",
				{
					hello : "world"
				}
			).then((result) => {

			}).catch((err) => {

			});
		}
	}
};
```

### patchEntity

Parameters:

*   `path` - string, the root path of the collection to update an entity in
*   `id` - guid, the id of the entity to update
*   `entity` - object, an object that matches the definition of entities within the named collection, the contents of which will replace the entity with the given id
*   `token` - string, the access token to use to access the API *optional*

Partially updates an entity within the collection. More details on this response payload can be found within the [storage system documentation](/documentation/data).

This method returns a Promise which can resolve or reject. You must make sure to handle rejections correctly.

This can be called from within a controller like so:

```
module.exports = {
	events : {
		myEvent : (event) => {
			return this.storageService.updateEntity(
				`authors/${event.authorId}/books`,
				"16aeb990-4f40-4060-892c-bebe9456de3f",
				{
					hello : "world"
				}
			).then((result) => {

			}).catch((err) => {

			});
		}
	}
};
```

### deleteEntity

Parameters:

*   `path` - string, the root path of the collection to delete from
*   `id` - guid (string), the id of the entity to delete
*   `token` - string, the access token to use to access the API *optional*

Deletes an entity from the named collection. More details on this response payload can be found within the [storage system documentation](/documentation/data).

This method returns a Promise which can resolve or reject. You must make sure to handle rejections correctly.

This can be called from within a controller like so:

```
module.exports = {
	events : {
		myEvent : (event) => {
			return this.storageService.deleteEntity(
				`authors/${event.authorId}/books`,
				"16aeb990-4f40-4060-892c-bebe9456de3f"
			).then((result) => {

			}).catch((err) => {

			});
		}
	}
};
```