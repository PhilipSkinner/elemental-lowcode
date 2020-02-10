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

	return axios
		.get('http://localhost:8001/integrations', {
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
	return axios
		.delete(`http://localhost:8001/integrations/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.fetchIntegrations(this.caller);
		});
};

const Integrations = {
	template : '#template-integrations',
	data 	 : () => {
		return _integrationsControllerInstance.getData();
	},
	mounted  : function() {
		return _integrationsControllerInstance.fetchIntegrations(this);
	}
};

const _integrationsControllerInstance = new _integrationsController(Data);