const storageEngine = function(app, typesReader, typeInstance, sqlStore, dataResolver, environmentService) {
    this.app                = app;
    this.typesReader        = typesReader;
    this.typeInstance       = typeInstance;
    this.sqlStore           = sqlStore;
    this.dataResolver       = dataResolver;
    this.environmentService = environmentService;
};

storageEngine.prototype.initStore = function(type) {
    //resolve our values
    type.connectionString = this.dataResolver.detectValues(type.connectionString, {
        secrets : this.environmentService.listSecrets()
    }, {}, true);

    if (typeof(type.connectionString) !== "undefined" && type.connectionString !== null && type.connectionString !== "") {
        return this.sqlStore(type.connectionString, type);
    }

    return this.sqlStore(process.env.MYSQL_CONNECTION_STRING, type);
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

module.exports = function(app, typesReader, typeInstance, sqlStore, dataResolver, environmentService) {
    if (!typesReader) {
        typesReader = require("./typesReader")();
    }

    if (!typeInstance) {
        //no exec, can"t be a singleton
        typeInstance = require("./typeInstance");
    }

    if (!sqlStore) {
        sqlStore = require("../../support.lib/stores/sqlStore");
    }

    if (!dataResolver) {
        dataResolver = require("../../support.lib/dataResolver")();
    }

    if (!environmentService) {
        environmentService = require("../../support.lib/environmentService")();
    }

    return new storageEngine(app, typesReader, typeInstance, sqlStore, dataResolver, environmentService);
};