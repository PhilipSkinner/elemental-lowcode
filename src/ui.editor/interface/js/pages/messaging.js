const _messagingController = function(page) {
    this._page = page;
    this.queues = [];    
};

_messagingController.prototype.getQueues = function() {
    return {
        queues 					: this.queues,
        deleteConfirmVisible 	: false,
        confirmDeleteAction 	: () => {}
    };
};

_messagingController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_messagingController.prototype.fetchQueues = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/queues`)
        .then((response) => {
            this.queues = response.data;
            this.caller.queues = response.data;
            this.caller.$forceUpdate();
        });
};

_messagingController.prototype.removeQueue = function(name) {
    this.caller.deleteConfirmVisible = true;
    this.caller.confirmDeleteAction = () => {
        this.caller.deleteConfirmVisible = false;
        return this._removeQueue(name);
    };
    this.caller.$forceUpdate();
    return;
};

_messagingController.prototype._removeQueue = function(name) {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/queues/${name}`)
        .then((response) => {
            return this.fetchQueues();
        });
};

window.Messaging = {
    template : '#template-messaging',
    data 	 : () => {
        return window._messagingControllerInstance.getQueues();
    },
    mounted  : function() {
        window._messagingControllerInstance.setCaller(this);
        return window._messagingControllerInstance.fetchQueues();
    }
};

window._messagingControllerInstance = new _messagingController(window.Messaging);