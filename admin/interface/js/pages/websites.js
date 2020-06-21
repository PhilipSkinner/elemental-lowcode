const _websitesController = function(page) {
	this._page = page;
	this.websites = [];
	this.websitesVisible = true;
	this.sessionConfigVisible = false;
	this.config = {};
	this.showAlert = false;
	this.setNav();
};

_websitesController.prototype.setNav = function() {
	this.navitems = [
		{
			name 		: "Websites",
			event 		: this.showWebsites.bind(this),
			selected 	: this.websitesVisible
		},
		{
			name 		: "Sessions",
			event 		: this.showSessionsConfig.bind(this),
			selected 	: this.sessionConfigVisible
		}
	];
};

_websitesController.prototype.showWebsites = function() {
	this.websitesVisible = true;
	this.sessionConfigVisible = false;
	this.setNav();
	this.forceRefresh();
};

_websitesController.prototype.showSessionsConfig = function() {
	this.websitesVisible = false;
	this.sessionConfigVisible = true;
	this.setNav();
	this.forceRefresh();
};

_websitesController.prototype.forceRefresh = function() {
	this.caller.websites = this.websites;
	this.caller.websitesVisible = this.websitesVisible;
	this.caller.sessionConfigVisible = this.sessionConfigVisible;
	this.caller.navitems = this.navitems;
	this.caller.config = this.config;
	this.caller.showAlert = this.showAlert;

	this.caller.$forceUpdate();
};

_websitesController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_websitesController.prototype.getWebsites = function() {
	return {
		websites 				: this.websites,
		navitems 				: this.navitems,
		websitesVisible 		: this.websitesVisible,
		sessionConfigVisible 	: this.sessionConfigVisible,
		config 					: this.config,
		showAlert 				: this.showAlert
	};
};

_websitesController.prototype.fetchWebsites = function() {
	return window.axios
		.get(`${window.hosts.kernel}/websites`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			response.data = response.data.map((w) => {
				w.url = `${window.hosts.interface}/${w.name}/`;
				return w;
			});

			this.websites = response.data;
			this.forceRefresh();
		});
};

_websitesController.prototype.deleteWebsite = function(name) {
	return window.axios
		.delete(`${window.hosts.kernel}/websites/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchWebsites();
		});
};

_websitesController.prototype.loadConfig = function() {
	return window.axios
		.get(`${window.hosts.kernel}/websitesConfig`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		}).then((response) => {
			this.config = response.data;
			this.forceRefresh();
		});
};

_websitesController.prototype.saveConfig = function() {
	return window.axios
		.put(`${window.hosts.kernel}/websitesConfig`, JSON.stringify(this.config, null, 4), {
			headers : {
				Authorization : `Bearer ${window.getToken()}`,
				"Content-Type" : "application/json"
			}
		}).then((response) => {
			this.showAlert = true;
			this.forceRefresh();

			setTimeout(() => {
				this.showAlert = false;
				this.forceRefresh();
			}, 2500);
		});
};

window.Websites = {
	template : "#template-websites",
	data 	 : () => {
		return window._websitesControllerInstance.getWebsites();
	},
	mounted  : function() {
		window._websitesControllerInstance.setCaller(this);
		return window._websitesControllerInstance.fetchWebsites().then(() => {
			return window._websitesControllerInstance.loadConfig();
		});
	}
};

window._websitesControllerInstance = new _websitesController(window.Websites);