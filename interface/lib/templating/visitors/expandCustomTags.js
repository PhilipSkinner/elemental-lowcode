const expandCustomTag = function(
	replaceValues,
	handleLoops,
	handleControllerEventScope
) {
	this.replaceValues 				= replaceValues;
	this.handleLoops 				= handleLoops;
	this.handleControllerEventScope = handleControllerEventScope;

	this.tags = {};
};

expandCustomTag.prototype.setTags = function(tags) {
	this.tags = tags;
};

expandCustomTag.prototype.needsExpansion = function(view) {
	let needs = false;
	for (var i = 0; i < view.length; i++) {
		var tag = view[i];

		if (Array.isArray(tag)) {
			if (tag.length > 0 && this.needsExpansion(tag)) {
				needs = true;
			}
		}

		if (typeof(tag) === "object" && tag !== null) {
			//loop props
			Object.keys(tag).forEach((prop) => {
				if (Array.isArray(tag[prop])) {
					if(this.needsExpansion(tag[prop])) {
						needs = true;
					}
				}
			});

			if (tag.tag && this.tags[tag.tag]) {
				needs = true;
			}
		}
	}

	return false || needs;
};

expandCustomTag.prototype.expand = function(view) {
	return view.map((tag) => {
		if (typeof(tag) !== "object" || tag === null) {
			return tag;
		}

		if (Array.isArray(tag)) {
			if (tag.length === 0) {
				return tag;
			}

			return this.expand(tag);
		}

		if (tag.tag && this.tags[tag.tag]) {
			//generate our replacement
			var replacement = JSON.parse(JSON.stringify(this.tags[tag.tag].definition));

			//carry over our if and repeat properties
			if (tag.repeat) {
				replacement.repeat = tag.repeat;
			}
			if (tag.if) {
				replacement.if = tag.if;
			}

			//ensure any values are replaced within the source tag
			this.replaceValues.applySync({
				view : [tag],
				data : tag._scope && tag._scope.data ? tag._scope.data : {}
			});

			let newTag = this.replaceValues.applySync({
				view : [replacement],
				data : tag
			}).view[0];

			newTag = this.handleLoops.applySync({
				view : [newTag],
				data : tag
			}).view[0];

			//copy over the controller
			newTag._controller = tag._controller;

			//now we need to scan for events and insert the controller instance ID
			newTag = this.handleControllerEventScope.applySync({
				view : [newTag],
				data : tag
			}).view[0];

			tag = newTag;
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
	let count = 0;
	while (this.needsExpansion(definition.view)) {
		count++;
		definition.view = this.expand(definition.view);
	}

	return Promise.resolve(definition);
};

module.exports = function(
	replaceValues,
	handleLoops,
	handleControllerEventScope
) {
	if (!replaceValues) {
		replaceValues = require("./replaceValues")();
	}

	if (!handleLoops) {
		handleLoops = require("./handleLoops")();
	}

	if (!handleControllerEventScope) {
		handleControllerEventScope = require("./handleControllerEventScope")();
	}

	return new expandCustomTag(replaceValues, handleLoops, handleControllerEventScope);
};