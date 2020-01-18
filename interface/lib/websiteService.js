const websiteService = function(app, configReader, websiteInstance) {
	this.app = app;
	this.configReader = configReader;
	this.websiteInstance = websiteInstance;
};

websiteService.prototype.init = function(websiteDefinition) {
	return this.configReader.readDefinition(websiteDefinition).then((definition) => {
		let instance = this.websiteInstance(this.app, definition);
		return instance.init();
	});
};

module.exports = function(app, configReader, websiteInstance) {
	if (!configReader) {
		configReader = require('./configReader')();
	}

	if (!websiteInstance) {
		//can't be a singleton
		websiteInstance = require('./websiteInstance');
	}

	return new websiteService(app, configReader, websiteInstance);
};