const _queueEditorController = function(page) {
    this._page = page;
    this.queue = {};
    this.handler = "";
    this.caller = null;
    this.name = null;
    this.editor = null;
    this.queueMode = true;
    this.error = {
        visible : false
    };
    this.showAlert = false;
    this.navitems = [
        {
            name        : "Auto-provision client",
            event       : this.autoProvisionClient.bind(this),
            selected    : false
        },
        {
            name        : "Queue",
            event       : this.showQueueEditor.bind(this),
            selected    : true
        },
        {
            name        : "Handler",
            event       : this.showHandlerEditor.bind(this),
            selected    : false
        }
    ];
};

_queueEditorController.prototype.autoProvisionClient = function() {
    let parsed = JSON.parse(this.editor.getValue());

    if (!parsed.name) {
        return;
    }

    //generate a default client
    const client = {
	    "client_id": `interface-${parsed.name}-client`,
	    "client_secret": `${window.generateGuid().split("-").reverse().join("")}${window.generateGuid().split("-").reverse().join("")}${window.generateGuid().split("-").reverse().join("")}`,
	    "scope": "roles",
	    "grant_types" : [
            "client_credentials"
	    ],
	    "redirect_uris": []
    };

    //save the client and set the value
    return window.axiosProxy
        .post(`${window.hosts.kernel}/security/clients`, JSON.stringify(client), {
            headers : {
                "Content-Type" : "application/json",
            }
        })
        .then((response) => {
            //set the client and save the website
            parsed.client_id = client.client_id;
            this.editor.setValue(JSON.stringify(parsed, null, 4));
            return this.saveQueue();
        }).catch((err) => {
            console.log(err);
        });
};

_queueEditorController.prototype.showHandlerEditor = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = false;
    this.navitems[2].selected = true;
    this.queueMode = false;    
    this.refreshState();
};

_queueEditorController.prototype.showQueueEditor = function() {    
    this.navitems[0].selected = false;
    this.navitems[1].selected = true;
    this.navitems[2].selected = false;
    this.queueMode = true;
    this.refreshState();
};

_queueEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById("queueEditor"), {
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
            this.saveQueue();
        }
    });
    this.editor.setTheme("ace/theme/twilight");

    this.handlerEditor = window.ace.edit(document.getElementById("handlerEditor"), {
        mode : "ace/mode/javascript",
        selectionStyle : "text"
    });
    this.handlerEditor.commands.addCommand({
        name : "save",
        bindKey : {
            win: "Ctrl-S",
            mac: "Cmd-S"
        },
        exec : () => {
            this.saveQueue();
        }
    });
    this.handlerEditor.setTheme("ace/theme/twilight");
};

_queueEditorController.prototype.initBlankType = function() {
    this.name = null;

    //set the example
    this.editor.setValue(JSON.stringify({
        "name"  		: "myQueue",
        "client_id" 	: "",
        "roles"  		: {
            "needsRole" : true,
            "replace" 	: false,
            "roles" 	: []
        },
        "incoming" 		: {
            "schema" : {
                "type" 			: "object",
                "properties" 	: {
                    "hello" 	: {
                        "type" 	: "string"
                    }
                }
            }
        }
    }, null, 4));

    this.handlerEditor.setValue(`module.exports = function(message) {
	return new Promise((resolve, reject) => {
		console.log(message);
		return resolve("hello world");
	});
};`);
};

_queueEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_queueEditorController.prototype.getData = function() {
    return {
        queue 		: this.queue,
        error 		: this.error,
        showAlert 	: this.showAlert,
        queueMode 	: this.queueMode,
        navitems    : this.navitems
    };
};

_queueEditorController.prototype.refreshState = function() {
    this.caller.queue 		= this.queue;
    this.caller.error 		= this.error;
    this.caller.showAlert 	= this.showAlert;
    this.caller.queueMode 	= this.queueMode;
    this.caller.navitems    = this.navitems;
    this.caller.$forceUpdate();
};

_queueEditorController.prototype.fetchQueue = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/queues/${name}`)
        .then((response) => {
            this.queue = response.data;
            this.editor.setValue(JSON.stringify(response.data, null, 4));
            this.refreshState();
        });
};

_queueEditorController.prototype.fetchQueueHandler = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/queues/${name}/handler`)
        .then((response) => {
            this.handler = response.data;
            this.handlerEditor.setValue(response.data);
            this.refreshState();
        });
};

_queueEditorController.prototype.saveQueue = function() {
    var parsed = JSON.parse(this.editor.getValue());

    if (this.name) {
        return window.axiosProxy.put(`${window.hosts.kernel}/queues/${this.name}/handler`, JSON.stringify({ payload : this.handlerEditor.getValue() }), {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(() => {
            return window.axiosProxy.put(`${window.hosts.kernel}/queues/${this.name}`, this.editor.getValue(), {
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }).then((response) => {
            this.error.visible = false;
            this.showAlert = true;
            this.refreshState();

            setTimeout(() => {
                this.showAlert = false;
                this.refreshState();
            }, 1500);
        }).catch((err) => {
            this.error = {
                visible 	: true,
                title 		: "Error saving queue",
                description : err.toString()
            };

            this.refreshState();
        });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/queues`, this.editor.getValue(), {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                //set our name
                this.name = parsed.name;
                return window.axiosProxy.put(`${window.hosts.kernel}/queues/${this.name}/handler`, JSON.stringify({ payload : this.handlerEditor.getValue() }), {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            }).then(() => {
                location.href = "/#/messaging/editor/" + this.name;

                this.error.visible = false;
                this.showAlert = true;
                this.refreshState();

                setTimeout(() => {
                    this.showAlert = false;
                    this.refreshState();
                }, 1500);
            }).catch((err) => {
                this.error = {
                    visible 	: true,
                    title 		: "Error saving queue",
                    description : err.toString()
                };

                this.refreshState();
            });
    }
};

window.QueueEditor = {
    template : "#template-queueEditor",
    data 	 : () => {
        return _queueEditorInstance.getData();
    },
    mounted  : function() {
        window._queueEditorInstance.setCaller(this);
        window._queueEditorInstance.initEditor();
        if (this.$route.params.name === ".new") {
            window._queueEditorInstance.initBlankType();
            return null;
        }

        return window._queueEditorInstance.fetchQueue(this.$route.params.name).then(() => {
            return window._queueEditorInstance.fetchQueueHandler(this.$route.params.name);
        });
    }
};

window._queueEditorInstance = new _queueEditorController(window.QueueEditor);