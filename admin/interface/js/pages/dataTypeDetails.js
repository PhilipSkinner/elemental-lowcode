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
		exampleObject 			: null,
		token 					: window.getToken()
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
		.get('http://localhost:8001/data/types/' + name, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.data.dataType = response.data;
			this.generateExampleObject();
		});
};

_dataTypeDetailsController.prototype.generateExampleObject = function() {
	var obj = JSONSchemaFaker.generate(this.data.dataType.schema);
	this.data.exampleObject = JSON.stringify(obj, null, 4);
	this.data.exampleId = 'bda231fd-10c1-4a2c-9c70-f99ee9c237ec';
	this.data.exampleSingleResponse = JSON.stringify(Object.assign(obj, {
		id : this.data.exampleId
	}), null, 4);
	this.data.exampleGetResponse = JSON.stringify([
		Object.assign(obj, {
			id : this.data.exampleId
		})
	], null, 4);

	Object.assign(this.caller, this.data);
	this.caller.$forceUpdate();
};

const DataTypeDetails = {
	template : '#template-dataTypeDetails',
	data 	 : () => {
		return _dataTypeDetailsInstance.getData();
	},
	mounted  : function() {
		_dataTypeDetailsInstance.setCaller(this);
		_dataTypeDetailsInstance.fetchType(this.$route.params.type);
	}
};

const _dataTypeDetailsInstance = new _dataTypeDetailsController(DataTypeDetails);