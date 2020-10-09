const handleControllerScope = function() {

};

handleControllerScope.prototype.expand = function(view, data) {
	let ourView = view;

	if (!Array.isArray(ourView)) {
		ourView = [view];
	}

	ourView.forEach((tag) => {
		if (!(typeof(tag) !== 'object' && tag !== null)) {
			//do we have some events?
			if (tag._controller) {
				tag._controller.instance = tag._controller.instance || {};
				tag._controller.instance.bag = tag._controller.instance.bag || {};
				data.instance = data.instance || {};
				data.instance.bag = data.instance.bag || {};

				data = {
					instance : {
						bag : Object.assign(tag._controller.instance.bag, data.instance.bag)
					}
				};
			}

			if (data !== null && typeof(tag._scope) !== 'undefined' && tag._scope !== null) {
				tag._scope.data = tag._scope.data || {};
				tag._scope.data.bag = tag._scope.data.bag || {};
				Object.assign(tag._scope.data.bag, data.instance.bag || {});
			}

			Object.keys(tag).forEach((k) => {
				this.expand(tag[k], data);
			});
		}
	});

	return ourView;
};

handleControllerScope.prototype.apply = function(definition) {
	definition.view = this.expand(definition.view, {
		instance : definition.data
	});

	return Promise.resolve(definition);
};

handleControllerScope.prototype.applySync = function(definition) {
	definition.view = this.expand(definition.view, definition.data);

	return definition;
};

module.exports = function() {
	return new handleControllerScope();
};