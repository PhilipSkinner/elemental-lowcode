const memoryStore = function(jsonpath) {
	this.store 		= {};
	this.jsonpath 	= jsonpath;
};

memoryStore.prototype.initType = function(type) {
	if (!this.store[type]) {
		this.store[type] = {};
	}
};

memoryStore.prototype.getResources = function(type, start, count, filters) {
	this.initType(type);

	return new Promise((resolve, reject) => {
		let all = Object.keys(this.store[type]);
		let found = [];

		if (filters && filters.length > 0) {
			filters.forEach((f) => {
				all.forEach((a) => {
					let value = this.jsonpath.query(this.store[type][a], f.path);

					if (value[0] === f.value) {
						found.push(a);
					}
				});
			});
		} else {
			found = all;
		}

		return resolve(found.slice(start - 1, count).map((k) => {
			return Object.assign(this.store[type][k], { id : k });
		}));
	});
};

memoryStore.prototype.getDetails = function(type, parent) {
	const filters = [];
	if (parent) {
		filters.push({
			path 	: "$.parent",
			value 	: parent
		});
	}

	return this.getResources(type, 1, 9999999, filters).then((results) => {
		return Promise.resolve({
			count : results.length
		});
	});
};

memoryStore.prototype.getResource = function(type, id) {
	this.initType(type);

	if (typeof(id) === "undefined" || id === null) {
		return Promise.resolve(null);
	}

	return new Promise((resolve, reject) => {
		return resolve(this.store[type][id]);
	});
};

memoryStore.prototype.createResource = function(type, id, data) {
	this.initType(type);

	return new Promise((resolve, reject) => {
		data.id = id;
		this.store[type][id] = data;
		return resolve(true);
	});
};

memoryStore.prototype.updateResource = function(type, id, data) {
	this.initType(type);

	return new Promise((resolve, reject) => {
		data.id = id;
		this.store[type][id] = data;
		return resolve(true);
	});
};

memoryStore.prototype.deleteResource = function(type, id) {
	this.initType(type);

	return new Promise((resolve, reject) => {
		delete this.store[type][id];
		return resolve(true);
	});
};

module.exports = function(jsonpath) {
	if (!jsonpath) {
		jsonpath = require("jsonpath");
	}

	return new memoryStore(jsonpath);
};