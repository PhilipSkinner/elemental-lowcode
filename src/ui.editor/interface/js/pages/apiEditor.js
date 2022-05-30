const _apiEditorController = function(page) {
    this._page = page;
    this.api = {};
    this.clients = [];
    this.showAlert = false;
    this.controllerEditorVisible = false;
    this.mainVisible = true;
    this.resources = {};
    this.routes = [];
    this.controllers = [];
    this.securityPopupOpen = false;
    this.selectedRoute = {};
    this.securityDetails = {};
};

_apiEditorController.prototype.autoProvisionClient = function() {
    if (!this.api.name) {
        return;
    }

    //generate a default client
    const client = {
	    "client_id": `interface-${this.api.name}-client`,
	    "client_secret": `${window.generateGuid().split("-").reverse().join("")}${window.generateGuid().split("-").reverse().join("")}${window.generateGuid().split("-").reverse().join("")}`,
	    "scope": "roles",
	    "grant_types" : [
            "client_credentials"
	    ],
	    "redirect_uris": []
    };

    //save the client and set the value
    return window.axiosProxy
        .post(`${window.hosts.kernel}/security/clients`, JSON.stringify(client), {
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then((response) => {
            //set the client and save the website
            this.api.client_id = client.client_id;
            return this.fetchClients().then(() => {
                return this.saveAll();
            });
        }).catch((err) => {
            console.log(err);
        });
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
    this.selectedRoute.roles = this.selectedRoute.roles.join(", ");
    this.securityPopupOpen = true;
    this.refreshState();
};

_apiEditorController.prototype.setSecurity = function() {
    const route = this.routes.find((r) => {
        return r.name == this.securityDetails.name;
    });

    route[this.securityDetails.method.toLowerCase()] = JSON.parse(JSON.stringify(this.selectedRoute));
    let roles = this.selectedRoute.roles.split(",").map((val) => {
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

    return window.axiosProxy.get(`${window.hosts.kernel}/apis/${this.api.name}/${resourceName}`).then((resource) => {
        this.resources[resourceName] = resource.data;
        return this.initEditor("controllerEditor", "javascript", this.resources[resourceName]);
    });
};

_apiEditorController.prototype.getData = function() {
    return {
        api 							: this.api,
        clients 						: this.clients,
        showAlert 						: this.showAlert,
        controllerEditorVisible 		: this.controllerEditorVisible,
        mainVisible 					: this.mainVisible,
        routes 							: this.routes,
        controllers 					: this.controllers,
        securityPopupOpen				: this.securityPopupOpen,
        selectedRoute 					: this.selectedRoute,
        deleteRouteConfirmVisible 		: false,
        confirmRouteDeleteAction 		: () => {},
        deleteControllerConfirmVisible 	: false,
        confirmControllerDeleteAction 	: () => {}
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
    this.caller.controllerEditorVisible = this.controllerEditorVisible;
    this.caller.mainVisible 			= this.mainVisible;
    this.caller.routes 					= this.routes;
    this.caller.controllers 			= this.controllers;
    this.caller.securityPopupOpen 		= this.securityPopupOpen;
    this.caller.selectedRoute 			= this.selectedRoute;
    this.caller.$forceUpdate();
};

_apiEditorController.prototype.fetchApi = function(name) {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/apis/${name}`)
        .then((response) => {
            this.api = response.data;
            this.refreshState();
        });
};

_apiEditorController.prototype.fetchClients = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/clients`)
        .then((response) => {
            this.clients = response.data;
            this.refreshState();
        });
};

_apiEditorController.prototype.mainView = function() {
    this.resources[this.openResource] = this.editor.getValue();

    this.mainVisible = true;
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
        "		res.json({ hello : "world" });",
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

_apiEditorController.prototype._saveAPI = function() {
    this.api.routes = {};
    this.routes.forEach((route) => {
        this.api.routes[route.name] = route;
    });

    this.api.controllers = {};
    this.controllers.forEach((controller) => {
        this.api.controllers[controller.name] = controller.controller;
    });

    return window.axiosProxy.put(
        `${window.hosts.kernel}/apis/${this.api.name}`,
        this.api
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

_apiEditorController.prototype._saveController = function(name, resource) {
    return new Promise((resolve, reject) => {
        return window.axiosProxy.put(
            `${window.hosts.kernel}/apis/${this.api.name}/controllers/${name}`, {
                content : resource
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
        if (name.indexOf("controllers/") === 0) {
            return this._saveController(name.substring(12), this.resources[name]);
        }

        return Promise.resolve();
    })).then(() => {
        return this._saveAPI();
    });
};

_apiEditorController.prototype.removeController = function(name) {
    this.caller.deleteControllerConfirmVisible = true;
    this.caller.deleteRouteConfirmVisible = false;
    this.caller.confirmControllerDeleteAction = () => {
        this.caller.deleteControllerConfirmVisible = false;
        this.caller.deleteRouteConfirmVisible = false;
        return this._removeController(name);
    };
    this.caller.$forceUpdate();
    return;
};

_apiEditorController.prototype._removeController = function(name) {
    delete(this.api.controllers[name]);
    this.refreshState();
};

_apiEditorController.prototype.removeRoute = function(name) {
    this.caller.deleteRouteConfirmVisible = true;
    this.caller.deleteControllerConfirmVisible = false;
    this.caller.confirmRouteDeleteAction = () => {
        this.caller.deleteRouteConfirmVisible = false;
        this.caller.deleteControllerConfirmVisible = false;
        return this._removeRoute(name);
    };
    this.caller.$forceUpdate();
    return;
};

_apiEditorController.prototype._removeRoute = function(name) {
    delete(this.api.routes[name]);
    this.refreshState();
};

_apiEditorController.prototype.keyDownHandler = function(event) {
    if (event && event.ctrlKey && event.keyCode == 83) {
        window._apiEditorControllerInstance.saveAll();

        event.preventDefault();
        event.stopPropagation();
    }
};

window.apiEditor = {
    template : "#template-api-editor",
    data 	 : function() {
        return window._apiEditorControllerInstance.getData();
    },
    mounted  : function() {
        window._apiEditorControllerInstance.setCaller(this);

        document.removeEventListener("keydown", window._apiEditorControllerInstance.keyDownHandler);
        document.addEventListener("keydown", window._apiEditorControllerInstance.keyDownHandler);

        if (this.$route.params.name === ".new") {
            window._apiEditorControllerInstance.api = {};
            return window._apiEditorControllerInstance.fetchClients();
        }
        return Promise.all([
            window._apiEditorControllerInstance.fetchApi(this.$route.params.name),
            window._apiEditorControllerInstance.fetchClients()
        ]);
    },
    destroyed : function() {
        document.removeEventListener("keydown", window._apiEditorControllerInstance.keyDownHandler);
    }
};

window._apiEditorControllerInstance = new _apiEditorController(window.apiEditor);