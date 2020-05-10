const _securityClientEditorController = function(page) {
	this._page = page;
	this.data = {
		showAlert : false,
		error 	  : {
			visible : false
		}
	};
};

_securityClientEditorController.prototype.initEditor = function() {
	//set our editor up
	this.editor = window.ace.edit(document.getElementById("clientEditor"), {
		mode : "ace/mode/json",
		selectionStyle : "text"
	});
	this.editor.commands.addCommand({
		name : "save",
		bindKey : {
			win: "Ctrl-S",
			mac: "Cmd-S"
		},
		exec : () => {
			this.save();
		}
	});
	this.editor.setTheme("ace/theme/twilight");
};

_securityClientEditorController.prototype.initBlankType = function() {
	this.name = null;

	//set the example
	this.editor.setValue(JSON.stringify({
		client_id : "my-client",
		client_secret : "my really secret secret",
		scope : "openid roles",
		redirect_uris : [
			`${window.hosts.interface}/callback`
		]
	}, null, 4));
};

_securityClientEditorController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_securityClientEditorController.prototype.getData = function() {
	return this.data;
};

_securityClientEditorController.prototype.fetchClient = function(name) {
	this.name = name;
	return window.axios
		.get(`${window.hosts.kernel}/security/clients/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.client = response.data;
			this.caller.client = this.client;
			this.caller.$forceUpdate();

			this.editor.setValue(JSON.stringify(response.data, null, 4));
		});
};

_securityClientEditorController.prototype.save = function() {
	var parsed = JSON.parse(this.editor.getValue());

	if (this.name) {
		return window.axios
			.put(`${window.hosts.kernel}/security/clients/${this.name}`, this.editor.getValue(), {
				headers : {
					"Content-Type" : "application/json",
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				this.data.error.visible = true;
				this.data.error.title = "Error saving client";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	} else {
		return window.axios
			.post(`${window.hosts.kernel}/security/clients`, this.editor.getValue(), {
				headers : {
					"Content-Type" : "application/json",
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				this.name = parsed.client_id;
				location.href = `/#/security/client/${this.name}`;
				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				this.data.error.visible = true;
				this.data.error.title = "Error saving client";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	}
};

window.SecurityClientEditor = {
	template : "#template-securityClientEditor",
	data 	 : () => {
		return window._securityClientEditorControllerInstance.getData();
	},
	mounted  : function() {
		window._securityClientEditorControllerInstance.setCaller(this);
		window._securityClientEditorControllerInstance.initEditor();
		if (this.$route.params.id === ".new") {
			window._securityClientEditorControllerInstance.initBlankType();
			return null;
		}

		return window._securityClientEditorControllerInstance.fetchClient(this.$route.params.id);
	}
};

window._securityClientEditorControllerInstance = new _securityClientEditorController(window.SecurityClientEditor);