[Back to Services](/documentation/services)

# Messaging Service

The messaging service allows you to access the messaging system. It provides you with the following methods:

*   queueMessage
*   getMessage
*   deleteMessage

All of these methods support an optional access token argument - if one is not provided then the system will attempt to automatically generate one based upon the calling applications credentials.

These methods are covered in more detail below.

### queueMessage

Parameters:

*   `queueName` - string, the name of the queue to add the message to
*   `message` - object, the message object
*   `token` - string, the access token to use to access the API *optional*

Attempts to add the given message into the queue. This method returns a promise that can fail. When it is successful it will return the ID of the newly generated message.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.messagingService.queueMessage(
				"myQueue",
				{
					hello : "world"
				}
			).then((id) => {
				console.log(id);
			}).catch((err) => {
				...
			});
		}
	}
};
```

### getMessage

Parameters:

*   `queueName` - string, the name of the queue to query
*   `id` - string, the unique identifier for the message
*   `token` - string, the access token to use to access the API *optional*

Attempts to fetch the message identified from the queue. This method returns a promise that can fail. When it is successful it will return the message object.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.messagingService.getMessage(
				"myQueue",
				"05749898-74a0-47e1-b10d-5acf29d040c4"
			).then((message) => {
				if (message.status === 'COMPLETE') {
					...
				} else {
					...
				}
			}).catch((err) => {
				...
			});
		}
	}
};
```

### deleteMessage

Parameters:

*   `queueName` - string, the name of the queue to query
*   `id` - string, the unique identifier for the message
*   `token` - string, the access token to use to access the API *optional*

Attempts to delete the message identified from the queue. This method returns a promise that can fail.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			return this.messagingService.deleteMessage(
				"myQueue",
				"05749898-74a0-47e1-b10d-5acf29d040c4"
			).then(() => {
				...
			}).catch((err) => {
				...
			});
		}
	}
};
```