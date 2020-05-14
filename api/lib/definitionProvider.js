const definitionProvider = function(fs, path, reqMethod, resolveMethod) {
	this.fs 			= fs;
	this.path 			= path;
	this.reqMethod 		= reqMethod;
	this.resolveMethod 	= resolveMethod;
};

definitionProvider.prototype._parseConfig = function(file) {
	return new Promise((resolve, reject) => {
		this.fs.readFile(file, (err, content) => {
			if (err) {
				return reject(err);
			}

			let config = null;
			try {
				config = JSON.parse(content);
			} catch(e) {}

			if (config === null) {
				return reject(new Error(`Cannot read API definition ${file}`));
			}

			return resolve(config);
		});
	});
};

definitionProvider.prototype._getClient = function(config) {
	if (!config.client_id) {
		return Promise.resolve(null);
	}

	return new Promise((resolve, reject) => {
		this.fs.readFile(this.path.join(process.env.DIR, "../identity", config.client_id + ".client.json"), (err, content) => {
			if (err) {
				return reject(err);
			}

			let client = null;
			try {
				client = JSON.parse(content);
			} catch(e) {}

			if (client === null) {
				return reject(new Error(`Cannot read client definition`));
			}

			return resolve(client);
		});
	});
};


definitionProvider.prototype._readControllers = function(config) {
	const controllers = Object.keys(config.controllers || {});
	const doNext = () => {
		if (controllers.length === 0) {
			return Promise.resolve();
		}

		const next = controllers.pop();

		return new Promise((resolve, reject) => {
			try {
				let module = this.path.join(process.cwd(), process.env.DIR, config.name, config.controllers[next]);
				delete require.cache[this.resolveMethod(module)];
				config.controllers[next] = this.reqMethod(module);
			} catch(e) {
				return reject(e);
			}

			return resolve();
		}).then(doNext);
	}

	return doNext();
};

definitionProvider.prototype.fetchDefinition = function(file) {
	return this._parseConfig(file).then((config) => {
		//read in our service files
		return this._readControllers(config).then(() => {
		}).then(() => {
			return this._getClient(config);
		}).then((client) => {
			config.client = client;
			return Promise.resolve(config);
		});
	}).catch((err) => {
		console.log("Failed to read definition!");
		throw err;
	});
};

module.exports = function(fs, path, reqMethod, resolveMethod) {
	if (!fs) {
		fs = require("fs");
	}

	if (!path) {
		path = require("path");
	}

	if (!reqMethod) {
		reqMethod = require;
	}

	if (!resolveMethod) {
		resolveMethod = require.resolve;
	}

	return new definitionProvider(fs, path, reqMethod, resolveMethod);
};