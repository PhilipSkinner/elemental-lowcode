const _dataTypeDetailsController = function(page) {
	this._page = page;
	this.dataType = {};
	this.caller = null;
	this.name = null;
	this.data = {
		dataType 				: this.dataType,
		exampleGetResponse 		: null,
		exampleId 				: null,
		exampleSingleResponse 	: null,
	};
};

_dataTypeDetailsController.prototype.setCaller = function(caller) {
	this.caller = caller;
}

_dataTypeDetailsController.prototype.getData = function() {
	return this.data;
};

_dataTypeDetailsController.prototype.fetchType = function(name) {
	this.name = name;
	return axios
		.get('http://localhost:8001/data/types/' + name)
		.then((response) => {
			this.dataTypes = response.data;
			this.caller.dataType = response.data;
			this.caller.$forceUpdate();
		});
};

_dataTypeDetailsController.prototype.fetchGetResponse = function(name) {
	this.name = name;
	return axios
		.get(`http://localhost:8006/${name}`)
		.then((response) => {
			if (response.data.length > 0) {
				this.exampleId = response.data[0].id;
			}
			this.exampleGetResponse = JSON.stringify(response.data, null, 4);
			this.caller.exampleGetResponse = this.exampleGetResponse;
			this.caller.exampleId = this.exampleId;
			this.caller.$forceUpdate();

			this.fetchSingleResponse(this.name, this.exampleId);
		});
};

_dataTypeDetailsController.prototype.fetchSingleResponse = function(name, id) {
	this.name = name;
	return axios
		.get(`http://localhost:8006/${name}/${id}`)
		.then((response) => {
			this.exampleSingleResponse = JSON.stringify(response.data, null, 4);
			this.caller.exampleSingleResponse = this.exampleSingleResponse;
			this.caller.$forceUpdate();
		});
};

const DataTypeDetails = {
	template : '#template-dataTypeDetails',
	data 	 : () => {
		return _dataTypeDetailsInstance.getData();
	},
	mounted  : function() {
		_dataTypeDetailsInstance.setCaller(this);
		_dataTypeDetailsInstance.fetchType(this.$route.params.type);
		_dataTypeDetailsInstance.fetchGetResponse(this.$route.params.type);
	}
};

const _dataTypeDetailsInstance = new _dataTypeDetailsController(DataTypeDetails);