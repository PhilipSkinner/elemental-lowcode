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
};

websiteService.prototype.findTagsets = function(dir) {
	return new Promise((resolve, reject) => {
		this.glob(this.path.join(dir, "tagsets/**/*.json"), (err, tagsets) => {
			if (err) {
				return reject(err);
			}

			return resolve(tagsets);
		});
	});
};

websiteService.prototype.init = function(dir) {
	let mainConfig = {};
	let tagsets = [];
	return this.configReader.readMainConfig().then((_mainConfig) => {
		mainConfig = _mainConfig;

		return this.findTagsets(dir);
	}).then((_tagsets) => {
		if (_tagsets.length === 0) {
			return this.findDefinitions(dir);
		}

		const doNext = () => {
			if (_tagsets.length === 0) {
				return Promise.resolve();
			}

			const next = _tagsets.pop();

			return this.configReader.readDefinition(next).then((tagset) => {
				tagset.forEach((group) => {
					group.tags.forEach((tag) => {
						tagsets.push(tag);
					});
				});
			}).then(doNext);
		};

		return doNext().then(() => {
			return this.findDefinitions(dir);
		});
	}).then((definitions) => {
		const doNext = () => {
			if (definitions.length === 0) {
				return Promise.resolve();
			}

			const next = definitions.pop();
			return this.configReader.readDefinition(next).then((definition) => {
				definition.__main 	= mainConfig;
				definition.tagsets 	= tagsets;

				if (typeof(definition.client_id) === "undefined" || definition.client_id === null || definition.client_id === "") {
					return Promise.resolve(definition);
				}

				// read the client config
				return this.configReader.readDefinition(this.path.join(dir, "../identity", definition.client_id + ".client.json")).then((client) => {
					definition.client = client;
					return Promise.resolve(definition);
				}).catch((err) => {
					console.error("Could not load client configuration", err);
					return Promise.resolve(definition);
				});
			}).then((definition) => {
				let instance = this.websiteInstance(this.app, definition);
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