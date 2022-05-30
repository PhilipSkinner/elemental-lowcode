const _dataTypeEditorController = function(page) {
    this._page = page;
    this.dataType = {};
    this.caller = null;
    this.name = null;
    this.editor = null;
    this.data = {
        dataType 	: this.dataType,
        showAlert 	: false,
        error 	 	: {
            visible : false
        },
        navitems 	: [],
        name 		: "untitled"
    };
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

    this.caller.name = "untitled";
    this.data.name = "untitled";
    this.caller.dataType = JSON.parse(this.editor.getValue());
    this.caller.$forceUpdate();
};

_dataTypeEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_dataTypeEditorController.prototype.getData = function() {
    return this.data;
};

_dataTypeEditorController.prototype.fetchType = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/data/types/${name}`)
        .then((response) => {
            this.name = response.data.name;
            this.data.name = response.data.name;
            this.dataTypes = response.data;
            this.caller.dataType = response.data;
            this.caller.name = response.data.name;
            this.caller.$forceUpdate();

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
                this.caller.dataType = JSON.parse(this.editor.getValue());
                this.data.error.visible = false;
                this.caller.showAlert = true;
                this.caller.$forceUpdate();

                setTimeout(() => {
                    this.caller.showAlert = false;
                    this.caller.$forceUpdate();
                }, 1500);
            }).catch((err) => {
                this.data.error.visible = true;
                this.data.error.title = "Error saving datatype";
                this.data.error.description = err.toString();

                this.caller.error = this.getData().error;
                this.caller.$forceUpdate();
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
                this.data.name = parsed.name;
                this.caller.name = parsed.name;
                location.href = "/#/data/editor/" + this.name;
                this.caller.dataType = JSON.parse(this.editor.getValue());

                window._dataTypeEditorInstance.data.navitems.push({
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

                window._dataTypeEditorInstance.data.navitems.push({
                    name 		: "Definition",
                    link		: `${window.hosts.storage}/${this.name}/.definition`,
                    selected	: false
                });


                this.data.error.visible = false;
                this.caller.showAlert = true;
                this.caller.$forceUpdate();

                setTimeout(() => {
                    this.caller.showAlert = false;
                    this.caller.$forceUpdate();
                }, 1500);
            }).catch((err) => {
                this.data.error.visible = true;
                this.data.error.title = "Error saving datatype";
                this.data.error.description = err.toString();

                this.caller.error = this.getData().error;
                this.caller.$forceUpdate();
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
        window._dataTypeEditorInstance.data.navitems = [
            {
                name 		: "Edit",
                event 		: () => {

                },
                selected	: true
            }
        ];
        if (this.$route.params.type === ".new") {
            window._dataTypeEditorInstance.initBlankType();
            return null;
        }

        window._dataTypeEditorInstance.data.navitems.push({
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

        window._dataTypeEditorInstance.data.navitems.push({
            name 		: "Definition",
            link		: `${window.hosts.storage}/${this.$route.params.type}/.definition`,
            selected	: false
        });

        return window._dataTypeEditorInstance.fetchType(this.$route.params.type);
    }
};

window._dataTypeEditorInstance = new _dataTypeEditorController(window.DataTypeEditor);