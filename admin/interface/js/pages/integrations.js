const _integrationsController = function(page) {
	this._page = page;
	this.integrations = [];
};

_integrationsController.prototype.getData = function() {
	return {
		integrations : this.integrations
	};
};

_integrationsController.prototype.fetchTypes = function(caller) {
	return axios
		.get('http://localhost:8001/integrations')
		.then((response) => {			
			this.integrations = response.data;
			caller.integrations = response.data;
			caller.$forceUpdate();
		});
};

const Integrations = { 
	template : '#template-integrations',
	data 	 : () => {
		return _integrationsControllerInstance.getData();
	},
	mounted  : function() {
		return _integrationsControllerInstance.fetchTypes(this);		
	}
};

const _integrationsControllerInstance = new _integrationsController(Data);