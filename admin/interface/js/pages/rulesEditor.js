const _rulesEditorController = function(page) {
	this._page = page;
	this.rule = {};
	this.caller = null;
	this.name = null;
	this.editor = null;
	this.data = {
		integration 	: this.rule,
		showAlert 		: false,
		error 	 		: {
			visible 	: false
		}
	};
};

_rulesEditorController.prototype.initEditor = function() {
	//set our editor up
	this.editor = window.ace.edit(document.getElementById("ruleEditor"), {
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
			this.saveRule();
		}
	});
	this.editor.setTheme("ace/theme/twilight");
};

_rulesEditorController.prototype.initBlankType = function() {
	this.name = null;

	//set the example
	this.editor.setValue(JSON.stringify({
		"name" : "basic",
		"roles" : {
			"replace" : {
				"exec" : false
			},
			"exec" : [],
			"needsRole" : {
				"exec" : true
			}
		},
		"facts" : {
			"type" : "object",
			"properties" : {
				"value" : {
					"type" : "string"
				}
			}
		},
		"rules" : [
			{
				"comparitors" : [
					{
						"input" : "$.value",
						"operator" : "eq",
						"value" : "hello"
					}
				],
				"output" : "world"
			}
		]
	}, null, 4));
};

_rulesEditorController.prototype.setCaller = function(caller) {
	this.caller = caller;
}

_rulesEditorController.prototype.getData = function() {
	return this.data;
};

_rulesEditorController.prototype.fetchType = function(name) {
	this.name = name;
	return window.axios
		.get(`${window.hosts.kernel}/rules/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.rule = response.data;
			this.caller.rule = response.data;
			this.caller.$forceUpdate();

			this.editor.setValue(JSON.stringify(response.data, null, 4));
		});
};

_rulesEditorController.prototype.saveRule = function() {
	var parsed = JSON.parse(this.editor.getValue());

	if (this.name) {
		return window.axios
			.put(`${window.hosts.kernel}/rules/${this.name}`, this.editor.getValue(), {
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
				this.data.error.title = "Error saving ruleset";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	} else {
		return window.axios
			.post(`${window.hosts.kernel}/rules`, this.editor.getValue(), {
				headers: {
					"Content-Type": "application/json",
					Authorization : `Bearer ${window.getToken()}`
				}
			})
			.then((response) => {
				//set our name
				this.name = parsed.name;
				location.href = "/#/rulesets/editor/" + this.name;

				this.data.error.visible = false;
				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				this.data.error.visible = true;
				this.data.error.title = "Error saving ruleset";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	}

};

window.RulesEditor = {
	template : "#template-rulesEditor",
	data 	 : () => {
		return _rulesEditorInstance.getData();
	},
	mounted  : function() {
		window._rulesEditorInstance.setCaller(this);
		window._rulesEditorInstance.initEditor();
		if (this.$route.params.name === ".new") {
			window._rulesEditorInstance.initBlankType();
			return null;
		}

		return window._rulesEditorInstance.fetchType(this.$route.params.name);
	}
};

window._rulesEditorInstance = new _rulesEditorController(window.RulesEditor);