const _blobStorageController = function(page) {
    this._page = page;
    this.entries = [];
    this.loading = true;
    this.deleteConfirmVisible = false;
    this.confirmDeleteAction = () => {};
};

_blobStorageController.prototype.setLoading = function() {
    this.loading = true;
};

_blobStorageController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_blobStorageController.prototype.getData = function() {
    return {
        entries                 : this.entries,
        deleteConfirmVisible    : this.deleteConfirmVisible,
        confirmDeleteAction     : this.confirmDeleteAction,
        loading                 : this.loading,
    };
};

_blobStorageController.prototype.forceRefresh = function() {
    this.caller.entries                 = this.entries;
    this.caller.deleteConfirmVisible    = this.deleteConfirmVisible;
    this.caller.confirmDeleteAction     = this.confirmDeleteAction;
    this.caller.loading                 = this.loading;

    this.caller.$forceUpdate();
};

_blobStorageController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_blobStorageController.prototype.fetchEntries = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/blob/stores`)
        .then((response) => {
            this.entries = response.data;
            this.setLoaded();
            this.forceRefresh();
        });
};

window.BlobStorage = {
    template : '#template-blobs',
    data     : () => {
        return window._blobStorageControllerInstance.getData();
    },
    mounted  : function() {
        return window._blobStorageControllerInstance.fetchEntries();
    },
    beforeCreate : function() {
        window._blobStorageControllerInstance.setCaller(this);
        window._blobStorageControllerInstance.setLoading();
    }
};

window._blobStorageControllerInstance = new _blobStorageController(window.Rules);