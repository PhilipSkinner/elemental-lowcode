const fsQueue = function(fs, path, mkdirp) {
	this.fs 	= fs;
	this.path 	= path;
	this.mkdirp = mkdirp;
};

fsQueue.prototype._ensureDir = function(dir) {
	return this.mkdirp(this.path.join(dir, "messages")).then(() => {
		return this.mkdirp(this.path.join(dir, "pending"));
	});
}

fsQueue.prototype._saveFile = function(file, content) {
	return new Promise((resolve, reject) => {
		this.fs.writeFile(file, content, (err) => {
			if (err) {
				return reject(err);
			}

			return resolve();
		});
	});
};

fsQueue.prototype._deleteFile = function(file) {
	return new Promise((resolve, reject) => {
		this.fs.unlink(file, (err) => {
			return resolve();
		});
	});
};

fsQueue.prototype.insertMessage = function(queueName, uuid, message) {
	return this._ensureDir(this.path.join(process.cwd(), ".queues", queueName)).then(() => {
		//write the message
		return this._saveFile(this.path.join(process.cwd(), ".queues", queueName, "messages", uuid), JSON.stringify(message));
	}).then(() => {
		//write a pointer in the pending
		return this._saveFile(this.path.join(process.cwd(), ".queues", queueName, "pending", uuid), uuid);
	});
};

fsQueue.prototype.markAsInProgress = function(queueName, uuid) {
	return this.getMessage(queueName, uuid).then((message) => {
		message.status = "INPROGRESS";

		return this._saveFile(this.path.join(process.cwd(), ".queues", queueName, "messages", uuid), JSON.stringify(message));
	});
};

fsQueue.prototype.markAsComplete = function(queueName, uuid, result) {
	return this.getMessage(queueName, uuid).then((message) => {
		message.status = "COMPLETE";
		message.result = result;

		return this._saveFile(this.path.join(process.cwd(), ".queues", queueName, "messages", uuid), JSON.stringify(message));
	});
};

fsQueue.prototype.markAsError = function(queueName, uuid, error) {
	return this.getMessage(queueName, uuid).then((message) => {
		message.status = "ERROR";
		message.error = error;

		return this._saveFile(this.path.join(process.cwd(), ".queues", queueName, "messages", uuid), JSON.stringify(message));
	});
};

fsQueue.prototype.getMessage = function(queueName, uuid) {
	return this._ensureDir(this.path.join(process.cwd(), ".queues", queueName)).then(() => {
		return new Promise((resolve, reject) => {
			this.fs.readFile(this.path.join(process.cwd(), ".queues", queueName, "messages", uuid), (err, content) => {
				if (err) {
					return reject(err);
				}

				let data = null;
				try {
					data = JSON.parse(content);
				} catch(e) {
					return reject(new Error(`Could not read message ${uuid} in ${queueName}`));
				}

				return resolve(data);
			})
		});
	});
};

fsQueue.prototype.deleteMessage = function(queueName, uuid) {
	return this._ensureDir(this.path.join(process.cwd(), ".queues", queueName)).then(() => {
		return this._deleteFile(this.path.join(process.cwd(), ".queues", queueName, "pending", uuid));
	}).then(() => {
		return this._deleteFile(this.path.join(process.cwd(), ".queues", queueName, "messages", uuid));
	});
};

fsQueue.prototype.getNextMessage = function(queueName) {
	return this._ensureDir(this.path.join(process.cwd(), ".queues", queueName)).then(() => {
		return new Promise((resolve, reject) => {
			this.fs.readdir(this.path.join(process.cwd(), ".queues", queueName, "pending"), (err, messages) => {
				if (err) {
					return reject(err);
				}

				if (messages.length > 0) {
					//dequeue the message
					return this._deleteFile(this.path.join(process.cwd(), ".queues", queueName, "pending", messages[0])).then(() => {
						return this.getMessage(queueName, messages[0]);
					}).then((message) => {
						return resolve(message);
					});
				}

				return resolve(null);
			});
		});
	});
};

module.exports = function(fs, path, mkdirp) {
	if (!fs) {
		fs = require("fs");
	}

	if (!path) {
		path = require("path");
	}

	if (!mkdirp) {
		mkdirp = require("mkdirp");
	}

	return new fsQueue(fs, path, mkdirp);
};