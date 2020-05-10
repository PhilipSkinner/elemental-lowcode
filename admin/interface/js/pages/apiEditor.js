const _apiEditorController = function(page) {
	this._page = page;
	this.api = {};
	this.clients = [];
	this.showAlert = false;
	this.serviceEditorVisible = false;
	this.controllerEditorVisible = false;
	this.mainVisible = true;
	this.resources = {};
	this.routes = [];
	this.controllers = [];
	this.services = [];
	this.securityPopupOpen = false;
	this.selectedRoute = {};
	this.securityDetails = {};
};

_apiEditorController.prototype.closeSecurityPopup = function() {
	this.securityPopupOpen = false;
	this.securityDetails = {};
	this.selectedRoute = null;

	this.refreshState();
};

_apiEditorController.prototype.configureRouteSecurity = function(name, method) {
	this.selectedRoute = this.routes.find((r) => {
		return r.name == name;
	});
	this.securityDetails = {
		name 	: name,
		method 	: method
	};
	this.selectedRoute = JSON.parse(JSON.stringify(this.selectedRoute[method.toLowerCase()]));
	this.selectedRoute.roles = this.selectedRoute.roles.join(', ');
	this.securityPopupOpen = true;
	this.refreshState();
};

_apiEditorController.prototype.setSecurity = function() {
	const route = this.routes.find((r) => {
		return r.name == this.securityDetails.name;
	});

	route[this.securityDetails.method.toLowerCase()] = JSON.parse(JSON.stringify(this.selectedRoute));
	let roles = this.selectedRoute.roles.split(',').map((val) => {
		return val.trim();
	}).reduce((sum, a) => {
		if (a !== "") {
			sum.push(a);
		}
		return sum;
	}, []);
	route[this.securityDetails.method.toLowerCase()].roles = roles;

	this.closeSecurityPopup();
};


_apiEditorController.prototype.initEditor = function(elem, type, value) {
	//set our editor up
	this.editor = window.ace.edit(document.getElementById(elem), {
		mode : "ace/mode/" + type,
		selectionStyle : "text"
	});
	this.editor.commands.addCommand({
		name : "save",
		bindKey : {
			win: "Ctrl-S",
			mac: "Cmd-S"
		},
		exec : () => {
			this.saveAll();
		}
	});
	this.editor.setTheme("ace/theme/twilight");
	this.editor.setValue(value);
};

_apiEditorController.prototype.editController = function(name) {
	this.controllerEditorVisible = true;
	this.mainVisible = false;
	this.refreshState();

	//get the resource name
	let resourceName = this.api.controllers[name];

	this.openResource = resourceName;

	//is it already loaded?
	if (this.resources[resourceName]) {
		return setTimeout(() => {
			this.initEditor("controllerEditor", "javascript", this.resources[resourceName]);
		}, 10);
	}

	return window.axios.get(
		`${window.hosts.kernel}/apis/${this.api.name}/${resourceName}`,
		{
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		}
	).then((resource) => {
		this.resources[resourceName] = resource.data;
		return this.initEditor("controllerEditor", "javascript", this.resources[resourceName]);
	});
};

_apiEditorController.prototype.editService = function(name) {
	this.serviceEditorVisible = true;
	this.mainVisible = false;
	this.refreshState();

	//get the resource name
	let resourceName = this.api.services[name].source;

	this.openResource = resourceName;

	//is it already loaded?
	if (this.resources[resourceName]) {
		return setTimeout(() => {
			this.initEditor("serviceEditor", "javascript", this.resources[resourceName]);
		}, 10);
	}

	return window.axios.get(
		`${window.hosts.kernel}/apis/${this.api.name}/${resourceName}`,
		{
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		}
	).then((resource) => {
		this.resources[resourceName] = resource.data;
		return this.initEditor("serviceEditor", "javascript", this.resources[resourceName]);
	});
};

_apiEditorController.prototype.getData = function() {
	return {
		api 					: this.api,
		clients 				: this.clients,
		showAlert 				: this.showAlert,
		serviceEditorVisible 	: this.serviceEditorVisible,
		controllerEditorVisible : this.controllerEditorVisible,
		mainVisible 			: this.mainVisible,
		routes 					: this.routes,
		controllers 			: this.controllers,
		services 				: this.services,
		securityPopupOpen		: this.securityPopupOpen,
		selectedRoute 			: this.selectedRoute
	};
};

_apiEditorController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_apiEditorController.prototype.refreshState = function() {
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
	this.caller.clients 				= this.clients;
	this.caller.showAlert 				= this.showAlert;
	this.caller.serviceEditorVisible 	= this.serviceEditorVisible;
	this.caller.controllerEditorVisible = this.controllerEditorVisible;
	this.caller.mainVisible 			= this.mainVisible;
	this.caller.routes 					= this.routes;
	this.caller.controllers 			= this.controllers;
	this.caller.services 				= this.services;
	this.caller.securityPopupOpen 		= this.securityPopupOpen;
	this.caller.selectedRoute 			= this.selectedRoute;
	this.caller.$forceUpdate();
};

_apiEditorController.prototype.fetchApi = function(name) {
	return window.axios
		.get(`${window.hosts.kernel}/apis/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.api = response.data;
			this.refreshState();
		});
};

_apiEditorController.prototype.fetchClients = function() {
	return window.axios
		.get(`${window.hosts.kernel}/security/clients`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.clients = response.data;
			this.refreshState();
		});
};

_apiEditorController.prototype.mainView = function() {
	this.resources[this.openResource] = this.editor.getValue();

	this.mainVisible = true;
	this.serviceEditorVisible = false;
	this.controllerEditorVisible = false;
	this.refreshState();
};

_apiEditorController.prototype.newController = function() {
	this.api.controllers = this.api.controllers || {};
	var name = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);

	this.api.controllers[name] = `controllers/${name}.js`;

	this.resources[`controllers/${name}.js`] = [
"module.exports = function() {",
"	return (req, res, next) => {",
"		res.json({ hello : \"world\" });",
"		next();",
"	};",
"};",
	].join("\n");

	this.refreshState();
};

_apiEditorController.prototype.newRoute = function() {
	this.api.routes = this.api.routes || {};
	var name = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);

	this.api.routes[`/${name}`] = {
		"get" : {
			"controller" : null,
			"needsRole" : true,
			"replace" : false,
			"roles" : []
		},
		"post" : {
			"controller" : null,
			"needsRole" : true,
			"replace" : false,
			"roles" : []
		}
	};

	this.refreshState();
};

_apiEditorController.prototype.newService = function() {
	this.api.services = this.api.services || {};
	var name = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);

	this.api.services[name] = {
		type : "singleton",
		source : `services/${name}.js`
	};

	this.resources[`services/${name}.js`] = [
"module.exports = function() {",
"	const service = function() {",
"",
"	};",
"",
"	service.prototype.getGreeting = function() {",
"		return \"Hello world!\";",
"	};",
"",
"	return new service();",
"};",
	].join("\n");

	this.refreshState();
};

_apiEditorController.prototype._saveAPI = function() {
	this.api.routes = {};
	this.routes.forEach((route) => {
		this.api.routes[route.name] = route;
	});

	this.api.controllers = {};
	this.controllers.forEach((controller) => {
		this.api.controllers[controller.name] = controller.controller;
	});

	this.api.services = {};
	this.services.forEach((service) => {
		this.api.services[service.name] = service;
	});

	return window.axios.put(
		`${window.hosts.kernel}/apis/${this.api.name}`,
		this.api,
		{
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		}
	).then(() => {
		location.href = "/#/apis/editor/" + this.api.name;
		this.showAlert = true;
		this.refreshState();

		setTimeout(() => {
			this.showAlert = false;
			this.refreshState();
		}, 2500);
	});
};

_apiEditorController.prototype._saveService = function(name, resource) {
	return new Promise((resolve, reject) => {
		return window.axios.put(
			`${window.hosts.kernel}/apis/${this.api.name}/services/${name}`, {
				content : resource
			},
			{
				headers : {
					Authorization : `Bearer ${window.getToken()}`
				}
			}
		).then(() => {
			return resolve();
		});
	});
};

_apiEditorController.prototype._saveController = function(name, resource) {
	return new Promise((resolve, reject) => {
		return window.axios.put(
			`${window.hosts.kernel}/apis/${this.api.name}/controllers/${name}`, {
				content : resource
			},
			{
				headers : {
					Authorization : `Bearer ${window.getToken()}`
				}
			}
		).then(() => {
			return resolve();
		});
	});
};

_apiEditorController.prototype.saveAll = function() {
	if (this.openResource && this.editor) {
		this.resources[this.openResource] = this.editor.getValue();
	}

	return Promise.all(Object.keys(this.resources).map((name) => {
		if (name.indexOf('services/') === 0) {
			return this._saveService(name.substring(9), this.resources[name]);
		}

		if (name.indexOf('controllers/') === 0) {
			return this._saveController(name.substring(12), this.resources[name]);
		}

		return Promise.resolve();
	})).then(() => {
		return this._saveAPI();
	});
};

_apiEditorController.prototype.removeService = function(name) {
	delete(this.api.services[name]);
	this.refreshState();
};

_apiEditorController.prototype.removeController = function(name) {
	delete(this.api.controllers[name]);
	this.refreshState();
};

_apiEditorController.prototype.removeRoute = function(name) {
	delete(this.api.routes[name]);
	this.refreshState();
};

window.apiEditor = {
	template : "#template-api-editor",
	data 	 : () => {
		return window._apiEditorControllerInstance.getData();
	},
	mounted  : function() {
		window._apiEditorControllerInstance.setCaller(this);
		if (this.$route.params.name === ".new") {
			window._apiEditorControllerInstance.api = {};
			return window._apiEditorControllerInstance.fetchClients();
		}
		return Promise.all([
			window._apiEditorControllerInstance.fetchApi(this.$route.params.name),
			window._apiEditorControllerInstance.fetchClients()
		]);
	}
};

window._apiEditorControllerInstance = new _apiEditorController(window.apiEditor);