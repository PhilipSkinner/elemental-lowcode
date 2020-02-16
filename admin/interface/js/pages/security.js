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
	return axios
		.get('http://localhost:8001/security/clients', {
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
	return axios
		.get('http://localhost:8001/security/scopes', {
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
	return axios
		.get('http://localhost:8001/security/users', {
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

const Security = {
	template : '#template-security',
	data 	 : () => {
		return _securityControllerInstance.getData();
	},
	mounted  : function() {
		return _securityControllerInstance.fetchClients(this).then(() => {
			return _securityControllerInstance.fetchScopes(this);
		}).then(() => {
			return _securityControllerInstance.fetchUsers(this);
		})
	}
};

const _securityControllerInstance = new _securityController(Security);