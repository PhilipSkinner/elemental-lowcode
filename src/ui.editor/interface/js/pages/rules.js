const _rulesController = function(page) {
    this._page = page;
    this.rules = [];
    this.loading = true;
    this.deleteConfirmVisible = false;
    this.confirmDeleteAction = () => {};
};

_rulesController.prototype.setLoading = function() {
    this.loading = true;
};

_rulesController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_rulesController.prototype.getData = function() {
    return {
        rules 					: this.rules,
        deleteConfirmVisible    : this.deleteConfirmVisible,
        confirmDeleteAction     : this.confirmDeleteAction,
        loading                 : this.loading,
    };
};

_rulesController.prototype.forceRefresh = function() {
    this.caller.rules                   = this.rules;
    this.caller.deleteConfirmVisible    = this.deleteConfirmVisible;
    this.caller.confirmDeleteAction     = this.confirmDeleteAction;
    this.caller.loading                 = this.loading;

    this.caller.$forceUpdate();
};

_rulesController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_rulesController.prototype.fetchRules = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/rules`)
        .then((response) => {
            response.data = response.data.map((w) => {
                w.url = `${window.hosts.rule}/${w.name}/`;
                return w;
            });

            this.rules = response.data;
            this.setLoaded();
            this.forceRefresh();
        });
};

_rulesController.prototype.removeRule = function(rule) {
    this.deleteConfirmVisible = true;
    this.confirmDeleteAction = () => {
        this.deleteConfirmVisible = false;
        return this._removeRule(rule);
    };
    this.forceRefresh();
    return;
};

_rulesController.prototype._removeRule = function(rule) {
    this.setLoading();
    this.forceRefresh();

    return window.axiosProxy
        .delete(`${window.hosts.kernel}/rules/${rule}`)
        .then((response) => {
            return this.fetchRules();
        });
};

window.Rules = {
    template : "#template-rules",
    data 	 : () => {
        return window._rulesControllerInstance.getData();
    },
    mounted  : function() {
        return window._rulesControllerInstance.fetchRules();
    },
    beforeCreate : function() {
        window._rulesControllerInstance.setCaller(this);
        window._rulesControllerInstance.setLoading();
    }
};

window._rulesControllerInstance = new _rulesController(window.Rules);