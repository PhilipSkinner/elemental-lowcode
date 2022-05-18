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
    this.editor = window.ace.edit(document.getElementById('integrationEditor'), {
        mode : 'ace/mode/json',
        selectionStyle : 'text'
    });
    this.editor.commands.addCommand({
        name : 'save',
        bindKey : {
            win: 'Ctrl-S',
            mac: 'Cmd-S'
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
        'name' : 'exampleGetRequest',
        'description' : 'Get a single post from our example third party system. ',
        'method': 'get',
        'variables': [
            {
                'name': 'id',
                'type': 'queryParam',
                'description': 'The ID of the post to fetch'
            }
        ],
        'roles' : {
            'replace' : {
                'exec' : false
            },
            'exec' : [],
            'needsRole' : {
                'exec' : true
            }
        },
        'request': {
            'uri': 'https://jsonplaceholder.typicode.com/posts/$(id)',
            'method': 'get',
            'schema': {
                'type': 'JSON',
                'value': {
                    'type': 'object',
                    'properties': {
                        'userId': {
                            'type': 'integer'
                        },
                        'id': {
                            'type': 'integer'
                        },
                        'title': {
                            'type': 'string'
                        },
                        'body': {
                            'type': 'string'
                        }
                    },
                    'required': [
                        'userId',
                        'id',
                        'title',
                        'body'
                    ]
                }
            }
        },
        'transformer': '(input) => { return input; }'
    }, null, 4));
};

_integrationsEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_integrationsEditorController.prototype.getData = function() {
    return this.data;
};

_integrationsEditorController.prototype.fetchType = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/integrations/${name}`)
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
        return window.axiosProxy
            .put(`${window.hosts.kernel}/integrations/${this.name}`, this.editor.getValue(), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                this.caller.error.visible = false;
                this.caller.showAlert = true;
                this.caller.$forceUpdate();

                setTimeout(() => {
                    this.caller.showAlert = false;
                    this.caller.$forceUpdate();
                }, 1500);
            }).catch((err) => {
                console.error(err);
                this.data.error.visible = true;
                this.data.error.title = 'Error saving integration';
                this.data.error.description = err.toString();

                this.caller.error = this.getData().error;
                this.caller.$forceUpdate();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/integrations`, this.editor.getValue(), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                //set our name
                this.name = parsed.name;
                location.href = '/#/integrations/editor/' + this.name;

                this.caller.error.visible = false;
                this.caller.showAlert = true;
                this.caller.$forceUpdate();

                setTimeout(() => {
                    this.caller.showAlert = false;
                    this.caller.$forceUpdate();
                }, 1500);
            }).catch((err) => {
                console.error(err);
                this.data.error.visible = true;
                this.data.error.title = 'Error saving integration';
                this.data.error.description = err.toString();

                this.caller.error = this.getData().error;
                this.caller.$forceUpdate();
            });
    }

};

window.IntegrationsEditor = {
    template : '#template-integrationsEditor',
    data 	 : () => {
        return window._integrationsEditorInstance.getData();
    },
    mounted  : function() {
        window._integrationsEditorInstance.setCaller(this);
        window._integrationsEditorInstance.initEditor();
        if (this.$route.params.name === '.new') {
            window._integrationsEditorInstance.initBlankType();
            return null;
        }

        return window._integrationsEditorInstance.fetchType(this.$route.params.name);
    }
};

window._integrationsEditorInstance = new _integrationsEditorController(window.IntegrationsEditor);