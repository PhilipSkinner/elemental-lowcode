const handleControllerEventScope = function() {
	this.eventTypes = [
		"onclick",
		"submit"
	];
};

handleControllerEventScope.prototype.expand = function(view, data) {
	let ourView = view;

	if (!Array.isArray(ourView)) {
		ourView = [view];
	}

	ourView.forEach((tag) => {
		if (!(typeof(tag) !== 'object' && tag !== null)) {
			//do we have some events?
			this.eventTypes.forEach((event) => {
				if (typeof(tag[event]) !== 'undefined' && tag[event] !== null) {
					tag[event].params = tag[event].params || {};
					tag[event].params._identifier = data._controller.identifier;
				}
			});

			Object.keys(tag).forEach((k) => {
				this.expand(tag[k], data);
			});
		}
	});

	return ourView;
};

handleControllerEventScope.prototype.apply = function(definition) {
	definition.view = this.expand(definition.view, definition.data);

	return Promise.resolve(definition);
};

handleControllerEventScope.prototype.applySync = function(definition) {
	definition.view = this.expand(definition.view, definition.data);

	return definition;
};

module.exports = function() {
	return new handleControllerEventScope();
};