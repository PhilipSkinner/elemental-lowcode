const _websitesEditorController = function(page) {
	this._page = page;
	this.website = {};
	this.clients = [];
	this.routes = [];
	this.tags = [];
	this.mainVisible = true;
	this.viewEditorVisible = false;
	this.controllerEditorVisible = false;
	this.newResourceVisible = false;
	this.resources = {};
	this.staticfiles = [];

	this.editor = null;
};

_websitesEditorController.prototype.wipeData = function() {
	this.website = {};
	this.routes = [];
	this.tags = [];
	this.resources = {};
	this.staticfiles = [];
};

_websitesEditorController.prototype.getData = function() {
	return {
		website 				: this.website,
		routes 					: this.routes,
		clients 				: this.clients,
		tags 					: this.tags,
		mainVisible 			: this.mainVisible,
		viewEditorVisible 		: this.viewEditorVisible,
		controllerEditorVisible : this.controllerEditorVisible,
		newResourceVisible 		: this.newResourceVisible,
		showAlert 				: false,
		staticfiles 			: this.staticfiles,
	};
};

_websitesEditorController.prototype.initEditor = function(elem, type, value) {
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

_websitesEditorController.prototype.saveResource = function(path, value) {
	return new Promise((resolve, reject) => {
		return window.axios
			.post(`http://localhost:8001/websites/${this.website.name}/resource?path=${path}`, {
				resource : value
			}, {
				headers : {
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				return resolve();
			});
	});
};

_websitesEditorController.prototype.saveWebsite = function() {
	return new Promise((resolve, reject) => {

		//update our website object
		this.website.routes = this.routes.reduce((s, a) => {
			s[a.route] = {
				controller 	: a.controller,
				view 		: a.view,
				secure 		: a.secure,
				roles 		: a.roles,
			};
			return s;
		}, {});
		this.website.tags = this.tags;

		return window.axios
			.put(`http://localhost:8001/websites/${this.website.name}`, this.website, {
				headers : {
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				return resolve();
			});
	});
};

_websitesEditorController.prototype.saveAll = function() {
	//save the website object
	return this.saveWebsite().then(() => {
		if (this.activeResource) {
			//make sure our active resource is set
			this.resources[this.activeResource] = this.editor.getValue();
		}

		return Promise.all(Object.keys(this.resources).map((k) => {
			return this.saveResource(k, this.resources[k]);
		}));
	}).then(() => {
		this.showSaveMessage();
	});
};

_websitesEditorController.prototype.refreshState = function() {
	this.caller.website = this.website;
	this.caller.clients = this.clients;
	this.caller.routes = this.routes;
	this.caller.mainVisible = this.mainVisible;
	this.caller.viewEditorVisible = this.viewEditorVisible;
	this.caller.controllerEditorVisible = this.controllerEditorVisible;
	this.caller.tags = this.tags;
	this.caller.newResourceVisible = this.newResourceVisible;
	this.caller.staticfiles = this.staticfiles;
	this.caller.$forceUpdate();
};

_websitesEditorController.prototype.loadResource = function(path) {
	if (this.resources[path]) {
		return Promise.resolve(this.resources[path]);
	}

	return new Promise((resolve, reject) => {
		window.axios
			.get(`http://localhost:8001/websites/${this.website.name}/resource?path=${path}`, {
				headers : {
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				this.resources[path] = response.data;

				return resolve(this.resources[path]);
			});
	});
};

_websitesEditorController.prototype.editView = function(path) {
	this.activeResource = path;
	this.loadResource(path).then((resource) => {
		this.mainVisible = false;
		this.viewEditorVisible = true;
		this.controllerEditorVisible = false;
		this.refreshState();
		var rawResource = resource;

		if (typeof(resource) === "object") {
			rawResource = JSON.stringify(resource, null, 4);
		}

		setTimeout(() => {
			this.initEditor("viewEditor", "json", rawResource);
		}, 10);
	});
};

_websitesEditorController.prototype.editController = function(path) {
	this.activeResource = path;
	this.loadResource(path).then((resource) => {
		this.mainVisible = false;
		this.viewEditorVisible = false;
		this.controllerEditorVisible = true;
		this.refreshState();
		setTimeout(() => {
			this.initEditor("controllerEditor", "javascript", resource);
		}, 10);
	});
};

_websitesEditorController.prototype.mainView = function() {
	//save our active resource
	this.resources[this.activeResource] = this.editor.getValue();

	this.mainVisible = true;
	this.viewEditorVisible = false;
	this.controllerEditorVisible = false;
	this.refreshState();
};

_websitesEditorController.prototype.removeRoute = function(num) {
	if (this.routes.length <= 1) {
		return;
	}

	var i = 0;
	this.routes = this.routes.reduce((s, a) => {
		if (i !== num) {
			s.push(a);
		}
		i++;
		return s;
	}, []);
	this.refreshState();
};

_websitesEditorController.prototype.removeTag = function(num) {
	var i = 0;
	this.tags = this.tags.reduce((s, a) => {
		if (i !== num) {
			s.push(a);
		}
		i++;
		return s;
	}, []);
	this.refreshState();
};


_websitesEditorController.prototype.fetchWebsite = function(caller, name) {
	this.caller = caller;
	return window.axios
		.get(`http://localhost:8001/websites/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.website = response.data;

			//update our routes
			this.routes = Object.keys(response.data.routes).map((r) => {
				return {
					route 		: r,
					roles 		: response.data.routes[r].roles,
					secure 		: response.data.routes[r].secure,
					controller 	: response.data.routes[r].controller,
					view 		: response.data.routes[r].view,
				};
			});
			this.tags = response.data.tags || [];
			this.refreshState();
		});
};

_websitesEditorController.prototype.fetchClients = function(caller) {
	this.caller = caller;
	return window.axios
		.get("http://localhost:8001/security/clients", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.clients = response.data;
			this.refreshState();
		});
};

_websitesEditorController.prototype.showSaveMessage = function() {
	this.caller.showAlert = true;
	this.caller.$forceUpdate();

	setTimeout(() => {
		this.caller.showAlert = false;
		this.caller.$forceUpdate();
	}, 1500);
};

_websitesEditorController.prototype.newRoute = function() {
	var name = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);

	this.routes.push({
		route 		: `/${name}`,
		view 		: `./view/${name}.json`,
		controller 	: `./controllers/${name}.js`,
	});

	//add our blank resources
	this.resources[`./view/${name}.json`] = JSON.stringify({
			"tag" : "html",
			"children" : [
			{
				"tag" : "head",
				"children" : []
			},
			{
				"tag" : "body",
				"children" : []
			}
		]
	}, null, 4);
	this.resources[`./controllers/${name}.js`] = [
"module.exports = {",
"	events : {",
"		load : function(event) {},",
"	}",
"}"
	].join("\n");
};

_websitesEditorController.prototype.newTag = function() {
	var name = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);

	this.tags.push({
		name 		: name,
		view 		: `./view/${name}.json`,
		controller 	: `./controllers/${name}.js`
	});

	this.resources[`./view/${name}.json`] = JSON.stringify({
		"tag" : "div",
		"children" : [

		]
	}, null, 4);
	this.resources[`./controllers/${name}.js`] = [
"module.exports = {",
"	events : {",
"		load : function(event) {},",
"	}",
"}"
	].join("\n");
};

_websitesEditorController.prototype.newStaticFile = function() {
	this.newResourceVisible = true;
	this.refreshState();
};

_websitesEditorController.prototype.uploadResource = function() {
	var formData = new FormData();
	var imagefile = document.querySelector("#file");
	formData.append("resource", imagefile.files[0]);
	return window.axios.post(`http://localhost:8001/websites/${this.website.name}/staticfiles`, formData, {
		headers: {
	  		"Content-Type" : "multipart/form-data",
	  		Authorization  : `Bearer ${window.getToken()}`
		}
	}).then(() => {
		this.newResourceVisible = false;
		return this.fetchStaticFiles(this.caller, this.website.name);
	});
};

_websitesEditorController.prototype.fetchStaticFiles = function(caller, name) {
	this.caller = caller;
	return window.axios.get(`http://localhost:8001/websites/${name}/staticfiles`, {
		headers : {
			Authorization : `Bearer ${window.getToken()}`
		}
	}).then((response) => {
		this.staticfiles = response.data;
		this.refreshState();
	});
};

_websitesEditorController.prototype.removeResource = function(filename) {
	return window.axios.delete(`http://localhost:8001/websites/${this.website.name}/staticfiles/${filename}`, {
		headers : {
			Authorization : `Bearer ${window.getToken()}`
		}
	}).then(() => {
		return this.fetchStaticFiles(this.caller, this.website.name);
	});
};

window.WebsiteEditor = {
	template : "#template-websiteEditor",
	data 	 : () => {
		return window._websitesEditorControllerInstance.getData();
	},
	mounted  : function() {
		if (this.$route.params.name === ".new") {
			window._websitesEditorControllerInstance.wipeData();

			return window._websitesEditorControllerInstance.fetchClients(this);
		}

		return window._websitesEditorControllerInstance.fetchWebsite(this, this.$route.params.name).then(() => {
			return window._websitesEditorControllerInstance.fetchClients(this);
		}).then(() => {
			return window._websitesEditorControllerInstance.fetchStaticFiles(this, this.$route.params.name);
		});
	}
};

window._websitesEditorControllerInstance = new _websitesEditorController(window.WebsiteEditor);