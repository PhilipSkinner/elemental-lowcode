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

_securityController.prototype.fetchClients = function(caller) {
	return window.axios
		.get("http://localhost:8001/security/clients", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {			
			this.clients = response.data;
			caller.clients = response.data;
			caller.$forceUpdate();
		});
};

_securityController.prototype.fetchScopes = function(caller) {
	return window.axios
		.get("http://localhost:8001/security/scopes", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {			
			this.scopes = response.data;
			caller.scopes = response.data;
			caller.$forceUpdate();
		});
};

_securityController.prototype.fetchUsers = function(caller) {
	return window.axios
		.get("http://localhost:8001/security/users", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {			
			this.users = response.data;
			caller.users = response.data;
			caller.$forceUpdate();
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