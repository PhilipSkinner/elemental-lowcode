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
	template : '<p><table><tr><th>Type</th></tr><tr v-for="item in dataTypes"><td>{{item.name}}</td></tr></table></p>',
	data 	 : () => {
		return _dataControllerInstance.getData();
	},
	mounted  : function() {
		return _dataControllerInstance.fetchTypes(this);		
	}
};

const _dataControllerInstance = new _dataController(Data);