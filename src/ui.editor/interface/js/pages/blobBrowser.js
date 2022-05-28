const _blobBrowserController = function(page) {
    this._page                  = page;
    this.name                   = name;
    this.caller                 = null;
    this.store                  = {
        roles : {
            needsRole : false
        }
    };
    this.entry                  = {
        children : []
    };
    this.path                   = '';
    this.navitems               = [];
    this.loading                = true;
    this.entryOpen              = false;
    this.uploadOpen             = false;
    this.deleteConfirmVisible   = false;
    this.confirmDeleteAction    = () => {};
    this.createFolderOpen       = false;
};

_blobBrowserController.prototype.setLoading = function() {
    this.loading = true;
    this.forceRefresh();
};

_blobBrowserController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_blobBrowserController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_blobBrowserController.prototype.getData = function() {
    return {
        name                    : this.name,
        store                   : this.store,
        navitems                : this.navitems,
        loading                 : this.loading,
        path                    : this.path,
        entry                   : this.entry,
        entryOpen               : this.entryOpen,
        uploadOpen              : this.uploadOpen,
        deleteConfirmVisible    : this.deleteConfirmVisible,
        confirmDeleteAction     : this.confirmDeleteAction,
        createFolderOpen        : this.createFolderOpen,
    };
};

_blobBrowserController.prototype.forceRefresh = function() {
    this.caller.store                   = this.store;
    this.caller.navitems                = this.navitems;
    this.caller.name                    = this.name;
    this.caller.loading                 = this.loading;
    this.caller.path                    = this.path;
    this.caller.entry                   = this.entry;
    this.caller.entryOpen               = this.entryOpen;
    this.caller.uploadOpen              = this.uploadOpen;
    this.caller.deleteConfirmVisible    = this.deleteConfirmVisible;
    this.caller.confirmDeleteAction     = this.confirmDeleteAction;
    this.caller.createFolderOpen        = this.createFolderOpen;

    this.caller.$forceUpdate();
};

_blobBrowserController.prototype.setNavItems = function() {
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
            selected        : false,
            route_name      : 'blobEditor',
            route_params    : {
                name : this.name
            }
        },
        {
            name            : 'Browse',
            selected        : true,
            route_name      : 'blobBrowser',
            route_params    : {
                name : this.name
            }
        }
    ];
};

_blobBrowserController.prototype.fetchStore = function(name) {
    this.name = name;

    this.setNavItems();

    return window.axiosProxy
        .get(`${window.hosts.kernel}/blob/stores/${name}`)
        .then((response) => {
            this.store = response.data;

            this.setLoaded();
            this.forceRefresh();
        });
};

_blobBrowserController.prototype.fetchEntry = function(path) {
    this.path = path;

    this.setLoading();

    return window.axiosProxy
        .get(`${window.hosts.blob}/${this.name}/${this.path}`, {
            headers : {
                accept : 'application/json'
            }
        })
        .then((response) => {
            this.entry = response.data;
            this.entryOpen = this.entry.type === 'file';

            this.setLoaded();
        });
};

_blobBrowserController.prototype.back = function() {
    this.fetchEntry(this.path.split('/').slice(0, -1).join('/'));
};

_blobBrowserController.prototype.downloadFile = function(path) {
    return this._openFile(path, 'attachment');
};

_blobBrowserController.prototype.viewFile = function(path) {
    return this._openFile(path, 'inline');
};

_blobBrowserController.prototype._openFile = function(path, disposition) {
    //generate a code
    return window.axiosProxy
        .post(`${window.hosts.identity}/passcode/generate`, {
            resource : `${window.hosts.blob}/${this.name}/${path}`
        })
        .then((response) => {
            window.open(`${window.hosts.blob}/${this.name}/${path}?code=${response.data}&disposition=${disposition}`, '_blank').focus();
        });
};

_blobBrowserController.prototype.showUploadDialog = function() {
    this.uploadOpen = true;
    this.forceRefresh();
};

_blobBrowserController.prototype.closeUploadDialog = function() {
    this.uploadOpen = false;
    this.forceRefresh();
};

_blobBrowserController.prototype.uploadFile = function() {
    const formData = new FormData();
    const file = document.querySelector("#file");
    formData.append("file", file.files[0]);

    return window.axiosProxy.post(`${window.hosts.blob}/${this.name}/${this.path}/${file.files[0].name}`, formData).then(() => {
        this.uploadOpen = false;
        return this.fetchEntry(this.path);
    });
};

_blobBrowserController.prototype.deletePath = function(path) {
    this.deleteConfirmVisible = true;
    this.confirmDeleteAction = () => {
        this._deletePath(path);
    };
    this.forceRefresh();
};

_blobBrowserController.prototype._deletePath = function(path) {
    this.deleteConfirmVisible = false
    this.forceRefresh();

    return window.axiosProxy.delete(`${window.hosts.blob}/${this.name}/${path}`).then(() => {
        return this.fetchEntry(this.path);
    });
};

_blobBrowserController.prototype.showCreateFolderDialog = function() {
    this.createFolderOpen = true;
    this.forceRefresh();
};

_blobBrowserController.prototype.closeCreateFolderDialog = function() {
    this.createFolderOpen = false;
    this.forceRefresh();
};

_blobBrowserController.prototype.createFolder = function() {
    const newFolder = document.querySelector("#newFolder").value;

    return window.axiosProxy.post(`${window.hosts.blob}/${this.name}/${this.path}/${newFolder}`, null).then(() => {
        this.createFolderOpen = false;
        this.fetchEntry(this.path);
    });
};

window.BlobBrowser = {
    template : '#template-blobBrowser',
    data     : () => {
        return window._blobBrowserInstance.getData();
    },
    mounted  : function() {
        return window._blobBrowserInstance.fetchStore(this.$route.params.name).then(() => {
            return window._blobBrowserInstance.fetchEntry('');
        });
    },
    beforeCreate : function() {
        window._blobBrowserInstance.setCaller(this);
        window._blobBrowserInstance.setLoading();
    }
};

window._blobBrowserInstance = new _blobBrowserController(window.BlobBrowser);