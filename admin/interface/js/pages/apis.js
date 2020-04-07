const _apisController = function(page) {
	this._page = page;
	this.apis = [];
};

_apisController.prototype.getData = function() {
	return {
		apis : this.apis
	};
};

_apisController.prototype.fetchApis = function(caller) {
	this.caller = caller ? caller : this.caller;
	return window.axios
		.get("http://localhost:8001/apis", {
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
	return window.axios
		.delete(`http://localhost:8001/apis/${name}`, {
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