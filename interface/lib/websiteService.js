const websiteService = function(app, configReader, websiteInstance, glob, path) {
	this.app = app;
	this.configReader = configReader;
	this.websiteInstance = websiteInstance;
	this.glob = glob;
	this.path = path;
};

websiteService.prototype.findDefinitions = function(dir) {
	return new Promise((resolve, reject) => {
		this.glob(this.path.join(dir, "**/*.website.json"), (err, definitions) => {
			if (err) {
				return reject(err);
			}

			return resolve(definitions);
		});
	});
}

websiteService.prototype.init = function(dir) {
	return this.findDefinitions(dir).then((definitions) => {
		const doNext = () => {
			if (definitions.length === 0) {
				return Promise.resolve();
			}

			const next = definitions.pop();

			return this.configReader.readDefinition(next).then((definition) => {
				let instance = this.websiteInstance(this.app, definition, this.passport);
				return instance.init();
			}).then(doNext);
		};

		return doNext();
	});
};

module.exports = function(app, configReader, websiteInstance, glob, path) {
	if (!configReader) {
		configReader = require("./configReader")();
	}

	if (!websiteInstance) {
		//can"t be a singleton
		websiteInstance = require("./websiteInstance");
	}

	if (!glob) {
		glob = require("glob");
	}

	if (!path) {
		path = require("path");
	}

	return new websiteService(app, configReader, websiteInstance, glob, path);
};