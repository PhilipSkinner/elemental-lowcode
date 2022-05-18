const _securityScopeEditorController = function(page) {
    this._page = page;
    this.data = {
        showAlert 	: false,
        error 		: {
            visible : false
        }
    };
};

_securityScopeEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById('scopeEditor'), {
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
            this.save();
        }
    });
    this.editor.setTheme('ace/theme/twilight');
};

_securityScopeEditorController.prototype.initBlankType = function() {
    this.name = null;

    //set the example
    this.editor.setValue(JSON.stringify({
        name : 'my-scope',
        claims : [
            'claim1',
            'claim2'
        ]
    }, null, 4));
};

_securityScopeEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_securityScopeEditorController.prototype.getData = function() {
    return this.data;
};

_securityScopeEditorController.prototype.fetchScope = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/scopes/${name}`)
        .then((response) => {
            this.scope = response.data;
            this.caller.scope = this.scope;
            this.caller.$forceUpdate();

            this.editor.setValue(JSON.stringify(response.data, null, 4));
        });
};

_securityScopeEditorController.prototype.save = function() {
    var parsed = JSON.parse(this.editor.getValue());

    if (this.name) {
        return window.axiosProxy
            .put(`${window.hosts.kernel}/security/scopes/${this.name}`, this.editor.getValue(), {
                headers : {
                    'Content-Type' : 'application/json',
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
                this.data.error.title = 'Error saving scope';
                this.data.error.description = err.toString();

                this.caller.error = this.getData().error;
                this.caller.$forceUpdate();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/security/scopes`, this.editor.getValue(), {
                headers : {
                    'Content-Type' : 'application/json',
                }
            })
            .then((response) => {
                this.name = parsed.name;
                location.href = `/#/security/scope/${this.name}`;
                this.caller.showAlert = true;
                this.caller.$forceUpdate();

                setTimeout(() => {
                    this.caller.showAlert = false;
                    this.caller.$forceUpdate();
                }, 1500);
            }).catch((err) => {
                this.data.error.visible = true;
                this.data.error.title = 'Error saving scope';
                this.data.error.description = err.toString();

                this.caller.error = this.getData().error;
                this.caller.$forceUpdate();
            });
    }
};

window.SecurityScopeEditor = {
    template : '#template-securityScopeEditor',
    data 	 : () => {
        return window._securityScopeEditorControllerInstance.getData();
    },
    mounted  : function() {
        window._securityScopeEditorControllerInstance.setCaller(this);
        window._securityScopeEditorControllerInstance.initEditor();
        if (this.$route.params.name === '.new') {
            window._securityScopeEditorControllerInstance.initBlankType();
            return null;
        }

        return window._securityScopeEditorControllerInstance.fetchScope(this.$route.params.name);
    }
};

window._securityScopeEditorControllerInstance = new _securityScopeEditorController(window.SecurityScopeEditor);