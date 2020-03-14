const apiService = function(app, definitionProvider, apiInstance, glob, path) {
	this.app = app;
	this.definitionProvider = definitionProvider;
	this.apiInstance = apiInstance;
	this.glob = glob;
	this.path = path;
};

apiService.prototype.compileDefinition = function(definitionFile) {
	//read the definition
	return this.definitionProvider.fetchDefinition(definitionFile).then((definition) => {
		//pass this into an API instance
		let instance = this.apiInstance(this.app, definition);

		//and initialise it
		return instance.init();
	});
};

apiService.prototype.findApiDefinitions = function(dir) {
	return new Promise((resolve, reject) => {		
		this.glob(this.path.join(process.cwd(), dir, "**/*.api.json"), (err, definitions) => {
			if (err) {
				return reject(err);
			}

			return resolve(definitions);
		});
	});
};

apiService.prototype.init = function(dir) {
	return this.findApiDefinitions(dir).then((definitions) => {
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

module.exports = function(app, definitionProvider, apiInstance, glob, path) {
	if (!definitionProvider) {
		definitionProvider = require("./definitionProvider")();
	}

	if (!apiInstance) {
		//no exec, can"t be a singleton
		apiInstance = require("./apiInstance");
	}

	if (!glob) {
		glob = require("glob");
	}

	if (!path) {
		path = require("path");
	}

	return new apiService(app, definitionProvider, apiInstance, glob, path);
};