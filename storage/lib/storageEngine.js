const storageEngine = function(store, app, typesReader, typeInstance) {
	this.store = store;
	this.app = app;
	this.typesReader = typesReader;
	this.typeInstance = typeInstance;
};

storageEngine.prototype.init = function(dir) {
	return this.typesReader.readTypes(dir).then((types) => {
		//create an instance for each, handling standard RESTful access
		const doNext = () => {
			if (types.length === 0) {
				return Promise.resolve();
			}

			const next = types.pop();
			let instance = this.typeInstance(this.store, this.app, next);
			return instance.init().then(doNext);
		};
		
		return doNext();
	});
};

module.exports = function(store, app, typesReader, typeInstance) {
	if (!typesReader) {
		typesReader = require('./typesReader')();
	}

	if (!typeInstance) {
		//no exec, can't be a singleton
		typeInstance = require('./typeInstance');
	}

	return new storageEngine(store, app, typesReader, typeInstance);
}