const preProcessor = function(arrayWrapper, expandCustomTags, handleLoops, replaceValues, defineScope, bindValues, conditionals) {
	this.visitors = {
		arrayWrapper 		: arrayWrapper,
		expandCustomTags 	: expandCustomTags,
		handleLoops 		: handleLoops,
		replaceValues 		: replaceValues,
		defineScope			: defineScope,
		bindValues 			: bindValues,
		conditionals 		: conditionals,
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
		.then(this.visitors.bindValues.apply.bind(this.visitors.bindValues))
		.then(this.visitors.replaceValues.apply.bind(this.visitors.replaceValues))
		.then(this.visitors.conditionals.apply.bind(this.visitors.conditionals))
		.then((obj) => {
			return Promise.resolve(obj);
		});
};

module.exports = function(arrayWrapper, expandCustomTags, handleLoops, replaceValues, defineScope, bindValues, conditionals) {
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

	if (!bindValues) {
		bindValues = require('./visitors/bindValues')();
	}

	if (!conditionals) {
		conditionals = require('./visitors/conditionals')();
	}

	return new preProcessor(arrayWrapper, expandCustomTags, handleLoops, replaceValues, defineScope, bindValues, conditionals);
};