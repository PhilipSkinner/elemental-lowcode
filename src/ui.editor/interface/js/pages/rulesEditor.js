const _rulesEditorController = function(page) {
    this._page = page;
    this.ruleset = {};
    this.caller = null;
    this.name = null;
    this.editor = null;
    this.showAlert = false;
    this.error = {
        visible : false
    };
    this.navitems = [];
    this.loading = true;
};

_rulesEditorController.prototype.setLoading = function() {
    this.loading = true;
};

_rulesEditorController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_rulesEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById('ruleEditor'), {
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
            this.saveRule();
        }
    });
    this.editor.setTheme('ace/theme/twilight');
};

_rulesEditorController.prototype.initBlankType = function() {
    this.name = null;

    this.ruleset = {
        name : 'untitled',
        roles : {
            replace : {
                exec : false
            },
            exec : [],
            needsRole : {
                exec : true
            }
        },
        facts : {
            type : 'object',
            properties : {
                value : {
                    type : 'string'
                }
            }
        },
        rules : [
            {
                comparitors : [
                    {
                        input : '$.value',
                        operator : 'eq',
                        value : 'hello'
                    }
                ],
                output : 'world'
            }
        ]
    };

    //set the example
    this.editor.setValue(JSON.stringify(this.ruleset, null, 4));

    this.navitems = [];
    this.setLoaded();
    this.forceRefresh();
};

_rulesEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_rulesEditorController.prototype.getData = function() {
    return {
        name            : this.name,
        ruleset         : this.ruleset,
        showAlert       : this.showAlert,
        error           : this.error,
        navitems        : this.navitems,
        loading         : this.loading,
    }
};

_rulesEditorController.prototype.forceRefresh = function() {
    this.caller.name        = this.name;
    this.caller.ruleset     = this.ruleset;
    this.caller.showAlert   = this.showAlert;
    this.caller.error       = this.error;
    this.caller.navitems    = this.navitems;
    this.caller.loading     = this.loading;

    this.caller.$forceUpdate();
};

_rulesEditorController.prototype.setNavItems = function() {
    this.navitems = [
        {
            name            : 'Documentation',
            selected        : false,
            route_name      : 'rulesetDetails',
            route_params    : {
                name : this.name
            }
        },
        {
            name            : 'Modify',
            selected        : true,
            route_name      : 'rulesetEditor',
            route_params    : {
                name : this.name
            }
        }
    ];
};

_rulesEditorController.prototype.fetchType = function(name) {
    this.name = name;

    this.setNavItems();

    return window.axiosProxy
        .get(`${window.hosts.kernel}/rules/${name}`)
        .then((response) => {
            this.ruleset = response.data;
            this.editor.setValue(JSON.stringify(response.data, null, 4));

            this.setLoaded();
            this.forceRefresh();
        });
};

_rulesEditorController.prototype.saveRule = function() {
    this.setLoading();

    var parsed = JSON.parse(this.editor.getValue());

    this.ruleset = parsed;

    if (this.name) {
        return window.axiosProxy
            .put(`${window.hosts.kernel}/rules/${this.name}`, this.editor.getValue(), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                this.error.visible = false;
                this.showAlert = true;

                if (this.name !== this.ruleset.name) {
                    location.href = '/#/rulesets/editor/' + this.ruleset.name;
                    this.name = this.ruleset.name;
                    this.setNavItems();
                }

                this.setLoaded();
                this.forceRefresh();

                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();
                }, 1500);
            }).catch((err) => {
                this.error = {
                    visible     : true,
                    title       : 'Error saving ruleset',
                    description : err.toString(),
                };

                this.setLoaded();
                this.forceRefresh();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/rules`, this.editor.getValue(), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                //set our name
                this.name = parsed.name;
                location.href = '/#/rulesets/editor/' + this.name;
                this.setNavItems();

                this.error.visible = false;
                this.showAlert = true;
                this.setLoaded();
                this.forceRefresh();

                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();
                }, 1500);
            }).catch((err) => {
                this.error = {
                    visible     : true,
                    title       : 'Error saving ruleset',
                    description : err.toString(),
                };

                this.setLoaded();
                this.forceRefresh();
            });
    }
};

window.RulesEditor = {
    template : '#template-rulesEditor',
    data 	 : () => {
        return _rulesEditorInstance.getData();
    },
    mounted  : function() {
        window._rulesEditorInstance.initEditor();
        if (this.$route.params.name === '.new') {
            window._rulesEditorInstance.initBlankType();
            return null;
        }

        return window._rulesEditorInstance.fetchType(this.$route.params.name);
    },
    beforeCreate : function() {
        window._rulesEditorInstance.setCaller(this);
        window._rulesEditorInstance.setLoading();
    }
};

window._rulesEditorInstance = new _rulesEditorController(window.RulesEditor);