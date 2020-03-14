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
			caller.websites = response.data;
			caller.$forceUpdate();
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