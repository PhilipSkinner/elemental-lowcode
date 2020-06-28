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
		token 					: window.getToken(),
		uri 					: '',
		navitems : [
		]
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
	return window.axios
		.get(`${window.hosts.kernel}/data/types/` + name, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.data.dataType = response.data;
			this.data.uri = `${window.hosts.storage}/${this.data.dataType.name}/.definition`;
			this.caller.$forceUpdate();
		});
};


window.DataTypeDetails = {
	template : "#template-dataTypeDetails",
	data 	 : () => {
		return window._dataTypeDetailsInstance.getData();
	},
	mounted  : function() {
		window._dataTypeDetailsInstance.setCaller(this);
		window._dataTypeDetailsInstance.fetchType(this.$route.params.type);
		window._dataTypeDetailsInstance.data.navitems = [
			{
				name 		: "Edit",
				event 		: () => {
					window.router.push({
						name : 'dataTypeEditor',
						params : {
							type : this.$route.params.type
						}
					});
				},
				selected	: false
			},
			{
				name 		: "API Explorer",
				event 		: () => {

				},
				selected 	: true
			},
			{
				name 		: "Definition",
				link		: `${window.hosts.storage}/${this.$route.params.type}/.definition`,
				selected	: false
			}
		];
	}
};

window._dataTypeDetailsInstance = new _dataTypeDetailsController(window.DataTypeDetails);