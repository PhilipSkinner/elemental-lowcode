const _blobEditorController = function(page) {
    this._page = page;
    this.store = {};
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

_blobEditorController.prototype.setLoading = function() {
    this.loading = true;
};

_blobEditorController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_blobEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById('blobEditor'), {
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
            this.saveStore();
        }
    });
    this.editor.setTheme('ace/theme/twilight');
};

_blobEditorController.prototype.initBlankType = function() {
    this.name = null;

    this.store = {
        name : 'untitled',
        roles : {
            replace : {
                read : false,
                write : false
            },
            read : [],
            write : [],
            needsRole : {
                read : true,
                write : true
            }
        }
    };

    //set the example
    this.editor.setValue(JSON.stringify(this.store, null, 4));

    this.navitems = [];
    this.setLoaded();
    this.forceRefresh();
};

_blobEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_blobEditorController.prototype.getData = function() {
    return {
        name            : this.name,
        store           : this.store,
        showAlert       : this.showAlert,
        error           : this.error,
        navitems        : this.navitems,
        loading         : this.loading,
    }
};

_blobEditorController.prototype.forceRefresh = function() {
    this.caller.name        = this.name;
    this.caller.store       = this.store;
    this.caller.showAlert   = this.showAlert;
    this.caller.error       = this.error;
    this.caller.navitems    = this.navitems;
    this.caller.loading     = this.loading;

    this.caller.$forceUpdate();
};

_blobEditorController.prototype.setNavItems = function() {
    this.navitems = [
        {
            name            : 'Documentation',
            selected        : false,
            route_name      : 'blobDetails',
            route_params    : {
                name : this.name
            }
        },
        {
            name            : 'Modify',
            selected        : true,
            route_name      : 'blobEditor',
            route_params    : {
                name : this.name
            }
        },
        {
            name            : 'Browse',
            selected        : false,
            route_name      : 'blobBrowser',
            route_params    : {
                name : this.name
            }
        }
    ];
};

_blobEditorController.prototype.fetchStore = function(name) {
    this.name = name;

    this.setNavItems();

    return window.axiosProxy
        .get(`${window.hosts.kernel}/blob/stores/${name}`)
        .then((response) => {
            this.store = response.data;
            this.editor.setValue(JSON.stringify(response.data, null, 4));

            this.setLoaded();
            this.forceRefresh();
        });
};

_blobEditorController.prototype.saveStore = function() {
    this.setLoading();

    var parsed = JSON.parse(this.editor.getValue());

    this.store = parsed;

    if (this.name) {
        return window.axiosProxy
            .put(`${window.hosts.kernel}/blob/stores/${this.name}`, this.editor.getValue(), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                this.error.visible = false;
                this.showAlert = true;

                if (this.name !== this.store.name) {
                    location.href = '/#/blob/editor/' + this.store.name;
                    this.name = this.store.name;
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
                    title       : 'Error saving blob store',
                    description : err.toString(),
                };

                this.setLoaded();
                this.forceRefresh();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/blob/stores`, this.editor.getValue(), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                //set our name
                this.name = parsed.name;
                location.href = '/#/blob/editor/' + this.name;
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
                    title       : 'Error saving blob store',
                    description : err.toString(),
                };

                this.setLoaded();
                this.forceRefresh();
            });
    }
};

window.BlobEditor = {
    template : '#template-blobEditor',
    data     : () => {
        return _blobEditorInstance.getData();
    },
    mounted  : function() {
        window._blobEditorInstance.initEditor();
        if (this.$route.params.name === '.new') {
            window._blobEditorInstance.initBlankType();
            return null;
        }

        return window._blobEditorInstance.fetchStore(this.$route.params.name);
    },
    beforeCreate : function() {
        window._blobEditorInstance.setCaller(this);
        window._blobEditorInstance.setLoading();
    }
};

window._blobEditorInstance = new _blobEditorController(window.BlobEditor);