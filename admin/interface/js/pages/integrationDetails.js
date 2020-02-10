const _integrationDetailController = function(page) {
	this._page = page;
	this.caller = null;
	this.data = {
		integration 	: this.integration
	};
};

_integrationDetailController.prototype.setCaller = function(caller) {
	this.caller = caller;
}

_integrationDetailController.prototype.getData = function() {
	return this.data;
};

_integrationDetailController.prototype.fetchType = function(name) {
	this.name = name;
	return axios
		.get('http://localhost:8001/integrations/' + name, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.integration = response.data;
			this.caller.integration = response.data;
			this.caller.$forceUpdate();
		});
};

const IntegrationDetails = {
	template : '#template-integrationDetails',
	data 	 : () => {
		return _integrationDetailInstance.getData();
	},
	mounted  : function() {
		_integrationDetailInstance.setCaller(this);
		return _integrationDetailInstance.fetchType(this.$route.params.name);
	}
};

const _integrationDetailInstance = new _integrationDetailController(IntegrationDetails);