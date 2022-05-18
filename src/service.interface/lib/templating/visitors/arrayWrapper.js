const arrayWrapper = function() {

};

arrayWrapper.prototype.apply = function(definition) {
    if (!Array.isArray(definition.view)) {
        definition.view = [definition.view];
    }

    return Promise.resolve(definition);
};

module.exports = function() {
    return new arrayWrapper();
};