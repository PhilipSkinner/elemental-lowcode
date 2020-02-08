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
	this.editor = ace.edit(document.getElementById('ruleEditor'), {
		mode : 'ace/mode/json',
		selectionStyle : 'text'
	});
	this.editor.commands.addCommand({
		name : 'save',
		bindKey : {
			win: "Ctrl-S",
			mac: "Cmd-S"
		},
		exec : () => {
			this.saveRule();
		}
	});
	this.editor.setTheme('ace/theme/twilight');
};

_rulesEditorController.prototype.initBlankType = function() {
	this.name = null;

	//set the example
	this.editor.setValue(JSON.stringify({
		"name" : "basic",
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
	return axios
		.get('http://localhost:8001/rules/' + name)
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
		return axios
			.put('http://localhost:8001/rules/' + this.name, this.editor.getValue(), {headers: {"Content-Type": "application/json"}})
			.then((response) => {
				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				console.log(err);
				this.data.error.visible = true;
				this.data.error.title = "Error saving ruleset";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	} else {
		return axios
			.post('http://localhost:8001/rules', this.editor.getValue(), {headers: {"Content-Type": "application/json"}})
			.then((response) => {
				//set our name
				this.name = parsed.name;
				console.log(parsed.name, location.path);
				location.href = "/#/rulesets/editor/" + this.name;

				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				console.log(err);
				this.data.error.visible = true;
				this.data.error.title = "Error saving ruleset";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	}

};

const RulesEditor = {
	template : '#template-rulesEditor',
	data 	 : () => {
		return _rulesEditorInstance.getData();
	},
	mounted  : function() {
		_rulesEditorInstance.setCaller(this);
		_rulesEditorInstance.initEditor();
		if (this.$route.params.name === ".new") {
			_rulesEditorInstance.initBlankType();
			return;
		}

		return _rulesEditorInstance.fetchType(this.$route.params.name);
	}
};

const _rulesEditorInstance = new _rulesEditorController(RulesEditor);