const _securityUserEditorController = function(page) {
	this._page = page;

};

_securityUserEditorController.prototype.getData = function() {
	return {

	};
};

_securityUserEditorController.prototype.save = function() {

};

const SecurityUserEditor = {
	template : '#template-securityUserEditor',
	data 	 : () => {
		return _securityUserEditorControllerInstance.getData();
	},
	mounted  : function() {
		
	}
};

const _securityUserEditorControllerInstance = new _securityUserEditorController(SecurityUserEditor);