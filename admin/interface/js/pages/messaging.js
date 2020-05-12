const _messagingController = function(page) {
	this._page = page;
	this.queues = [];
};

_messagingController.prototype.getQueues = function() {
	return {
		queues : this.queues
	};
};

_messagingController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_messagingController.prototype.fetchQueues = function() {
	return window.axios
		.get(`${window.hosts.kernel}/queues`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.queues = response.data;
			this.caller.queues = response.data;
			this.caller.$forceUpdate();
		});
};

_messagingController.prototype.removeQueue = function(name) {
	return window.axios
		.delete(`${window.hosts.kernel}/queues/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchQueues();
		});
};

window.Messaging = {
	template : "#template-messaging",
	data 	 : () => {
		return window._messagingControllerInstance.getQueues();
	},
	mounted  : function() {
		window._messagingControllerInstance.setCaller(this);
		return window._messagingControllerInstance.fetchQueues();
	}
};

window._messagingControllerInstance = new _messagingController(window.Messaging);