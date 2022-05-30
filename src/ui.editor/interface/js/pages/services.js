const _servicesController = function(page) {
    this._page = page;
    this.services = [];
};

_servicesController.prototype.getData = function() {
    return {
        services 				: this.services,
        deleteConfirmVisible 	: false,
        confirmDeleteAction 	: () => {}
    };
};

_servicesController.prototype.fetchServices = function(caller) {
    this.caller = caller ? caller : this.caller;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/services`)
        .then((response) => {
            this.services = response.data;
            this.caller.services = response.data;
            this.caller.$forceUpdate();
        });
};

_servicesController.prototype.deleteService = function(name) {
    this.caller.deleteConfirmVisible = true;
    this.caller.confirmDeleteAction = () => {
        this.caller.deleteConfirmVisible = false;
        return this._deleteService(name);
    };
    this.caller.$forceUpdate();
    return;
};

_servicesController.prototype._deleteService = function(name) {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/services/${name}`)
        .then((response) => {
            return this.fetchServices();
        });
};

window.Services = {
    template : "#template-services",
    data 	 : () => {
        return window._servicesControllerInstance.getData();
    },
    mounted  : function() {
        return window._servicesControllerInstance.fetchServices(this);
    }
};

window._servicesControllerInstance = new _servicesController(window.services);