const _securityUserEditorController = function(page) {
    this._page = page;
    this.showAlert = false;
    this.error = {
        visible : false
    };    
    this.formVisible = true;
    this.editorVisible = false;
    this.enteringPassword = false;
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
    this.user = {};
};

_securityUserEditorController.prototype.closeError = function() {    
    _securityUserEditorControllerInstance.error.visible = false;
    _securityUserEditorControllerInstance.forceRefresh();
};

_securityUserEditorController.prototype.clearPassword = function() {
    this.enteringPassword = true;
    this.user.password = "";
    this.forceRefresh();
};

_securityUserEditorController.prototype.addClaim = function() {
    this.addingClaim = true;
    this.currentClaim = {};
    this.forceRefresh();
};

_securityUserEditorController.prototype.cancelAddClaim = function() {
    this.addingClaim = false;
    this.currentClaim = {};
    this.forceRefresh();
};

_securityUserEditorController.prototype.saveClaim = function() {
    if (typeof(this.user.claims[this.caller.currentClaim.name]) === "undefined") {
        this.user.claims[this.caller.currentClaim.name] = [];
    }
    this.user.claims[this.caller.currentClaim.name].push(this.caller.currentClaim.value);

    this.addingClaim = false;
    this.currentClaim = {};
    this.forceRefresh();
};

_securityUserEditorController.prototype.removeClaim = function(name, value) {
    this.user.claims = Object.keys(this.user.claims).reduce((sum, a) => {
        if (a !== name) {
            sum[a] = this.user.claims[a];
        } else {
            var newValues = this.user.claims[a].reduce((claims, b) => {
                if (b !== value) {
                    claims.push(b);
                }

                return claims;
            }, []);

            if (newValues.length > 0) {
                sum[a] = newValues;
            }
        }

        return sum;
    }, {});

    this.refreshEditorState();
};

_securityUserEditorController.prototype.userClaims = function() {
    return Object.keys(this.user.claims || {}).reduce((sum, key) => { 
        if (!Array.isArray(this.user.claims[key])) {
            this.user.claims[key] = [this.user.claims[key]];
        }

        return sum.concat(this.user.claims[key].map((m) => { 
            return { name : key, value : m } 
        })); 
    }, []);
};

_securityUserEditorController.prototype.showForm = function() {
    this.navitems[0].selected = true;
    this.navitems[1].selected = false;
    this.formVisible = true;
    this.editorVisible = false;    

    this.user = JSON.parse(this.editor.getValue());

    this.forceRefresh();
};

_securityUserEditorController.prototype.showEditor = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = true;
    this.formVisible = false;
    this.editorVisible = true;

    this.refreshEditorState();

    this.forceRefresh();
};

_securityUserEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById("userEditor"), {
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

_securityUserEditorController.prototype.initBlankType = function() {
    this.name = null;
    this.id = null;
    this.enteringPassword = true;
    this.user = JSON.parse(JSON.stringify({
        username    : "username",
        password    : "",
        registered  : new Date(),
        claims      : {
            name  : "User Name",
            roles : [

            ]
        }
    }));    

    this.forceRefresh();
};

_securityUserEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_securityUserEditorController.prototype.getData = function() {
    return {
        showAlert           : this.showAlert,
        error               : this.error,
        formVisible         : this.formVisible,
        editorVisible       : this.editorVisible,
        addingClaim         : this.addingClaim,
        currentClaim        : this.currentClaim,
        navitems            : this.navitems,
        user                : this.user,
        enteringPassword    : this.enteringPassword
    };
};

_securityUserEditorController.prototype.forceRefresh = function() {
    this.caller.showAlert           = this.showAlert;
    this.caller.error               = this.error;
    this.caller.formVisible         = this.formVisible;
    this.caller.editorVisible       = this.editorVisible;
    this.caller.addingClaim         = this.addingClaim;
    this.caller.currentClaim        = this.currentClaim;
    this.caller.navitems            = this.navitems;
    this.caller.user                = this.user;
    this.caller.enteringPassword    = this.enteringPassword;
    this.refreshEditorState();

    this.caller.$forceUpdate();
};

_securityUserEditorController.prototype.refreshEditorState = function() {
    this.editor.setValue(JSON.stringify(this.user, null, 4));
}

_securityUserEditorController.prototype.fetchUser = function(id) {
    this.id = id;    
    return window.axiosProxy
        .get(`${window.hosts.identity}/api/users/${id}`)
        .then((response) => {
            this.user = response.data;
            this.enteringPassword = false;
            
            this.forceRefresh();        
        });
};

_securityUserEditorController.prototype.save = function() {
    if (this.formVisible) {
        this.refreshEditorState();
    } else {
        this.user = JSON.parse(this.editor.getValue());
    }

    var data = this.editor.getValue();

    if (this.id) {
        return window.axiosProxy
            .put(`${window.hosts.identity}/api/users/${this.id}`, data, {
                headers : {
                    "Content-Type" : "application/json",
                }
            })
            .then((response) => {
                this.showAlert = true;
                this.forceRefresh();

                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();
                }, 1500);
            }).catch((err) => {
                this.error = {
                    visible     : true,
                    title       : "Error saving user",
                    description : err.toString()
                };
                
                this.forceRefresh();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.identity}/api/users`, data, {
                headers : {
                    "Content-Type" : "application/json",
                }
            })
            .then((response) => {
                this.id = response.headers.location.split("/").slice(-1);
                location.href = `/#/security/user/${this.id}`;        

                this.showAlert = true;
                this.forceRefresh();                

                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();                
                }, 1500);

                return window._securityUserEditorControllerInstance.fetchUser(this.id);
            }).catch((err) => {                
                this.error = {
                    visible     : true,
                    title       : "Error saving user",
                    description : err.response && err.response.data ? window.axiosProxy.generateErrorMessage(err.response.data) : err.toString()
                };
                
                this.forceRefresh();
            });
    }
};

window.SecurityUserEditor = {
    template : "#template-securityUserEditor",
    data 	 : () => {
        return window._securityUserEditorControllerInstance.getData();
    },
    mounted  : function() {
        window._securityUserEditorControllerInstance.setCaller(this);
        window._securityUserEditorControllerInstance.initEditor();
        if (this.$route.params.name === ".new") {
            window._securityUserEditorControllerInstance.initBlankType();
            return null;
        }

        return window._securityUserEditorControllerInstance.fetchUser(this.$route.params.name);
    }
};

window._securityUserEditorControllerInstance = new _securityUserEditorController(window.SecurityUserEditor);