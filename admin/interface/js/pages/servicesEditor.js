const _servicesEditorController = function(page) {
	this._page = page;
	this.service = {};
	this.serviceName = "";
	this.caller = null;
	this.name = null;
	this.editor = null;
	this.isNew = true;
	this.data = {
		service 		: this.service,
		serviceName 	: this.serviceName,
		showAlert 		: false,
		isNew 			: this.isNew,
		error 	 		: {
			visible 	: false
		}
	};
};

_servicesEditorController.prototype.initEditor = function() {
	//set our editor up
	this.editor = window.ace.edit(document.getElementById("serviceEditor"), {
		mode : "ace/mode/javascript",
		selectionStyle : "text"
	});
	this.editor.commands.addCommand({
		name : "save",
		bindKey : {
			win: "Ctrl-S",
			mac: "Cmd-S"
		},
		exec : () => {
			this.saveService();
		}
	});
	this.editor.setTheme("ace/theme/twilight");
};

_servicesEditorController.prototype.initBlankType = function() {
	this.serviceName = "";
	this.caller.serviceName = "";
	this.isNew = true;
	this.caller.isNew = true;

	//set the example
	this.editor.setValue(`const myService = function() {

};

myService.prototype.hello = function() {
	return "world";
};

module.exports = myService;`);
};

_servicesEditorController.prototype.setCaller = function(caller) {
	this.caller = caller;
}

_servicesEditorController.prototype.getData = function() {
	return this.data;
};

_servicesEditorController.prototype.fetchService = function(name) {
	this.isNew = false;
	this.caller.isNew = false;

	return window.axios
		.get(`${window.hosts.kernel}/services/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.service = response.data;
			this.serviceName = name;
			this.caller.serviceName = name;
			this.caller.service = response.data;
			this.caller.$forceUpdate();

			this.editor.setValue(response.data);
		});
};

_servicesEditorController.prototype.saveService = function() {
	this.serviceName = this.caller.serviceName;

	if (!this.serviceName) {
		return;
	}

	if (this.serviceName && !this.isNew) {
		return window.axios
			.put(`${window.hosts.kernel}/services/${this.serviceName}`, {
				payload : this.editor.getValue()
			}, {
				headers: {
					"Content-Type": "application/json",
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				this.data.error.visible = false;
				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				this.data.error.visible = true;
				this.data.error.title = "Error saving service";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	} else {
		return window.axios
			.post(`${window.hosts.kernel}/services`, {
					name : this.serviceName,
					payload : this.editor.getValue()
				}, {
				headers: {
					"Content-Type": "application/json",
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				//set our name
				location.href = "/#/services/editor/" + this.serviceName;

				this.data.error.visible = false;
				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				this.data.error.visible = true;
				this.data.error.title = "Error saving service";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	}

};

window.ServicesEditor = {
	template : "#template-servicesEditor",
	data 	 : () => {
		return _servicesEditorInstance.getData();
	},
	mounted  : function() {
		window._servicesEditorInstance.setCaller(this);
		window._servicesEditorInstance.initEditor();
		if (this.$route.params.name === ".new") {
			window._servicesEditorInstance.initBlankType();
			return null;
		}

		return window._servicesEditorInstance.fetchService(this.$route.params.name);
	}
};

window._servicesEditorInstance = new _servicesEditorController(window.ServicesEditor);