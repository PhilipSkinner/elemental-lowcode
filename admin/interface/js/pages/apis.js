const _apisController = function(page) {
	this._page = page;
	this.apis = [];
};

_apisController.prototype.getData = function() {
	return {
		apis 					: this.apis,
		deleteConfirmVisible 	: false,
		confirmDeleteAction 	: () => {}
	};
};

_apisController.prototype.fetchApis = function(caller) {
	this.caller = caller ? caller : this.caller;
	return window.axios
		.get(`${window.hosts.kernel}/apis`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.apis = response.data;
			this.caller.apis = response.data;
			this.caller.$forceUpdate();
		});
};

_apisController.prototype.deleteApi = function(name) {
	this.caller.deleteConfirmVisible = true;
	this.caller.confirmDeleteAction = () => {
		this.caller.deleteConfirmVisible = false;
		return this._deleteApi(name);
	};
	this.caller.$forceUpdate();
	return;
};

_apisController.prototype._deleteApi = function(name) {
	return window.axios
		.delete(`${window.hosts.kernel}/apis/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchApis();
		});
};

window.Apis = {
	template : "#template-apis",
	data 	 : () => {
		return window._apisControllerInstance.getData();
	},
	mounted  : function() {
		return window._apisControllerInstance.fetchApis(this);
	}
};

window._apisControllerInstance = new _apisController(window.Apis);