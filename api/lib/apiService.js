const apiService = function(app, definitionProvider, apiInstance) {
	this.app = app;
	this.definitionProvider = definitionProvider;
	this.apiInstance = apiInstance;
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

apiService.prototype.init = function(definitions) {
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
}

module.exports = function(app, definitionProvider, apiInstance) {
	if (!definitionProvider) {
		definitionProvider = require('./definitionProvider')();
	}

	if (!apiInstance) {
		//no exec, can't be a singleton
		apiInstance = require('./apiInstance');
	}

	return new apiService(app, definitionProvider, apiInstance);
}