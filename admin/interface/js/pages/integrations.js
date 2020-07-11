const _integrationsController = function(page) {
	this._page = page;
	this.integrations = [];
};

_integrationsController.prototype.getData = function() {
	return {
		integrations 			: this.integrations,
		deleteConfirmVisible 	: false,
		confirmDeleteAction 	: () => {}
	};
};

_integrationsController.prototype.fetchIntegrations = function(caller) {
	this.caller = caller;

	return window.axios
		.get(`${window.hosts.kernel}/integrations`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.integrations = response.data;
			this.caller.integrations = response.data;
			this.caller.$forceUpdate();
		});
};

_integrationsController.prototype.removeIntegration = function(name) {
	this.caller.deleteConfirmVisible = true;
	this.caller.confirmDeleteAction = () => {
		this.caller.deleteConfirmVisible = false;
		this._removeIntegration(name);
	};
	this.caller.$forceUpdate();
	return;
};

_integrationsController.prototype._removeIntegration = function(name) {
	return window.axios
		.delete(`${window.hosts.kernel}/integrations/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.fetchIntegrations(this.caller);
		});
};

window.Integrations = {
	template : "#template-integrations",
	data 	 : () => {
		return window._integrationsControllerInstance.getData();
	},
	mounted  : function() {
		return window._integrationsControllerInstance.fetchIntegrations(this);
	}
};

window._integrationsControllerInstance = new _integrationsController(window.Integrations);