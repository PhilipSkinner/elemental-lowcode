const _integrationsEditorController = function(page) {
	this._page = page;
	this.integrations = {};
	this.caller = null;
	this.name = null;
	this.editor = null;
	this.data = {
		integration 	: this.integration,
		showAlert 		: false,
		error 	 		: {
			visible 	: false
		}
	};
};

_integrationsEditorController.prototype.initEditor = function() {
	//set our editor up
	this.editor = ace.edit(document.getElementById('integrationEditor'), {
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
			this.saveIntegration();
		}
	});
	this.editor.setTheme('ace/theme/twilight');
};

_integrationsEditorController.prototype.initBlankType = function() {
	this.name = null;

	//set the example
	this.editor.setValue(JSON.stringify({
		"name" : "exampleGetRequest",
    	"method": "get",
    	"variables": [
        	{
            	"name": "id",
            	"type": "queryParam",
            	"description": "The ID of the post to fetch"
        	}
    	],
	    "request": {
	        "uri": "https://jsonplaceholder.typicode.com/posts/$(id)",
	        "method": "get",
	        "schema": {
	            "type": "JSON",
	            "value": {
	                "type": "object",
	                "properties": {
	                    "userId": {
	                        "type": "integer"
	                    },
	                    "id": {
	                        "type": "integer"
	                    },
	                    "title": {
	                        "type": "string"
	                    },
	                    "body": {
	                        "type": "string"
	                    }
	                },
	                "required": [
	                    "userId",
	                    "id",
	                    "title",
	                    "body"
	                ]
	            }
	        }
	    },
	    "transformer": "(input) => { return input; }"
	}, null, 4));
};

_integrationsEditorController.prototype.setCaller = function(caller) {
	this.caller = caller;
}

_integrationsEditorController.prototype.getData = function() {
	return this.data;
};

_integrationsEditorController.prototype.fetchType = function(name) {
	this.name = name;
	return axios
		.get('http://localhost:8001/integrations/' + name)
		.then((response) => {
			this.integration = response.data;
			this.caller.integration = response.data;
			this.caller.$forceUpdate();

			this.editor.setValue(JSON.stringify(response.data, null, 4));
		});
};

_integrationsEditorController.prototype.saveIntegration = function() {
	var parsed = JSON.parse(this.editor.getValue());

	if (this.name) {
		return axios
			.put('http://localhost:8001/integrations/' + this.name, this.editor.getValue(), {headers: {"Content-Type": "application/json"}})
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
				this.data.error.title = "Error saving integration";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	} else {
		return axios
			.post('http://localhost:8001/integrations', this.editor.getValue(), {headers: {"Content-Type": "application/json"}})
			.then((response) => {
				//set our name
				this.name = parsed.name;
				console.log(parsed.name, location.path);
				location.href = "/#/integrations/editor/" + this.name;

				this.caller.showAlert = true;
				this.caller.$forceUpdate();

				setTimeout(() => {
					this.caller.showAlert = false;
					this.caller.$forceUpdate();
				}, 1500);
			}).catch((err) => {
				console.log(err);
				this.data.error.visible = true;
				this.data.error.title = "Error saving integration";
				this.data.error.description = err.toString();

				this.caller.error = this.getData().error;
				this.caller.$forceUpdate();
			});
	}

};

const IntegrationsEditor = {
	template : '#template-integrationsEditor',
	data 	 : () => {
		return _integrationsEditorInstance.getData();
	},
	mounted  : function() {
		_integrationsEditorInstance.setCaller(this);
		_integrationsEditorInstance.initEditor();
		if (this.$route.params.name === ".new") {
			_integrationsEditorInstance.initBlankType();
			return;
		}

		return _integrationsEditorInstance.fetchType(this.$route.params.name);
	}
};

const _integrationsEditorInstance = new _integrationsEditorController(IntegrationsEditor);