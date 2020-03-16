const _dataController = function(page) {
	this._page = page;
	this.dataTypes = [];
};

_dataController.prototype.getData = function() {
	return {
		dataTypes : this.dataTypes
	};
};

_dataController.prototype.fetchTypes = function(caller) {
	this.caller = caller;
	
	return window.axios
		.get("http://localhost:8001/data/types", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.dataTypes = response.data;
			this.caller.dataTypes = response.data;
			this.caller.$forceUpdate();
		});
};

_dataController.prototype.deleteType = function(name) {
	return window.axios
		.delete(`http://localhost:8001/data/types/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.fetchTypes(this.caller);
		});
};

window.Data = {
	template : "#template-dataTypes",
	data 	 : () => {
		return window._dataControllerInstance.getData();
	},
	mounted  : function() {
		return window._dataControllerInstance.fetchTypes(this);
	}
};

window._dataControllerInstance = new _dataController(window.Data);