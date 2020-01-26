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
	return axios
		.get('http://localhost:8001/websites')
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

const Websites = {
	template : '#template-websites',
	data 	 : () => {
		return _websitesControllerInstance.getWebsites();
	},
	mounted  : function() {
		return _websitesControllerInstance.fetchWebsites(this);
	}
};

const _websitesControllerInstance = new _websitesController(Websites);