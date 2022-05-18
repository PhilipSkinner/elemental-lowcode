const _rulesController = function(page) {
    this._page = page;
    this.rules = [];
};

_rulesController.prototype.getRules = function() {
    return {
        rules 					: this.rules,
        deleteConfirmVisible 	: false,
        confirmDeleteAction 	: () => {}
    };
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
            this.caller.rules = response.data;
            this.caller.$forceUpdate();
        });
};

_rulesController.prototype.removeRule = function(rule) {
    this.caller.deleteConfirmVisible = true;
    this.caller.confirmDeleteAction = () => {
        this.caller.deleteConfirmVisible = false;
        return this._removeRule(rule);
    };
    this.caller.$forceUpdate();
    return;
};

_rulesController.prototype._removeRule = function(rule) {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/rules/${rule}`)
        .then((response) => {
            return this.fetchRules();
        });
};

window.Rules = {
    template : '#template-rules',
    data 	 : () => {
        return window._rulesControllerInstance.getRules();
    },
    mounted  : function() {
        window._rulesControllerInstance.setCaller(this);
        return window._rulesControllerInstance.fetchRules();
    }
};

window._rulesControllerInstance = new _rulesController(window.Rules);