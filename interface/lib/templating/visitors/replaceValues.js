const replaceValues = function(dataResolver) {
	this.dataResolver = dataResolver;

	this.ignoredProps = [
		'repeat',
		'_scope'
	];
};

replaceValues.prototype.replace = function(view, data) {
	return view.map((tag) => {
		if (typeof(tag) !== 'object' || tag === null) {
			return tag;
		}

		if (Array.isArray(tag)) {
			return this.replace(tag, data);
		}

		Object.keys(tag).forEach((prop) => {
			if (this.ignoredProps.indexOf(prop) !== -1) {
				return;
			}

			let scopedData = Object.assign(tag._scope && tag._scope.data ? tag._scope.data : {}, data);
			if (Array.isArray(tag[prop])) {
				tag[prop] = this.replace(tag[prop], scopedData);
				return;
			}

			if (typeof(tag[prop]) === 'object' && tag[prop] !== null) {
				tag[prop] = this.replace([tag[prop]], scopedData)[0];
				return;
			}

			tag[prop] = this.dataResolver.detectValues(tag[prop], scopedData, {});

			//has the value now changed into something we need to attempt to resolve?
			if (typeof(tag[prop]) === 'object' && tag[prop] !== null) {
				tag[prop] = this.replace([tag[prop]], scopedData)[0];
				return;
			}

			if (Array.isArray(tag[prop])) {
				tag[prop] = this.replace(tag[prop], scopedData);
			}
		});

		return tag;
	});
};

replaceValues.prototype.apply = function(definition) {
	definition.view = this.replace(definition.view, definition.data);

	return Promise.resolve(definition);
};

replaceValues.prototype.applySync = function(definition) {
	definition.view = this.replace(definition.view, definition.data);

	return definition;
};

module.exports = function(dataResolver) {
	if (!dataResolver) {
		dataResolver = require('../dataResolver')();
	}

	return new replaceValues(dataResolver);
};