const _queueEditorController = function(page) {
	this._page = page;
	this.queue = {};
	this.caller = null;
	this.name = null;
	this.editor = null;
	this.queueMode = true;
	this.error = {
		visible : false
	};
	this.showAlert = false;
};

_queueEditorController.prototype.showHandlerEditor = function() {
	this.queueMode = false;
	this.refreshState();
};

_queueEditorController.prototype.showQueueEditor = function() {
	this.queueMode = true;
	this.refreshState();
};

_queueEditorController.prototype.initEditor = function() {
	//set our editor up
	this.editor = window.ace.edit(document.getElementById("queueEditor"), {
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
			this.saveQueue();
		}
	});
	this.editor.setTheme("ace/theme/twilight");

	this.handlerEditor = window.ace.edit(document.getElementById("handlerEditor"), {
		mode : "ace/mode/javascript",
		selectionStyle : "text"
	});
	this.handlerEditor.commands.addCommand({
		name : "save",
		bindKey : {
			win: "Ctrl-S",
			mac: "Cmd-S"
		},
		exec : () => {
			this.saveQueue();
		}
	});
	this.handlerEditor.setTheme("ace/theme/twilight");
};

_queueEditorController.prototype.initBlankType = function() {
	this.name = null;

	//set the example
	this.editor.setValue(JSON.stringify({
		"name"  		: "myQueue",
		"client_id" 	: "",
		"roles"  		: {
			"needsRole" : true,
			"replace" 	: false,
			"roles" 	: []
		},
		"incoming" 		: {
			"schema" : {
				"type" 			: "object",
				"properties" 	: {
					"hello" 	: {
						"type" 	: "string"
					}
				}
			}
		}
	}, null, 4));

	this.handlerEditor.setValue(`module.exports = function(message) {
	return new Promise((resolve, reject) => {
		console.log(message);
		return resolve("hello world");
	});
};`);
};

_queueEditorController.prototype.setCaller = function(caller) {
	this.caller = caller;
}

_queueEditorController.prototype.getData = function() {
	return {
		queue 		: this.queue,
		error 		: this.error,
		showAlert 	: this.showAlert,
		queueMode 	: this.queueMode
	};
};

_queueEditorController.prototype.refreshState = function() {
	this.caller.queue 		= this.queue;
	this.caller.error 		= this.error;
	this.caller.showAlert 	= this.showAlert;
	this.caller.queueMode 	= this.queueMode;
	this.caller.$forceUpdate();
};

_queueEditorController.prototype.fetchQueue = function(name) {
	this.name = name;
	return window.axios
		.get(`${window.hosts.kernel}/queues/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.queue = response.data;
			this.editor.setValue(JSON.stringify(response.data, null, 4));
			this.refreshState();
		});
};

_queueEditorController.prototype.saveQueue = function() {
	var parsed = JSON.parse(this.editor.getValue());

	if (this.name) {
		return window.axios.put(`${window.hosts.kernel}/queues/${this.name}/handler`, JSON.stringify({ payload : this.handlerEditor.getValue() }), {
			headers: {
				"Content-Type": "application/json",
				Authorization : `Bearer ${window.getToken()}`
			}
		}).then(() => {
			return window.axios.put(`${window.hosts.kernel}/queues/${this.name}`, this.editor.getValue(), {
				headers: {
					"Content-Type": "application/json",
					Authorization : `Bearer ${window.getToken()}`
				}
			});
		}).then((response) => {
			this.error.visible = false;
			this.showAlert = true;
			this.refreshState();

			setTimeout(() => {
				this.showAlert = false;
				this.refreshState();
			}, 1500);
		}).catch((err) => {
			this.error = {
				visible 	: true,
				title 		: "Error saving queue",
				description : err.toString()
			};

			this.refreshState();
		});
	} else {
		return window.axios
			.post(`${window.hosts.kernel}/queues`, this.editor.getValue(), {
				headers: {
					"Content-Type": "application/json",
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				//set our name
				this.name = parsed.name;
				return window.axios.put(`${window.hosts.kernel}/queues/${this.name}/handler`, JSON.stringify({ payload : this.handlerEditor.getValue() }), {
					headers: {
						"Content-Type": "application/json",
						Authorization : `Bearer ${window.getToken()}`
					}
				});
			}).then(() => {
				location.href = "/#/messaging/editor/" + this.name;

				this.error.visible = false;
				this.showAlert = true;
				this.refreshState();

				setTimeout(() => {
					this.showAlert = false;
					this.refreshState();
				}, 1500);
			}).catch((err) => {
				this.error = {
					visible 	: true,
					title 		: "Error saving queue",
					description : err.toString()
				};

				this.refreshState();
			});
	}
};

window.QueueEditor = {
	template : "#template-queueEditor",
	data 	 : () => {
		return _queueEditorInstance.getData();
	},
	mounted  : function() {
		window._queueEditorInstance.setCaller(this);
		window._queueEditorInstance.initEditor();
		if (this.$route.params.name === ".new") {
			window._queueEditorInstance.initBlankType();
			return null;
		}

		return window._queueEditorInstance.fetchQueue(this.$route.params.name);
	}
};

window._queueEditorInstance = new _queueEditorController(window.QueueEditor);