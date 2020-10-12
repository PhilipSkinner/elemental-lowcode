const tagControllers = function(path) {
	this.path = path;
	this.controllers = {};
};

tagControllers.prototype.registerController = function(name, controller, raw) {
	this.controllers[name] = {
		controller 	: controller,
		name 		: name,
		raw 		: raw
	};
};

tagControllers.prototype.provideInstance = function(name) {
	if (this.controllers[name].raw) {
		return eval(this.controllers[name].controller);
	} else {
		let module = this.path.join(process.cwd(), process.env.DIR, this.controllers[name].controller);
		delete require.cache[require.resolve(module)];
		return require(module);
	}
};

tagControllers.prototype.determineInstances = function(view) {
	let ourView = view;

	if (!Array.isArray(ourView)) {
		ourView = [view];
	}

	let instances = [];
	let instanceCounters = {};

	ourView.map((entry) => {
		if (!(typeof(entry) !== 'object' || entry === null)) {
			if (typeof(this.controllers[entry.tag]) !== 'undefined') {
				instanceCounters[entry.tag] = instanceCounters[entry.tag] || 0;
				instanceCounters[entry.tag]++;

				let instance = {
					identifier : `controller_${entry.tag}_${instanceCounters[entry.tag]}`,
					instance : this.provideInstance(entry.tag)
				};

				entry._controller = instance;
				instances.push(instance);
			}

			Object.keys(entry).forEach((k) => {
				instances = instances.concat(this.determineInstances(entry[k]));
			});
		}
	});

	return instances;
};

module.exports = function(path) {
	if (!path) {
		path = require('path');
	}

	return new tagControllers(path);
};