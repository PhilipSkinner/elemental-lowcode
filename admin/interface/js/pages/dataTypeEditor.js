const _dataTypeEditorController = function(page) {
	this._page = page;
	this.dataType = {};
	this.caller = null;
	this.name = null;
	this.editor = null;
	this.data = {
		dataType 	: this.dataType,
		showAlert 	: false,
		error 	 	: {
			visible : false
		}
	};
};

_dataTypeEditorController.prototype.initEditor = function() {
	//set our editor up
	this.editor = window.ace.edit(document.getElementById("typeEditor"), {
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
			this.saveType();
		}
	});
	this.editor.setTheme("ace/theme/twilight");
};

_dataTypeEditorController.prototype.initBlankType = function() {
	this.name = null;

	//set the example
	this.editor.setValue(JSON.stringify({
		name : "typeName",
		keys : [],
		roles : {
			replace : {
				read : false,
				write : false,
				delete : false
			},
			needsRole : {
				read : true,
				write : true,
				delete : true
			},
			read : [],
			write : [],
			delete : []
		},
		schema : {
			"type" : "object",
			"properties" : {
				"hello" : {
					"type" : "string"
				}
			}
		}
	}, null, 4));
};

_dataTypeEditorController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_dataTypeEditorController.prototype.getData = function() {
	return this.data;
};

_dataTypeEditorController.prototype.fetchType = function(name) {
	this.name = name;
	return window.axios
		.get("http://localhost:8001/data/types/" + name, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.dataTypes = response.data;
			this.caller.dataType = response.data;
			this.caller.$forceUpdate();

			this.editor.setValue(JSON.stringify(response.data, null, 4));
		});
};

_dataTypeEditorController.prototype.saveType = function() {
	var parsed = JSON.parse(this.editor.getValue());

	if (this.name) {
		return window.axios
			.put("http://localhost:8001/data/types/" + this.name, this.editor.getValue(), {
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
				this.data.error.title = "Error saving datatype";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	} else {
		return window.axios
			.post("http://localhost:8001/data/types", this.editor.getValue(), {
				headers: {
					"Content-Type": "application/json",
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				//set our name
				this.name = parsed.name;
				location.href = "/#/data/editor/" + this.name;

				this.data.error.visible = false;
				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				this.data.error.visible = true;
				this.data.error.title = "Error saving datatype";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	}

};

window.DataTypeEditor = {
	template : "#template-dataTypeEditor",
	data 	 : () => {
		return window._dataTypeEditorInstance.getData();
	},
	mounted  : function() {
		window._dataTypeEditorInstance.setCaller(this);
		window._dataTypeEditorInstance.initEditor();
		if (this.$route.params.type === ".new") {
			window._dataTypeEditorInstance.initBlankType();
			return null;
		}

		return window._dataTypeEditorInstance.fetchType(this.$route.params.type);
	}
};

window._dataTypeEditorInstance = new _dataTypeEditorController(window.DataTypeEditor);