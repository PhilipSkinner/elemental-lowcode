const _websitesController = function(page) {
    this._page = page;
    this.websites = [];
    this.tagsets = [];
    this.websitesVisible = true;
    this.tagsetsVisible = false;
    this.config = {};
    this.showAlert = false;
    this.setNav();
};

_websitesController.prototype.setNav = function() {
    this.navitems = [
        {
            name 		: 'Websites',
            event 		: this.showWebsites.bind(this),
            selected 	: this.websitesVisible
        },
        {
            name 		: 'Tagsets',
            event 		: this.showTagsets.bind(this),
            selected 	: this.tagsetsVisible
        }
    ];
};

_websitesController.prototype.showWebsites = function() {
    this.websitesVisible = true;
    this.tagsetsVisible = false;
    this.setNav();
    this.forceRefresh();
};

_websitesController.prototype.showTagsets = function() {
    this.websitesVisible = false;
    this.tagsetsVisible = true;
    this.setNav();
    this.forceRefresh();
};

_websitesController.prototype.forceRefresh = function() {
    this.caller.websites 				= this.websites;
    this.caller.tagsets 				= this.tagsets;
    this.caller.websitesVisible 		= this.websitesVisible;
    this.caller.tagsetsVisible 			= this.tagsetsVisible;
    this.caller.navitems 				= this.navitems;
    this.caller.config 					= this.config;
    this.caller.showAlert 				= this.showAlert;

    this.caller.$forceUpdate();
};

_websitesController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_websitesController.prototype.getWebsites = function() {
    return {
        websites 				: this.websites,
        tagsets 				: this.tagsets,
        navitems 				: this.navitems,
        websitesVisible 		: this.websitesVisible,
        tagsetsVisible 			: this.tagsetsVisible,
        config 					: this.config,
        showAlert 				: this.showAlert,
        deleteConfirmVisible 	: false,
        confirmDeleteAction 	: () => {}
    };
};

_websitesController.prototype.fetchWebsites = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/websites`)
        .then((response) => {
            response.data = response.data.map((w) => {
                w.url = `${window.hosts.interface}/${w.name}/`;
                return w;
            });

            this.websites = response.data;
            this.forceRefresh();
        });
};

_websitesController.prototype.fetchTagsets = function() {
    return window.axiosProxy.get(`${window.hosts.kernel}/tags/`).then((response) => {
        this.tagsets = response.data;
        this.forceRefresh();
    });
};

_websitesController.prototype.deleteTagset = function(name) {
    return window.axiosProxy.delete(`${window.hosts.kernel}/tags/${name}`).then((response) => {
        return this.fetchTagsets();
    });
};

_websitesController.prototype.deleteWebsite = function(name) {
    this.caller.deleteConfirmVisible = true;
    this.caller.confirmDeleteAction = () => {
        this.caller.deleteConfirmVisible = false;
        return this._deleteWebsite(name);
    };
    this.caller.$forceUpdate();
    return;
};

_websitesController.prototype._deleteWebsite = function(name) {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/websites/${name}`)
        .then((response) => {
            return this.fetchWebsites();
        });
};

window.Websites = {
    template : '#template-websites',
    data 	 : () => {
        return window._websitesControllerInstance.getWebsites();
    },
    mounted  : function() {
        window._websitesControllerInstance.setCaller(this);
        return window._websitesControllerInstance.fetchWebsites().then(() => {
            return window._websitesControllerInstance.fetchTagsets();
        });
    }
};

window._websitesControllerInstance = new _websitesController(window.Websites);