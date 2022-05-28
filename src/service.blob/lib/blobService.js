const blobService = function(app, configProvider, blobInstance) {
    this.app                = app;
    this.configProvider     = configProvider;
    this.blobInstance       = blobInstance;
};

blobService.prototype.init = function(dir) {
    return this.configProvider.getBlobStores(dir).then((stores) => {
        stores.forEach((store) => {
            this.configProvider.loadStore(store).then((config) => {
                const instance = this.blobInstance(config);

                //initialise it
                instance.init().then(() => {
                    const postPath = "/*";
                    this.app.use(`/${config.name}`, instance.handleRequest.bind(instance));
                    this.app.use(`/${config.name}${postPath}`, instance.handleRequest.bind(instance));
                });
            });
        });
    });
};

module.exports = function(app, configProvider, blobInstance) {
    if (!configProvider) {
        configProvider = require('./configProvider')();
    }

    if (!blobInstance) {
        blobInstance = require('./blobInstance');
    }

    return new blobService(app, configProvider, blobInstance);
};