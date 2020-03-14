const _integrationsController = function(page) {
	this._page = page;
	this.integrations = [];
};

_integrationsController.prototype.getData = function() {
	return {
		integrations : this.integrations
	};
};

_integrationsController.prototype.fetchIntegrations = function(caller) {
	this.caller = caller;

	return window.axios
		.get("http://localhost:8001/integrations", {
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
	return window.axios
		.delete(`http://localhost:8001/integrations/${name}`, {
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