const sqlQueue = function(connectionString, sqlStore) {
	this.name = "queue__messages";
	this.messageDefinition = {
		"name" : this.name,
		"keys" : [
			{
				"type" : "unique",
				"paths" : [
					"$.id"
				]
			}
		],
		"schema" : {
			"type" : "object",
			"properties" : {
				"queue" : {
					"type" : "string"
				},
				"status" : {
					"type" : "string"
				},
				"request" : {
					"type" : "string"
				},
				"result" : {
					"type" : "string"
				},
				"error" : {
					"type" : "string"
				}
			}
		}
	};

	this.sqlStore = sqlStore(connectionString, this.messageDefinition);
};

sqlQueue.prototype.insertMessage = function(queueName, uuid, message) {
	message.request = JSON.stringify(message.request);
	return this.sqlStore.createResource(this.name, uuid, message);
};

sqlQueue.prototype.markAsInProgress = function(queueName, uuid) {
	return this.sqlStore.getResource(this.name, uuid).then((message) => {
		message.status = "INPROGRESS";

		return this.sqlStore.updateResource(this.name, uuid, message);
	});
};

sqlQueue.prototype.markAsComplete = function(queueName, uuid, result) {
	return this.sqlStore.getResource(this.name, uuid).then((message) => {
		message.status = "COMPLETE";
		message.result = JSON.stringify(result);

		return this.sqlStore.updateResource(this.name, uuid, message);
	});
};

sqlQueue.prototype.markAsError = function(queueName, uuid, error) {
	return this.sqlStore.getResource(this.name, uuid).then((message) => {
		message.status = "ERROR";
		message.error = JSON.stringify(error);

		return this.sqlStore.updateResource(this.name, uuid, message);
	});
};

sqlQueue.prototype.getMessage = function(queueName, uuid) {
	return this.sqlStore.getResource(this.name, uuid).then((message) => {
		try {
			message.request = JSON.parse(message.request);
		} catch(e) {}

		try {
			message.result = JSON.parse(message.result);
		} catch(e) {}

		try {
			message.error = JSON.parse(message.error);
		} catch(e) {}

		return Promise.resolve(message);
	});
};

sqlQueue.prototype.deleteMessage = function(queueName, uuid) {
	return this.sqlStore.deleteResource(this.name, uuid);
};

sqlQueue.prototype.getNextMessage = function(queueName) {
	return this.sqlStore.getResources(this.name, 1, 1, [
		{
			path : "$.status",
			value : "PENDING"
		}
	]).then((messages) => {
		if (messages.length > 0) {
			let message = messages[0];

			try {
				message.request = JSON.parse(message.request);
			} catch(e) {}

			try {
				message.result = JSON.parse(message.result);
			} catch(e) {}

			try {
				message.error = JSON.parse(message.error);
			} catch(e) {}

			return Promise.resolve(message);
		}

		return Promise.resolve(null);
	});
};

module.exports = function(connectionString, sqlStore) {
	if (!sqlStore) {
		sqlStore = require("../../../storage/lib/stores/sqlStore");
	}

	return new sqlQueue(connectionString, sqlStore);
};