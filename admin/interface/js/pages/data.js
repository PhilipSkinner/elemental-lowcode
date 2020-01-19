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
	return axios
		.get('http://localhost:8001/data/types')
		.then((response) => {			
			this.dataTypes = response.data;
			caller.dataTypes = response.data;
			caller.$forceUpdate();
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