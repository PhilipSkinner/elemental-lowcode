const storageEngine = function(app, typesReader, typeInstance, fsStore, memoryStore, sqlStore) {
	this.app 			= app;
	this.typesReader 	= typesReader;
	this.typeInstance 	= typeInstance;
	this.fsStore 		= fsStore;
	this.memoryStore 	= memoryStore;
	this.sqlStore 		= sqlStore;
};

storageEngine.prototype.initStore = function(type) {
	if (type.storageEngine === "memory") {
		return this.memoryStore();
	}

	if (type.storageEngine === "sql") {
		return this.sqlStore(type.connectionString, type);
	}

	//default to fsstore
	return this.fsStore(type.directory);
};

storageEngine.prototype.init = function(dir) {
	return this.typesReader.readTypes(dir).then((types) => {
		//create an instance for each, handling standard RESTful access
		const doNext = () => {
			if (types.length === 0) {
				return Promise.resolve();
			}

			const next = types.pop();
			let instance = this.typeInstance(this.initStore(next), this.app, next);
			return instance.init().then(doNext);
		};

		return doNext();
	});
};

module.exports = function(app, typesReader, typeInstance, fsStore, memoryStore, sqlStore) {
	if (!typesReader) {
		typesReader = require("./typesReader")();
	}

	if (!typeInstance) {
		//no exec, can"t be a singleton
		typeInstance = require("./typeInstance");
	}

	if (!fsStore) {
		fsStore = require("./stores/fsStore");
	}

	if (!memoryStore) {
		memoryStore = require("./stores/memoryStore");
	}

	if (!sqlStore) {
		sqlStore = require("./stores/sqlStore");
	}

	return new storageEngine(app, typesReader, typeInstance, fsStore, memoryStore, sqlStore);
}