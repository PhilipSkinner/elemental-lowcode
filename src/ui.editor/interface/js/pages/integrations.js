const _integrationsController = function(page) {
    this._page = page;
    this.integrations = [];
    this.loading = true;
    this.deleteConfirmVisible = false;
    this.confirmDeleteAction = () => {};
};

_integrationsController.prototype.setLoading = function() {
    this.loading = true;
};

_integrationsController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_integrationsController.prototype.getData = function() {
    return {
        integrations 			: this.integrations,
        deleteConfirmVisible 	: this.deleteConfirmVisible,
        confirmDeleteAction 	: this.confirmDeleteAction,
        loading                 : this.loading,
    };
};

_integrationsController.prototype.forceRefresh = function() {
    this.caller.integrations            = this.integrations;
    this.caller.deleteConfirmVisible    = this.deleteConfirmVisible
    this.caller.confirmDeleteAction     = this.confirmDeleteAction;
    this.caller.loading                 = this.loading;

    this.caller.$forceUpdate();
};

_integrationsController.prototype.setCaller = function(caller) {
    this.caller = caller;
}

_integrationsController.prototype.fetchIntegrations = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/integrations`)
        .then((response) => {
            this.integrations = response.data;
            this.setLoaded();
            this.forceRefresh();
        });
};

_integrationsController.prototype.removeIntegration = function(name) {
    this.deleteConfirmVisible = true;
    this.confirmDeleteAction = () => {
        this.deleteConfirmVisible = false;
        this._removeIntegration(name);
    };
    this.forceRefresh();
};

_integrationsController.prototype._removeIntegration = function(name) {
    this.setLoading();

    return window.axiosProxy
        .delete(`${window.hosts.kernel}/integrations/${name}`)
        .then((response) => {
            this.fetchIntegrations(this.caller);
        });
};

window.Integrations = {
    template : "#template-integrations",
    data 	 : () => {
        return window._integrationsControllerInstance.getData();
    },
    mounted  : function() {
        return window._integrationsControllerInstance.fetchIntegrations();
    },
    beforeCreate : function() {
        window._integrationsControllerInstance.setCaller(this);
        window._integrationsControllerInstance.setLoading();
    }
};

window._integrationsControllerInstance = new _integrationsController(window.Integrations);