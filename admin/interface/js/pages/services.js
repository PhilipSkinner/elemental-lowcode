const _servicesController = function(page) {
	this._page = page;
	this.services = [];
};

_servicesController.prototype.getData = function() {
	return {
		services : this.services
	};
};

_servicesController.prototype.fetchServices = function(caller) {
	this.caller = caller ? caller : this.caller;
	return window.axios
		.get(`${window.hosts.kernel}/services`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.services = response.data;
			this.caller.services = response.data;
			this.caller.$forceUpdate();
		});
};

_servicesController.prototype.deleteService = function(name) {
	return window.axios
		.delete(`${window.hosts.kernel}/services/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchServices();
		});
};

window.Services = {
	template : "#template-services",
	data 	 : () => {
		return window._servicesControllerInstance.getData();
	},
	mounted  : function() {
		return window._servicesControllerInstance.fetchServices(this);
	}
};

window._servicesControllerInstance = new _servicesController(window.services);