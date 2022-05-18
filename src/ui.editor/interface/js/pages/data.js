const _dataController = function(page) {
    this._page = page;
    this.dataTypes = [];
};

_dataController.prototype.getData = function() {
    return {
        dataTypes 				: this.dataTypes,
        deleteConfirmVisible 	: false,
        confirmDeleteAction 	: () => {}
    };
};

_dataController.prototype.fetchTypes = function(caller) {
    this.caller = caller;

    return window.axiosProxy
        .get(`${window.hosts.kernel}/data/types`)
        .then((response) => {
            this.dataTypes = response.data;
            this.caller.dataTypes = response.data;
            this.caller.$forceUpdate();
        });
};

_dataController.prototype.deleteType = function(name) {
    this.caller.deleteConfirmVisible = true;
    this.caller.confirmDeleteAction = () => {
        this.caller.deleteConfirmVisible = false;
        return this._deleteType(name);
    };
    this.caller.$forceUpdate();
    return;
};

_dataController.prototype._deleteType = function(name) {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/data/types/${name}`)
        .then((response) => {
            this.fetchTypes(this.caller);
        });
};

window.Data = {
    template : '#template-dataTypes',
    data 	 : () => {
        return window._dataControllerInstance.getData();
    },
    mounted  : function() {
        return window._dataControllerInstance.fetchTypes(this);
    }
};

window._dataControllerInstance = new _dataController(window.Data);