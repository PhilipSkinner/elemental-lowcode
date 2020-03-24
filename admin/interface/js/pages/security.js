const _securityController = function(page) {
	this._page = page;
	this.clients = [];
	this.scopes = [];
	this.users = [];
};

_securityController.prototype.getData = function() {
	return {
		clients : this.clients,
		users 	: this.users,
		scopes 	: this.scopes,
	};
};

_securityController.prototype.deleteClient = function(clientId) {
	return window.axios
		.delete(`http://localhost:8001/security/clients/${clientId}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchClients();
		});
};

_securityController.prototype.fetchClients = function(caller) {
	this.caller = caller ? caller : this.caller;
	return window.axios
		.get("http://localhost:8001/security/clients", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.clients = response.data;
			this.caller.clients = response.data;
			this.caller.$forceUpdate();
		});
};

_securityController.prototype.deleteScope = function(scope) {
	return window.axios
		.delete(`http://localhost:8001/security/scopes/${scope}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchScopes();
		});
};

_securityController.prototype.fetchScopes = function(caller) {
	this.caller = caller ? caller : this.caller;
	return window.axios
		.get("http://localhost:8001/security/scopes", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.scopes = response.data;
			this.caller.scopes = response.data;
			this.caller.$forceUpdate();
		});
};

_securityController.prototype.deleteUser = function(userId) {
	return window.axios
		.delete(`http://localhost:8001/security/users/${userId}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchUsers();
		});
};

_securityController.prototype.fetchUsers = function(caller) {
	this.caller = caller ? caller : this.caller;
	return window.axios
		.get("http://localhost:8001/security/users", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.users = response.data;
			this.caller.users = response.data;
			this.caller.$forceUpdate();
		});
};

window.Security = {
	template : "#template-security",
	data 	 : () => {
		return window._securityControllerInstance.getData();
	},
	mounted  : function() {
		return window._securityControllerInstance.fetchClients(this).then(() => {
			return window._securityControllerInstance.fetchScopes(this);
		}).then(() => {
			return window._securityControllerInstance.fetchUsers(this);
		})
	}
};

window._securityControllerInstance = new _securityController(window.Security);