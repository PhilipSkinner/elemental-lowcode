const _nodeModulesController = function(page) {
	this._page 			= page;
	this.nodeModules 	= [];
	this.formOpen 		= false;
	this.modifying 		= false;
	this.moduleName 	= '';
	this.moduleVersion 	= '';
	this.displayResult 	= false;
	this.resultStdout	= '';
	this.resultStderr 	= '';
};

_nodeModulesController.prototype.getData = function() {
	return {
		nodeModules 			: this.nodeModules,
		formOpen 				: this.formOpen,
		modifying 				: this.modifying,
		moduleName 				: this.moduleName,
		moduleVersion 			: this.moduleVersion,
		displayResult 			: this.displayResult,
		resultStdout			: this.resultStdout,
		resultStderr 			: this.resultStderr,
		deleteConfirmVisible 	: false,
		confirmDeleteAction 	: () => {}
	};
};

_nodeModulesController.prototype.refreshState = function() {
	this.caller.nodeModules 	= this.nodeModules;
	this.caller.formOpen 		= this.formOpen;
	this.caller.modifying 		= this.modifying;
	this.caller.moduleName 		= this.moduleName;
	this.caller.moduleVersion 	= this.moduleVersion;
	this.caller.displayResult 	= this.displayResult;
	this.caller.resultStdout 	= this.resultStdout;
	this.caller.resultStderr 	= this.resultStderr;
	this.caller.$forceUpdate();
};

_nodeModulesController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_nodeModulesController.prototype.fetchNodeModules = function() {
	return window.axios
		.get(`${window.hosts.kernel}/dependencies`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.nodeModules = response.data;
			this.refreshState();
		});
};

_nodeModulesController.prototype.removeNodeModule = function(nodeModule) {
	this.caller.deleteConfirmVisible = true;
	this.caller.confirmDeleteAction = () => {
		this.caller.deleteConfirmVisible = false;
		return this._removeNodeModule(nodeModule);
	};
	this.caller.$forceUpdate();
	return;
};

_nodeModulesController.prototype._removeNodeModule = function(nodeModule) {
	return window.axios
		.delete(`${window.hosts.kernel}/dependencies/${nodeModule}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchNodeModules();
		});
};

_nodeModulesController.prototype.addNodeModule = function() {
	this.formOpen = true;
	this.modifying = false;
	this.moduleName = '';
	this.moduleVersion = '';

	this.refreshState();
};

_nodeModulesController.prototype.closeForm = function() {
	this.formOpen = false;
	this.modifying = false;
	this.moduleName = '';
	this.moduleVersion = '';

	this.refreshState();
};

_nodeModulesController.prototype.modifyNodeModule = function(name) {
	this.formOpen = true;
	this.modifying = true;
	this.moduleName	= name;
	this.moduleVersion = '';

	this.refreshState();
};

_nodeModulesController.prototype.handleSubmit = function() {
	this.moduleName = this.caller.moduleName;
	this.moduleVersion = this.caller.moduleVersion;

	if (this.modifying) {
		return window.axios
			.put(`${window.hosts.kernel}/dependencies/${this.moduleName}`, JSON.stringify({
				version : this.moduleVersion
			}),
			{
				headers : {
					Authorization : `Bearer ${window.getToken()}`,
					"content-type" : "application/json"
				}
			}).then(() => {
				this.closeForm();
				return this.fetchNodeModules();
			});
	} else {
		return window.axios
			.post(`${window.hosts.kernel}/dependencies`, JSON.stringify({
				name 	: this.moduleName,
				version : this.moduleVersion
			}),
			{
				headers : {
					Authorization : `Bearer ${window.getToken()}`,
					"content-type" : "application/json"
				}
			}).then(() => {
				this.closeForm();
				return this.fetchNodeModules();
			});
	}
};

_nodeModulesController.prototype.runInstall = function() {
	return window.axios
		.request({
			url : `${window.hosts.kernel}/dependencies`,
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			},
			method : 'patch'
		}).then((response) => {
			this.displayResult = true;
			this.resultStdout = response.data.stdout;
			this.resultStderr = response.data.stderr;

			this.refreshState();
		});
};

_nodeModulesController.prototype.hideResult = function() {
	this.displayResult = false;
	this.resultStdout = '';
	this.resultStderr = '';
	this.refreshState();
};

window.NodeModules = {
	template : "#template-nodeModules",
	data 	 : () => {
		return window._nodeModulesControllerInstance.getData();
	},
	mounted  : function() {
		window._nodeModulesControllerInstance.setCaller(this);
		return window._nodeModulesControllerInstance.fetchNodeModules();
	}
};

window._nodeModulesControllerInstance = new _nodeModulesController(window.NodeModules);