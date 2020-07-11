const _securityController = function(page) {
	this._page = page;
	this.clients = [];
	this.scopes = [];
	this.users = [];
	this.secrets = [];
	this.currentSecret = {};
	this.settingsVisible = true;
	this.storageVisible = false;
	this.secretsVisible = false;
	this.settingSecretValue = false;
	this.addingSecret = false;
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
		},
		{
			name 		: "Secrets",
			event 		: this.showSecrets.bind(this),
			selected	: this.secretsVisible
		}
	];
	this.config = {};
};

_securityController.prototype.getData = function() {
	return {
		clients 					: this.clients,
		users 						: this.users,
		scopes 						: this.scopes,
		settingsVisible 			: this.settingsVisible,
		storageVisible 				: this.storageVisible,
		secretsVisible 				: this.secretsVisible,
		addingSecret 				: this.addingSecret,
		Secrets 					: this.secrets,
		navitems 					: this.navitems,
		config 						: this.config,
		showAlert 					: this.showAlert,
		currentSecret 				: this.currentSecret,
		settingSecretValue 			: this.settingSecretValue,
		deleteClientConfirmVisible 	: false,
		confirmClientDeleteAction 	: () => {},
		deleteUserConfirmVisible 	: false,
		confirmUserDeleteAction 	: () => {},
		deleteSecretConfirmVisible 	: false,
		confirmSecretDeleteAction 	: () => {}
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
	this.navitems[2].selected = this.secretsVisible;
	this.caller.navitems = this.navitems;
	this.caller.secretsVisible = this.secretsVisible;
	this.caller.addingSecret = this.addingSecret;
	this.caller.secrets = this.secrets;
	this.caller.currentSecret = this.currentSecret;
	this.caller.settingSecretValue = this.settingSecretValue;

	this.caller.$forceUpdate();
};

_securityController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_securityController.prototype.showSettings = function() {
	this.settingsVisible = true;
	this.storageVisible = false;
	this.secretsVisible = false;

	this.forceRefresh();
};

_securityController.prototype.showStorage = function() {
	this.settingsVisible = false;
	this.storageVisible = true;
	this.secretsVisible = false;

	this.forceRefresh();
};

_securityController.prototype.showSecrets = function() {
	this.settingsVisible = false;
	this.storageVisible = false;
	this.addingSecret = false;
	this.secretsVisible = true;

	this.forceRefresh();
};

_securityController.prototype.addSecret = function() {
	this.addingSecret = true;
	this.currentSecret = {};

	this.forceRefresh();
};

_securityController.prototype.setSecret = function(name) {
	this.settingSecretValue = true;
	this.currentSecret = {
		name 	: name,
		value 	: ''
	};

	this.forceRefresh();
};

_securityController.prototype.cancelSetSecret = function() {
	this.currentSecret = {};
	this.settingSecretValue = false;

	this.forceRefresh();
};

_securityController.prototype.deleteClient = function(name) {
	this.caller.deleteSecretConfirmVisible = false;
	this.caller.deleteUserConfirmVisible = false;
	this.caller.deleteClientConfirmVisible = true;
	this.caller.confirmClientDeleteAction = () => {
		this.caller.deleteSecretConfirmVisible = false;
		this.caller.deleteUserConfirmVisible = false;
		this.caller.deleteClientConfirmVisible = false;
		return this._deleteClient(name);
	};
	this.caller.$forceUpdate();
	return;
};

_securityController.prototype._deleteClient = function(clientId) {
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
	this.caller.deleteSecretConfirmVisible = false;
	this.caller.deleteUserConfirmVisible = true;
	this.caller.deleteClientConfirmVisible = false;
	this.caller.confirmUserDeleteAction = () => {
		this.caller.deleteSecretConfirmVisible = false;
		this.caller.deleteUserConfirmVisible = false;
		this.caller.deleteClientConfirmVisible = false;
		return this._deleteUser(userId);
	};
	this.caller.$forceUpdate();
	return;
};

_securityController.prototype._deleteUser = function(userId) {
	return window.axios
		.delete(`${window.hosts.identity}/api/users/${userId}`, {
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
		.get(`${window.hosts.identity}/api/users`, {
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

_securityController.prototype.fetchSecrets = function() {
	return window.axios
		.get(`${window.hosts.kernel}/security/secrets`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		}).then((response) => {
			this.secrets = response.data;
			this.forceRefresh();
		});
};

_securityController.prototype.saveSecret = function() {
	return window.axios
		.post(`${window.hosts.kernel}/security/secrets`, JSON.stringify({
			name : this.currentSecret.name,
			scope : this.currentSecret.scope
		}), {
			headers : {
				Authorization : `Bearer ${window.getToken()}`,
				"Content-Type" : "application/json"
			}
		}).then((response) => {
			this.showSecrets();
			return this.fetchSecrets();
		});
};

_securityController.prototype.removeSecret = function(name) {
	this.caller.deleteSecretConfirmVisible = true;
	this.caller.deleteUserConfirmVisible = false;
	this.caller.deleteClientConfirmVisible = false;
	this.caller.confirmSecretDeleteAction = () => {
		this.caller.deleteSecretConfirmVisible = false;
		this.caller.deleteUserConfirmVisible = false;
		this.caller.deleteClientConfirmVisible = false;
		return this._removeSecret(name);
	};
	this.caller.$forceUpdate();
	return;
};

_securityController.prototype._removeSecret = function(name) {
	return window.axios
		.delete(`${window.hosts.kernel}/security/secrets/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		}).then((response) => {
			return this.fetchSecrets();
		});
};

_securityController.prototype.saveSecretValue = function() {
	return window.axios
		.put(`${window.hosts.kernel}/security/secrets/${this.currentSecret.name}`, this.currentSecret.value, {
			headers : {
				"Content-Type" : "text/plain",
				Authorization : `Bearer ${window.getToken()}`
			}
		}).then((response) => {
			this.cancelSetSecret();
			return this.forceRefresh();
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
		}).then(() => {
			return window._securityControllerInstance.fetchSecrets();
		});
	}
};

window._securityControllerInstance = new _securityController(window.Security);