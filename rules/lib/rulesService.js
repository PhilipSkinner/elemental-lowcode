const rulesService = function(app, fs, path, glob, configReader, rulesInstance) {
	this.app = app;
	this.fs = fs;
	this.path = path;
	this.glob = glob;
	this.configReader = configReader;
	this.rulesInstance = rulesInstance;
};

rulesService.prototype.findDefinitions = function(dir) {
	return new Promise((resolve, reject) => {
		this.glob(this.path.join(dir, '**/*.json'), (err, definitions) => {
			if (err) {
				return reject(err);
			}

			return resolve(definitions);
		});
	});
};

rulesService.prototype.init = function(dir) {
	return this.findDefinitions(dir).then((definitions) => {
		const doNext = () => {
			if (definitions.length === 0) {
				return Promise.resolve();
			}

			const next = definitions.pop();

			return this.configReader.readDefinition(next).then((definition) => {
				let instance = this.rulesInstance(this.app, definition);
				return instance.init();
			}).then(doNext);
		};

		return doNext();
	});
};

module.exports = function(app, fs, path, glob, configReader, rulesInstance) {
	if (!fs) {
		fs = require('fs');
	}

	if (!path) {
		path = require('path');
	}

	if (!glob) {
		glob = require('glob');
	}

	if (!configReader) {
		configReader = require('./configReader')();
	}

	if (!rulesInstance) {
		rulesInstance = require('./rulesInstance');
	}

	return new rulesService(app, fs, path, glob, configReader, rulesInstance);
}