const preProcessor = function(
    arrayWrapper,
    expandCustomTags,
    handleLoops,
    replaceValues,
    defineScope,
    bindValues,
    conditionals,
    insertStandardScripts,
    handleControllerScope
) {
    this.visitors = {
        arrayWrapper 			: arrayWrapper,
        expandCustomTags 		: expandCustomTags,
        handleLoops 			: handleLoops,
        replaceValues 			: replaceValues,
        defineScope				: defineScope,
        bindValues 				: bindValues,
        conditionals 			: conditionals,
        insertStandardScripts 	: insertStandardScripts,
        handleControllerScope 	: handleControllerScope
    };
};

preProcessor.prototype.process = function(definition, data, customTags) {
    var obj = {
        view : definition,
        data : data
    };

    if (customTags) {
        this.visitors.expandCustomTags.setTags(customTags);
    }

    return this.visitors.arrayWrapper
        .apply(obj)
        .then(this.visitors.defineScope.apply.bind(this.visitors.defineScope))
        .then(this.visitors.expandCustomTags.apply.bind(this.visitors.expandCustomTags))
        .then(this.visitors.handleControllerScope.apply.bind(this.visitors.handleControllerScope))
        .then(this.visitors.handleLoops.apply.bind(this.visitors.handleLoops))
        .then(this.visitors.bindValues.apply.bind(this.visitors.bindValues))
        .then(this.visitors.replaceValues.apply.bind(this.visitors.replaceValues))
        .then(this.visitors.expandCustomTags.apply.bind(this.visitors.expandCustomTags))
        .then(this.visitors.handleLoops.apply.bind(this.visitors.handleLoops))
        .then(this.visitors.replaceValues.apply.bind(this.visitors.replaceValues))
        .then(this.visitors.conditionals.apply.bind(this.visitors.conditionals))
        .then(this.visitors.insertStandardScripts.apply.bind(this.visitors.insertStandardScripts))
        .then((obj) => {
            return Promise.resolve(obj);
        });
};

module.exports = function(
    arrayWrapper,
    expandCustomTags,
    handleLoops,
    replaceValues,
    defineScope,
    bindValues,
    conditionals,
    insertStandardScripts,
    handleControllerScope
) {
    if (!arrayWrapper) {
        arrayWrapper = require("./visitors/arrayWrapper")();
    }

    if (!expandCustomTags) {
        expandCustomTags = require("./visitors/expandCustomTags")();
    }

    if (!handleLoops) {
        handleLoops = require("./visitors/handleLoops")();
    }

    if (!replaceValues) {
        replaceValues = require("./visitors/replaceValues")();
    }

    if (!defineScope) {
        defineScope = require("./visitors/defineScope")();
    }

    if (!bindValues) {
        bindValues = require("./visitors/bindValues")();
    }

    if (!conditionals) {
        conditionals = require("./visitors/conditionals")();
    }

    if (!insertStandardScripts) {
        insertStandardScripts = require("./visitors/insertStandardScripts")();
    }

    if (!handleControllerScope) {
        handleControllerScope = require("./visitors/handleControllerScope")();
    }

    return new preProcessor(arrayWrapper, expandCustomTags, handleLoops, replaceValues, defineScope, bindValues, conditionals, insertStandardScripts, handleControllerScope);
};