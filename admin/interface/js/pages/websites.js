const _websitesController = function(page) {
	this._page = page;
	this.websites = [];
};

_websitesController.prototype.getWebsites = function() {
	return {
		websites : this.websites
	};
};

_websitesController.prototype.fetchWebsites = function(caller) {
	this.caller = caller ? caller : this.caller;
	return window.axios
		.get("http://localhost:8001/websites", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			response.data = response.data.map((w) => {
				w.url = `http://localhost:8005/${w.name}/`;
				return w;
			});

			this.websites = response.data;
			this.caller.websites = response.data;
			this.caller.$forceUpdate();
		});
};

_websitesController.prototype.deleteWebsite = function(name) {
	return window.axios
		.delete(`http://localhost:8001/websites/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchWebsites();
		});
};

window.Websites = {
	template : "#template-websites",
	data 	 : () => {
		return window._websitesControllerInstance.getWebsites();
	},
	mounted  : function() {
		return window._websitesControllerInstance.fetchWebsites(this);
	}
};

window._websitesControllerInstance = new _websitesController(window.Websites);