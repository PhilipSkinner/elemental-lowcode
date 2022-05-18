const _securityUserEditorController = function(page) {
    this._page = page;
    this.data = {
        showAlert : false,
        error 	  : {
            visible : false
        }
    };
};

_securityUserEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById('userEditor'), {
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

_securityUserEditorController.prototype.initBlankType = function() {
    this.name = null;
    this.id = null;

    //set the example
    this.editor.setValue(JSON.stringify({
        username 	: 'username',
        password 	: 'password',
        registered 	: new Date(),
        claims 		: {
            name  : 'User Name',
            roles : [

            ]
        }
    }, null, 4));
};

_securityUserEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_securityUserEditorController.prototype.getData = function() {
    return this.data;
};

_securityUserEditorController.prototype.fetchUser = function(id) {
    this.id = id;
    return window.axiosProxy
        .get(`${window.hosts.identity}/api/users/${id}`)
        .then((response) => {
            this.user = response.data;
            this.caller.user = this.user;
            this.caller.$forceUpdate();

            this.editor.setValue(JSON.stringify(response.data, null, 4));
        });
};

_securityUserEditorController.prototype.save = function() {
    var parsed = JSON.parse(this.editor.getValue());

    if (this.id) {
        return window.axiosProxy
            .put(`${window.hosts.identity}/api/users/${this.id}`, this.editor.getValue(), {
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
                this.data.error.title = 'Error saving user';
                this.data.error.description = err.toString();

                this.caller.error = this.getData().error;
                this.caller.$forceUpdate();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.identity}/api/users`, this.editor.getValue(), {
                headers : {
                    'Content-Type' : 'application/json',
                }
            })
            .then((response) => {
                this.id = parsed.username;
                location.href = `/#/security/user/${this.id}`;
                this.caller.showAlert = true;
                this.caller.$forceUpdate();

                setTimeout(() => {
                    this.caller.showAlert = false;
                    this.caller.$forceUpdate();
                }, 1500);
            }).catch((err) => {
                this.data.error.visible = true;
                this.data.error.title = 'Error saving user';
                this.data.error.description = err.toString();

                this.caller.error = this.getData().error;
                this.caller.$forceUpdate();
            });
    }
};

window.SecurityUserEditor = {
    template : '#template-securityUserEditor',
    data 	 : () => {
        return window._securityUserEditorControllerInstance.getData();
    },
    mounted  : function() {
        window._securityUserEditorControllerInstance.setCaller(this);
        window._securityUserEditorControllerInstance.initEditor();
        if (this.$route.params.name === '.new') {
            window._securityUserEditorControllerInstance.initBlankType();
            return null;
        }

        return window._securityUserEditorControllerInstance.fetchUser(this.$route.params.name);
    }
};

window._securityUserEditorControllerInstance = new _securityUserEditorController(window.SecurityUserEditor);