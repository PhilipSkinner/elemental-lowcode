const expandCustomTag = function(replaceValues) {
	this.replaceValues = replaceValues;

	this.tags = {};
};

expandCustomTag.prototype.setTags = function(tags) {
	this.tags = tags;
};

expandCustomTag.prototype.setPreProcessor = function(preProcessor) {
	this.preProcessor = preProcessor;
};

expandCustomTag.prototype.needsExpansion = function(view) {
	var needs = false;
	for (var i = 0; i < view.length; i++) {
		var tag = view[i];

		if (Array.isArray(tag)) {
			needs = this.needsExpansion(view);
			break;
		}

		if (typeof(tag) === 'object' && tag !== null) {
			if (tag.tag && this.tags[tag.tag]) {
				needs = true;
				break;
			}
		}
	}

	return needs;
};

expandCustomTag.prototype.expand = function(view) {
	return view.map((tag) => {
		if (typeof(tag) !== 'object' || tag === null) {
			return tag;
		}

		if (Array.isArray(tag)) {
			return this.expand(view);
		}

		if (tag.tag && this.tags[tag.tag]) {
			//generate our replacement
			var replacement = JSON.parse(JSON.stringify(this.tags[tag.tag].definition));

			//set our data scope on the replacement
			//replacement._scope = replacement._scope || {};
			//replacement._scope.data = replacement._scope.data || {};
			//replacement._scope.data = Object.assign(replacement._scope.data, tag);

			tag = this.replaceValues.applySync({
				view : [replacement],
				data : tag
			}).view[0];
		}

		//check the properties;
		Object.keys(tag).forEach((prop) => {
			if (Array.isArray(tag[prop])) {
				tag[prop] = this.expand(tag[prop]);
			}
		});

		return tag;
	});
};

expandCustomTag.prototype.apply = function(definition) {
	while (this.needsExpansion(definition.view)) {
		definition.view = this.expand(definition.view);
	}

	return Promise.resolve(definition);
};

module.exports = function(replaceValues) {
	if (!replaceValues) {
		replaceValues = require('./replaceValues')();
	}

	return new expandCustomTag(replaceValues);
};