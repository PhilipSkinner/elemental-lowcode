const definitionProvider = function(fs, path) {
	this.fs = fs;
	this.path = path;
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
}

definitionProvider.prototype._readServices = function(config) {
	const services = Object.keys(config.services);	
	const doNext = () => {
		if (services.length === 0) {
			return Promise.resolve();
		}

		const next = services.pop();

		//attempt to read in the source
		return new Promise((resolve, reject) => {
			try {
				config.services[next]._code = require(this.path.join(process.cwd(), config.services[next].source));
			} catch(e) {
				return reject(e);
			}

			return resolve();
		}).then(doNext);
	}
	
	return doNext();
};

definitionProvider.prototype._readControllers = function(config) {
	const controllers = Object.keys(config.controllers);
	const doNext = () => {
		if (controllers.length === 0) {
			return Promise.resolve();
		}

		const next = controllers.pop();

		return new Promise((resolve, reject) => {
			try {
				config.controllers[next] = require(this.path.join(process.cwd(), config.controllers[next]));
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
		return this._readServices(config)
			.then(() => {
				return this._readControllers(config);
			}).then(() => {
				return Promise.resolve(config);
			});
	});
};

module.exports = function(fs, path) {
	if (!fs) {
		fs = require('fs');
	}

	if (!path) {
		path = require('path');
	}

	return new definitionProvider(fs, path);
};