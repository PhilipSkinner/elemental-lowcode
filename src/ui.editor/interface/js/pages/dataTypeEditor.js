const _dataTypeEditorController = function(page) {
    this._page = page;
    this.dataType = {
        schema : {
            "type" : "object",
            "properties" : {}
        }
    };
    this.caller = null;
    this.name = null;
    this.editor = null;
    this.showAlert = false,
    this.error = {
        visible : false
    };
    this.navitems = [];
    this.name = "untitled";
    this.sectionVisible = "schemaEditor";
};

_dataTypeEditorController.prototype.showSchemaEditor = function() {
    this.navitems[0].selected = true;
    this.navitems[1].selected = false;
    this.sectionVisible = "schemaEditor";

    this.refreshInternalState();

    this.forceRefresh();
};

_dataTypeEditorController.prototype.showSourceEditor = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = true;
    this.sectionVisible = "sourceEditor";

    this.refreshEditorState();

    this.forceRefresh();
};

_dataTypeEditorController.prototype.refreshInternalState = function() {
    this.dataType = JSON.parse(this.editor.getValue());

    this.forceRefresh();
};

_dataTypeEditorController.prototype.refreshEditorState = function() {
    this.editor.setValue(JSON.stringify(this.dataType, null, 4));
};

_dataTypeEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById("typeEditor"), {
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
            this.saveType();
        }
    });
    this.editor.setTheme("ace/theme/twilight");
};

_dataTypeEditorController.prototype.initBlankType = function() {
    this.name = null;

    //set the example
    this.editor.setValue(JSON.stringify({
        name : "typeName",
        keys : [],
        security : {
            mechanism : "default"
        },
        roles : {
            replace : {
                read : false,
                write : false,
                delete : false
            },
            needsRole : {
                read : true,
                write : true,
                delete : true
            },
            read : [],
            write : [],
            delete : []
        },
        schema : {
            "type" : "object",
            "properties" : {
                "hello" : {
                    "type" : "string"
                }
            }
        }
    }, null, 4));

    this.name = "untitled";
    this.dataType = JSON.parse(this.editor.getValue());
    this.forceRefresh();
};

_dataTypeEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_dataTypeEditorController.prototype.getData = function() {
    return {
        dataType        : this.dataType,
        showAlert       : this.showAlert,
        error           : this.error,
        navitems        : this.navitems,
        name            : this.name,
        schema          : this.dataType.schema,
        sectionVisible  : this.sectionVisible
    };
};

_dataTypeEditorController.prototype.forceRefresh = function() {
    this.caller.dataType = this.dataType;
    this.caller.showAlert = this.showAlert;
    this.caller.error = this.error;
    this.caller.navitems = this.navitems;
    this.caller.name = this.name;
    this.caller.schema = this.dataType.schema;
    this.caller.sectionVisible = this.sectionVisible;

    this.caller.$children.forEach((child) => {
        if (child.$options._componentTag === "s-json-schema-editor") {
            child._data.schemaData = JSON.parse(JSON.stringify(this.dataType.schema));
            child.schemaData = child._data.schemaData;
            child.forceUpdate();
        }
    });

    this.caller.$forceUpdate();
};

_dataTypeEditorController.prototype.getSchema = function() {
    return JSON.parse(JSON.stringify(this.dataType.schema));
};

_dataTypeEditorController.prototype.updateSchema = function(schema) {
    _dataTypeEditorInstance.dataType.schema = JSON.parse(JSON.stringify(schema));
    _dataTypeEditorInstance.refreshEditorState();
};

_dataTypeEditorController.prototype.fetchType = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/data/types/${name}`)
        .then((response) => {
            this.name = response.data.name;
            this.dataType = response.data;
            this.forceRefresh();

            this.editor.setValue(JSON.stringify(response.data, null, 4));
        });
};

_dataTypeEditorController.prototype.saveType = function() {
    var parsed = JSON.parse(this.editor.getValue());

    if (this.name) {
        return window.axiosProxy
            .put(`${window.hosts.kernel}/data/types/${this.name}`, this.editor.getValue(), {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                this.dataType = JSON.parse(this.editor.getValue());
                this.error.visible = false;
                this.showAlert = true;
                this.forceRefresh();

                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();
                }, 1500);
            }).catch((err) => {
                this.error.visible = true;
                this.error.title = "Error saving datatype";
                this.error.description = err.toString();
                this.forceRefresh();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/data/types`, this.editor.getValue(), {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                //set our name
                this.name = parsed.name;
                location.href = "/#/data/editor/" + this.name;
                this.dataType = JSON.parse(this.editor.getValue());

                this.navitems.push({
                    name 		: "API Explorer",
                    event 		: () => {
                        window.router.push({
                            name : "dataTypeDetails",
                            params : {
                                type : this.name
                            }
                        });
                    },
                    selected 	: false
                });

                this.navitems.push({
                    name 		: "Definition",
                    link		: `${window.hosts.storage}/${this.name}/.definition`,
                    selected	: false
                });

                this.error.visible = false;
                this.showAlert = true;
                this.forceRefresh();

                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();
                }, 1500);
            }).catch((err) => {
                this.error.visible = true;
                this.error.title = "Error saving datatype";
                this.error.description = err.toString();
                this.forceRefresh();
            });
    }
};

window.DataTypeEditor = {
    template : "#template-dataTypeEditor",
    data 	 : () => {
        return window._dataTypeEditorInstance.getData();
    },
    mounted  : function() {
        window._dataTypeEditorInstance.setCaller(this);
        window._dataTypeEditorInstance.initEditor();
        window._dataTypeEditorInstance.navitems = [
            {
                name        : "Definition",
                event       : () => {
                    _dataTypeEditorInstance.showSchemaEditor();
                },
                selected    : true
            },
            {
                name 		: "Source Editor",
                event 		: () => {
                    _dataTypeEditorInstance.showSourceEditor();
                },
                selected	: false
            }
        ];

        if (this.$route.params.type === ".new") {
            window._dataTypeEditorInstance.initBlankType();
            return null;
        }

        window._dataTypeEditorInstance.navitems.push({
            name 		: "API Explorer",
            event 		: () => {
                window.router.push({
                    name : "dataTypeDetails",
                    params : {
                        type : this.$route.params.type
                    }
                });
            },
            selected 	: false
        });

        window._dataTypeEditorInstance.navitems.push({
            name 		: "Definition",
            link		: `${window.hosts.storage}/${this.$route.params.type}/.definition`,
            selected	: false
        });

        return window._dataTypeEditorInstance.fetchType(this.$route.params.type);
    }
};

window._dataTypeEditorInstance = new _dataTypeEditorController(window.DataTypeEditor);