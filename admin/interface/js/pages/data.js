const _dataController = function(page) {
	this._page = page;
	this.dataTypes = [];
};

_dataController.prototype.getData = function() {
	console.log("getting data");
	return {
		dataTypes : this.dataTypes
	};
};

_dataController.prototype.fetchTypes = function(caller) {
	this.caller = caller;

	return axios
		.get('http://localhost:8001/data/types')
		.then((response) => {
			this.dataTypes = response.data;
			this.caller.dataTypes = response.data;
			this.caller.$forceUpdate();
		});
};

_dataController.prototype.deleteType = function(name) {
	return axios
		.delete(`http://localhost:8001/data/types/${name}`)
		.then((response) => {
			this.fetchTypes(this.caller);
		});
};

const Data = {
	template : '#template-dataTypes',
	data 	 : () => {
		return _dataControllerInstance.getData();
	},
	mounted  : function() {
		console.log("mounting it");

		return _dataControllerInstance.fetchTypes(this);
	}
};

const _dataControllerInstance = new _dataController(Data);