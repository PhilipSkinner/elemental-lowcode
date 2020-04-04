const insertStandardScripts = function() {
	this.standardScripts = [
		"/_static/js/axios.js",
		"/_static/js/clickEnhance.js"
	];
};

insertStandardScripts.prototype.traverse = function(object) {
	if (object.tag === 'body') {
		this.standardScripts.forEach((script) => {
			object.children.push({
				tag : "script",
				src : script
			});
		});

		return object;
	} else {
		object.children = object.children ? object.children.map((child) => {
			return this.traverse(child);
		}) : null;
	}

	return object;
};

insertStandardScripts.prototype.apply = function(definition) {
	//find our body tag and insert the standard scripts
	definition.view = definition.view.map((tag) => {
		return this.traverse(tag);
	});

	return Promise.resolve(definition);
};

module.exports = function() {
	return new insertStandardScripts();
};