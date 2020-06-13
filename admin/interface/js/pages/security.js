const _securityController = function(page) {
	this._page = page;
	this.clients = [];
	this.scopes = [];
	this.users = [];
	this.settingsVisible = true;
	this.storageVisible = false;
	this.showAlert = false;
	this.navitems = [
		{
			name 		: "Settings",
			event 		: this.showSettings.bind(this),
			selected 	: this.settingsVisible
		},
		{
			name 		: "Storage",
			event 		: this.showStorage.bind(this),
			selected 	: this.storageVisible
		}
	];
	this.config = {};
};

_securityController.prototype.getData = function() {
	return {
		clients 		: this.clients,
		users 			: this.users,
		scopes 			: this.scopes,
		settingsVisible : this.settingsVisible,
		storageVisible 	: this.storageVisible,
		navitems 		: this.navitems,
		config 			: this.config,
		showAlert 		: this.showAlert,
	};
};

_securityController.prototype.forceRefresh = function() {
	this.caller.clients = this.clients;
	this.caller.users = this.users;
	this.caller.scopes = this.scopes;
	this.caller.settingsVisible = this.settingsVisible;
	this.caller.storageVisible = this.storageVisible;
	this.caller.showAlert = this.showAlert;
	this.caller.config = this.config;
	this.navitems[0].selected = this.settingsVisible;
	this.navitems[1].selected = this.storageVisible;
	this.caller.navitems = this.navitems;

	this.caller.$forceUpdate();
};

_securityController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_securityController.prototype.showSettings = function() {
	this.settingsVisible = true;
	this.storageVisible = false;

	this.forceRefresh();
};

_securityController.prototype.showStorage = function() {
	this.settingsVisible = false;
	this.storageVisible = true;

	this.forceRefresh();
};

_securityController.prototype.deleteClient = function(clientId) {
	return window.axios
		.delete(`${window.hosts.kernel}/security/clients/${clientId}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchClients();
		});
};

_securityController.prototype.fetchClients = function() {
	return window.axios
		.get(`${window.hosts.kernel}/security/clients`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.clients = response.data;
			this.forceRefresh();
		});
};

_securityController.prototype.deleteScope = function(scope) {
	return window.axios
		.delete(`${window.hosts.kernel}/security/scopes/${scope}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchScopes();
		});
};

_securityController.prototype.fetchScopes = function() {
	return window.axios
		.get(`${window.hosts.kernel}/security/scopes`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.scopes = response.data;
			this.forceRefresh();
		});
};

_securityController.prototype.deleteUser = function(userId) {
	return window.axios
		.delete(`${window.hosts.kernel}/security/users/${userId}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchUsers();
		});
};

_securityController.prototype.fetchUsers = function() {
	return window.axios
		.get(`${window.hosts.kernel}/security/users`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.users = response.data;
			this.forceRefresh();
		});
};

_securityController.prototype.fetchConfig = function() {
	return window.axios
		.get(`${window.hosts.kernel}/security/config`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		}).then((response) => {
			this.config = response.data;
			this.forceRefresh();
		});
};

_securityController.prototype.saveConfig = function() {
	console.log("Saving config");

	return window.axios
		.put(`${window.hosts.kernel}/security/config`, JSON.stringify(this.config), {
			headers : {
				Authorization : `Bearer ${window.getToken()}`,
				"Content-Type" : "application/json"
			}
		}).then((response) => {
			this.showAlert = true;
			this.forceRefresh();

			setTimeout(() => {
				this.showAlert = false;
				this.forceRefresh();
			}, 3000);
		});
};

window.Security = {
	template : "#template-security",
	data 	 : () => {
		return window._securityControllerInstance.getData();
	},
	mounted  : function() {
		window._securityControllerInstance.setCaller(this);

		return window._securityControllerInstance.fetchClients().then(() => {
			return window._securityControllerInstance.fetchScopes();
		}).then(() => {
			return window._securityControllerInstance.fetchUsers();
		}).then(() => {
			return window._securityControllerInstance.fetchConfig();
		});
	}
};

window._securityControllerInstance = new _securityController(window.Security);