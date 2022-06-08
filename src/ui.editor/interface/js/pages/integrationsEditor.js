const _integrationsEditorController = function(page) {
    this._page = page;
    this.integration = {};
    this.caller = null;
    this.name = null;
    this.editor = null;
    this.showAlert = false;
    this.error = {
        visible : false
    };
    this.loading = true;
};

_integrationsEditorController.prototype.setLoading = function() {
    this.loading = true;
};

_integrationsEditorController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_integrationsEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById("integrationEditor"), {
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
            this.saveIntegration();
        }
    });
    this.editor.setTheme("ace/theme/twilight");
};

_integrationsEditorController.prototype.initBlankType = function() {
    this.name = null;

    this.integration = {
        name : "exampleGetRequest",
        description : "Get a single post from our example third party system. ",
        method: "get",
        body : {},
        queryParams: [
            {
                name: "id",
                type: "queryParam",
                description: "The ID of the post to fetch"
            }
        ],
        roles : {
            replace : {
                exec : false
            },
            exec : [],
            needsRole : {
                exec : true
            }
        },
        request: {
            uri: "https://jsonplaceholder.typicode.com/posts/$(id)",
            method: "get",
            schema: {
                type: "JSON",
                value: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "integer"
                        },
                        id: {
                            type: "integer"
                        },
                        title: {
                            type: "string"
                        },
                        body: {
                            type: "string"
                        }
                    },
                    required: [
                        "userId",
                        "id",
                        "title",
                        "body"
                    ]
                }
            }
        },
        transformer: "(input) => { return input; }"
    };

    //set the example
    this.editor.setValue(JSON.stringify(this.integration, null, 4));

    this.navitems = [];
    this.setLoaded();
    this.forceRefresh();
};

_integrationsEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_integrationsEditorController.prototype.getData = function() {
    return {
        integration : this.integration,
        name        : this.name,
        showAlert   : this.showAlert,
        error       : this.error,
        loading     : this.loading,
        navitems    : this.navitems,
    };
};

_integrationsEditorController.prototype.forceRefresh = function() {
    this.caller.integration = this.integration;
    this.caller.name        = this.name;
    this.caller.showAlert   = this.showAlert;
    this.caller.error       = this.error;
    this.caller.loading     = this.loading;
    this.caller.navitems    = this.navitems;

    this.caller.$forceUpdate();
};

_integrationsEditorController.prototype.setNavItems = function() {
    this.navitems = [
        {
            name            : "Documentation",
            selected        : false,
            route_name      : "integrationDetails",
            route_params    : {
                name : this.name
            }
        },
        {
            name            : "Modify",
            selected        : true,
            route_name      : "integrationEditor",
            route_params    : {
                name : this.name
            }
        }
    ];
};

_integrationsEditorController.prototype.fetchType = function(name) {
    this.name = name;
    this.setNavItems();

    return window.axiosProxy
        .get(`${window.hosts.kernel}/integrations/${name}`)
        .then((response) => {
            this.integration = response.data;
            this.editor.setValue(JSON.stringify(this.integration, null, 4));

            this.setLoaded();
            this.forceRefresh();
        });
};

_integrationsEditorController.prototype.saveIntegration = function() {
    this.setLoading();

    var parsed = JSON.parse(this.editor.getValue());
    this.integration = parsed;

    if (this.name) {
        return window.axiosProxy
            .put(`${window.hosts.kernel}/integrations/${this.name}`, this.editor.getValue(), {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                this.error.visible = false;
                this.showAlert = true;

                if (this.name !== this.integration.name) {
                    location.href = "#/integrations/editor/" + this.integration.name;
                    this.name = this.integration.name;
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
                    visible         : true,
                    title           : "Error saving integration",
                    description     : err.toString(),
                };

                this.setLoaded();
                this.forceRefresh();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/integrations`, this.editor.getValue(), {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                //set our name
                this.name = parsed.name;
                location.href = "/#/integrations/editor/" + this.name;
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
                    visible         : true,
                    title           : "Error saving integration",
                    description     : err.toString(),
                };

                this.setLoaded();
                this.forceRefresh();
            });
    }
};

window.IntegrationsEditor = {
    template : "#template-integrationsEditor",
    data 	 : () => {
        return window._integrationsEditorInstance.getData();
    },
    mounted  : function() {
        window._integrationsEditorInstance.initEditor();
        if (this.$route.params.name === ".new") {
            window._integrationsEditorInstance.initBlankType();
            return null;
        }

        return window._integrationsEditorInstance.fetchType(this.$route.params.name);
    },
    beforeCreate : function() {
        window._integrationsEditorInstance.setCaller(this);
        window._integrationsEditorInstance.setLoading();
    }
};

window._integrationsEditorInstance = new _integrationsEditorController(window.IntegrationsEditor);