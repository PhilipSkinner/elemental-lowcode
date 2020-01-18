const memoryStore = function() {	
	this.store = {};
};

memoryStore.prototype.initType = function(type) {
	if (!this.store[type]) {
		this.store[type] = {};
	}
};

memoryStore.prototype.getResources = function(type, start, count) {
	this.initType(type);

	return new Promise((resolve, reject) => {
		let all = Object.keys(this.store[type]);

		if (!all) {
			return resolve([]);
		}

		return resolve(all.slice(start, count).map((k) => {
			return Object.assign(this.store[type][k], { _id : k });
		}));		
	});
};

memoryStore.prototype.getResource = function(type, id) {
	this.initType(type);

	return new Promise((resolve, reject) => {
		return resolve(this.store[type][id]);
	});
};

memoryStore.prototype.createResource = function(type, id, data) {
	this.initType(type);

	return new Promise((resolve, reject) => {
		this.store[type][id] = data;
		return resolve(true);
	});
};

memoryStore.prototype.updateResource = function(type, id, data) {
	this.initType(type);

	return new Promise((resolve, reject) => {
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

module.exports = function() {	
	return new memoryStore();
};