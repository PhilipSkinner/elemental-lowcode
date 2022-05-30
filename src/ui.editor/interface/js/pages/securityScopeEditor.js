const _securityScopeEditorController = function(page) {
    this._page = page;    
    this.formVisible = true;
    this.editorVisible = false;
    this.addingClaim = false;
    this.currentClaim = null;
    this.navitems = [
        {
            name        : "Form",
            event       : this.showForm.bind(this),
            selected    : this.formVisible,
        },
        {
            name        : "Editor",
            event       : this.showEditor.bind(this),
            selected    : this.editorVisible,
        }
    ];    
    this.error = {
        visible : false
    };
    this.showAlert = false;
    this.defaultScope = {
        name : "my-scope",
        claims : [
            "claim1",
            "claim2"
        ]
    };
    this.scope = {
        name : "",
        claims : []
    };
};

_securityScopeEditorController.prototype.cancelAddClaim = function() {
    this.addingClaim = false;
    this.currentClaim = null;
    this.forceRefresh();
};

_securityScopeEditorController.prototype.saveClaim = function() {
    this.scope.claims.push(this.caller.currentClaim);
    this.addingClaim = false
    this.currentClaim = null;
    this.forceRefresh();
    this.refreshEditorState();
};

_securityScopeEditorController.prototype.addClaim = function() {
    this.addingClaim = true;
    this.currentClaim = null;
    this.forceRefresh();
};

_securityScopeEditorController.prototype.removeClaim = function(name) {
    this.scope.claims = this.scope.claims.reduce((sum, a) => {
        if (a !== name) {
            sum.push(a);
        }
        return sum;
    }, []);

    this.refreshEditorState();
};

_securityScopeEditorController.prototype.showForm = function() {
    this.navitems[0].selected = true;
    this.navitems[1].selected = false;
    this.formVisible = true;
    this.editorVisible = false;    

    this.scope = JSON.parse(this.editor.getValue());

    this.forceRefresh();
};

_securityScopeEditorController.prototype.refreshEditorState = function() {
    this.editor.setValue(JSON.stringify(this.scope, null, 4));
}

_securityScopeEditorController.prototype.showEditor = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = true;
    this.formVisible = false;
    this.editorVisible = true;

    this.refreshEditorState();

    this.forceRefresh();
};

_securityScopeEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById("scopeEditor"), {
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

_securityScopeEditorController.prototype.initBlankType = function() {
    this.name = null;
    this.scope = JSON.parse(JSON.stringify(this.defaultScope));
    this.forceRefresh();
    this.refreshEditorState();
};

_securityScopeEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_securityScopeEditorController.prototype.getData = function() {
    return {
        showAlert       : this.showAlert,
        error           : this.error,        
        navitems        : this.navitems,
        formVisible     : this.formVisible,
        editorVisible   : this.editorVisible,
        scope           : this.scope,
        addingClaim     : this.addingClaim,
        currentClaim    : this.currentClaim,
    };
};

_securityScopeEditorController.prototype.forceRefresh = function() {
    this.caller.showAlert = this.showAlert;
    this.caller.error = this.error;
    this.caller.navitems = this.navitems;
    this.caller.formVisible = this.formVisible;
    this.caller.editorVisible = this.editorVisible;    
    this.caller.scope = this.scope;
    this.caller.addingClaim = this.addingClaim;
    this.caller.currentClaim = this.currentClaim;
    this.refreshEditorState();
    
    this.caller.$forceUpdate();
};

_securityScopeEditorController.prototype.fetchScope = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/scopes/${name}`)
        .then((response) => {
            this.scope = response.data;            
            
            this.forceRefresh();
        });
};

_securityScopeEditorController.prototype.removeOldVersion = function() {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/security/scopes/${this.name}`);
};

_securityScopeEditorController.prototype.save = function() {
    if (this.formVisible) {
        this.refreshEditorState();
    } else {
        this.scope = JSON.parse(this.editor.getValue());
    }

    var data = this.editor.getValue();    
    
    if (this.name) {
        if (this.name !== this.scope.name) {
            //we must remove the old one before we save
            return this.removeOldVersion().then(() => {
                this.name = this.scope.name;
                return this.save();
            });
        }

        return window.axiosProxy
            .put(`${window.hosts.kernel}/security/scopes/${this.name}`, data, {
                headers : {
                    "Content-Type" : "application/json",
                }
            })
            .then((response) => {
                this.caller.showAlert = true;
                location.href = `/#/security/scope/${this.name}`;
                this.caller.$forceUpdate();

                setTimeout(() => {
                    this.caller.showAlert = false;
                    this.caller.$forceUpdate();
                }, 1500);
            }).catch((err) => {
                this.error = {
                    visible : true,
                    title : "Error saving scope",
                    description : err.toString()
                };                

                this.forceRefresh();                
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/security/scopes`, data, {
                headers : {
                    "Content-Type" : "application/json",
                }
            })
            .then((response) => {
                this.name = this.scope.name;
                location.href = `/#/security/scope/${this.name}`;

                this.showAlert = true;
                this.forceRefresh();
                
                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();
                }, 1500);
            }).catch((err) => {
                this.error = {
                    visible : true,
                    title : "Error saving scope",
                    description : err.toString()
                };
                
                this.forceRefresh();
            });
    }
};

window.SecurityScopeEditor = {
    template : "#template-securityScopeEditor",
    data 	 : () => {
        return window._securityScopeEditorControllerInstance.getData();
    },
    mounted  : function() {
        window._securityScopeEditorControllerInstance.setCaller(this);
        window._securityScopeEditorControllerInstance.initEditor();
        if (this.$route.params.name === ".new") {
            window._securityScopeEditorControllerInstance.initBlankType();
            return null;
        }

        return window._securityScopeEditorControllerInstance.fetchScope(this.$route.params.name);
    }
};

window._securityScopeEditorControllerInstance = new _securityScopeEditorController(window.SecurityScopeEditor);