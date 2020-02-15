const _securityScopeEditorController = function(page) {
	this._page = page;

};

_securityScopeEditorController.prototype.getData = function() {
	return {

	};
};

_securityScopeEditorController.prototype.save = function() {

};

const SecurityScopeEditor = {
	template : '#template-securityScopeEditor',
	data 	 : () => {
		return _securityScopeEditorControllerInstance.getData();
	},
	mounted  : function() {
		
	}
};

const _securityScopeEditorControllerInstance = new _securityScopeEditorController(SecurityScopeEditor);