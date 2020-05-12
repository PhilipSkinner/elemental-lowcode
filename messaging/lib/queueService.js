const queueService = function(app, path, glob, definitionProvider, queueInstance) {
	this.app 				= app;
	this.path 				= path;
	this.glob 				= glob;
	this.definitionProvider = definitionProvider;
	this.queueInstance 		= queueInstance;

	this.instances 			= [];
};

queueService.prototype.findQueueDefinitions = function(dir) {
	return new Promise((resolve, reject) => {
		this.glob(this.path.join(process.cwd(), dir, "**/*.queue.json"), (err, definitions) => {
			if (err) {
				return reject(err);
			}

			return resolve(definitions);
		});
	});
};

queueService.prototype.terminateInstances = function() {
	this.instances.forEach((instance) => {
		instance.terminate();
	});
};

queueService.prototype.compileDefinition = function(definitionFile) {
	//read the definition
	return this.definitionProvider.fetchDefinition(definitionFile).then((definition) => {
		//pass this into an API instance
		let instance = this.queueInstance(this.app, definition);

		this.instances.push(instance);

		//and initialise it
		return instance.init();
	});
};

queueService.prototype.init = function(dir) {
	return this.findQueueDefinitions(dir).then((definitions) => {
		const doNext = () => {
			if (definitions.length === 0) {
				return Promise.resolve();
			}

			const definition = definitions.pop();

			return this.compileDefinition(definition).then(() => {
				return doNext();
			});
		}

		return doNext();
	});
};

module.exports = function(app, path, glob, definitionProvider, queueInstance) {
	if (!path) {
		path = require("path");
	}

	if (!glob) {
		glob = require("glob");
	}

	if (!definitionProvider) {
		definitionProvider = require("./definitionProvider")();
	}

	if (!queueInstance) {
		queueInstance = require("./queueInstance");
	}

	return new queueService(app, path, glob, definitionProvider, queueInstance);
};