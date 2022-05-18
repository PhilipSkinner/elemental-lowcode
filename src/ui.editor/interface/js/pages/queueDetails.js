const _queueDetailController = function(page) {
    this._page = page;
    this.caller = null;
    this.data = {
        queue 	: {}
    };
};

_queueDetailController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_queueDetailController.prototype.getData = function() {
    return {
        queue : this.data.queue
    };
};

_queueDetailController.prototype.fetchQueue = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/queues/${name}`)
        .then((response) => {
            this.data.queue = response.data;
            this.caller.queue = response.data;

            console.log(response.data);

            this.caller.$forceUpdate();
        });
};

window.QueueDetails = {
    template : '#template-queueDetails',
    data 	 : () => {
        return window._queueDetailInstance.getData();
    },
    mounted  : function() {
        window._queueDetailInstance.setCaller(this);
        return window._queueDetailInstance.fetchQueue(this.$route.params.name);
    }
};

window._queueDetailInstance = new _queueDetailController(window.QueueDetails);