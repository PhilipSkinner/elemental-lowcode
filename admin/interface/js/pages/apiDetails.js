const _apiDetailsController = function(page) {
	this._page = page;
	this.api = {};
	this.routes = [];
	this.controllers = [];
	this.services = [];
};

_apiDetailsController.prototype.getData = function() {
	return {
		api 					: this.api,
		routes 					: this.routes,
		controllers 			: this.controllers,
		services 				: this.services,
	};
};

_apiDetailsController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_apiDetailsController.prototype.refreshState = function() {
	if (this.api.routes) {
		this.routes = Object.keys(this.api.routes).map((name) => {
			return Object.assign(this.api.routes[name], {
				name : name
			});
		});
	} else {
		this.routes = [];
	}

	if (this.api.services) {
		this.services = Object.keys(this.api.services).map((name) => {
			return Object.assign(this.api.services[name], {
				name : name
			});
		});
	} else {
		this.services = [];
	}

	if (this.api.controllers) {
		this.controllers = Object.keys(this.api.controllers).map((name) => {
			return {
				name 		: name,
				controller 	: this.api.controllers[name]
			};
		});
	} else {
		this.controllers = [];
	}

	this.caller.api 					= this.api;
	this.caller.routes 					= this.routes;
	this.caller.controllers 			= this.controllers;
	this.caller.services 				= this.services;
	this.caller.$forceUpdate();
};

_apiDetailsController.prototype.fetchApi = function(name) {
	return window.axios
		.get(`http://localhost:8001/apis/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.api = response.data;
			this.refreshState();
		});
};

window.apiDetails = {
	template : "#template-api-details",
	data 	 : () => {
		return window._apiDetailsControllerInstance.getData();
	},
	mounted  : function() {
		window._apiDetailsControllerInstance.setCaller(this);
		return window._apiDetailsControllerInstance.fetchApi(this.$route.params.name);
	}
};

window._apiDetailsControllerInstance = new _apiDetailsController(window.apiDetails);