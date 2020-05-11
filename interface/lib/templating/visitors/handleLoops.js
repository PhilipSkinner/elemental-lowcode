const handleLoops = function(dataResolver) {
	this.dataResolver = dataResolver;
	this.modified = false;
};

handleLoops.prototype.expandNext = function(view, data) {
	this.modified = false;
	view = view.map((tag) => {
		if (typeof(tag) !== "object" || tag === null) {
			return tag;
		}

		if (Array.isArray(tag)) {
			return this.expand(tag, data);
		}

		if (tag.repeat) {
			//we are going to repeat this tag, get our enumeration
			var parts = tag.repeat.split(" ");
			var arr = this.dataResolver.resolveValue(parts[2], data, tag._scope ? tag._scope.data : {});
			var dataPropName = parts[0].replace("$.", "");

			//ok, for each child decorate it with our new scoped data and then copy
			var base = JSON.stringify(tag);
			var generated = [];
			if (Array.isArray(arr)) {
				generated = arr.map((item, index) => {
					var copy = JSON.parse(base);

					//delete the repeat
					delete(copy.repeat);

					//set our scoped data
					copy._scope = copy._scope || {};
					copy._scope.data = copy._scope.data || {};
					var itemData = {};
					itemData[dataPropName] = item;
					copy._scope.data = Object.assign(copy._scope ? copy._scope.data : {}, itemData);
					copy._scope.data._index = index;

					return copy;
				});
			}

			//return our generated items
			this.modified = true;
			return generated;
		}

		//if we got this far, there was no repeating group
		Object.keys(tag).forEach((prop) => {
			if (Array.isArray(tag[prop])) {
				tag[prop] = this.expand(tag[prop], Object.assign(data, tag._scope ? tag._scope.data : {}));
				return;
			}
		});

		return tag;
	});

	return view;
};

handleLoops.prototype.expand = function(view, data) {
	this.modified = true;
	let localData = JSON.parse(JSON.stringify(data));
	while (this.modified) {
		view = this.expandNext(view, localData);
	}

	return view;
};

handleLoops.prototype.apply = function(definition) {
	definition.view = this.expand(definition.view, definition.data);

	return Promise.resolve(definition);
};

handleLoops.prototype.applySync = function(definition) {
	definition.view = this.expand(definition.view, definition.data);

	return definition;
};

module.exports = function(dataResolver) {
	if (!dataResolver) {
		dataResolver = require("../dataResolver")();
	}

	return new handleLoops(dataResolver);
};