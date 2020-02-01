const preProcessor = function(arrayWrapper, expandCustomTags, handleLoops, replaceValues, defineScope) {
	this.visitors = {
		arrayWrapper 		: arrayWrapper,
		expandCustomTags 	: expandCustomTags,
		handleLoops 		: handleLoops,
		replaceValues 		: replaceValues,
		defineScope			: defineScope,
	}
};

preProcessor.prototype.process = function(definition, data, customTags) {
	var obj = {
		view : definition,
		data : data
	};

	if (customTags) {
		this.visitors.expandCustomTags.setTags(customTags);
	}
	this.visitors.expandCustomTags.setPreProcessor(this);


	return this.visitors.arrayWrapper
		.apply(obj)
		.then(this.visitors.expandCustomTags.apply.bind(this.visitors.expandCustomTags))
		.then(this.visitors.defineScope.apply.bind(this.visitors.defineScope))
		.then(this.visitors.handleLoops.apply.bind(this.visitors.handleLoops))
		.then(this.visitors.replaceValues.apply.bind(this.visitors.replaceValues))
		.then((obj) => {
			return Promise.resolve(obj);
		});
};

module.exports = function(arrayWrapper, expandCustomTags, handleLoops, replaceValues, defineScope) {
	if (!arrayWrapper) {
		arrayWrapper = require('./visitors/arrayWrapper')();
	}

	if (!expandCustomTags) {
		expandCustomTags = require('./visitors/expandCustomTags')();
	}

	if (!handleLoops) {
		handleLoops = require('./visitors/handleLoops')();
	}

	if (!replaceValues) {
		replaceValues = require('./visitors/replaceValues')();
	}

	if (!defineScope) {
		defineScope = require('./visitors/defineScope')();
	}

	return new preProcessor(arrayWrapper, expandCustomTags, handleLoops, replaceValues, defineScope);
};