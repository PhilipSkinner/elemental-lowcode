const _homeController = function(page) {
    this._page = page;
    this.rules = [];
    this.integrations = [];
    this.datatypes = [];
    this.websites = [];
    this.clients = [];
    this.apis = [];
    this.navItems = [
        {
            name : 'Home',
            selected : true,
            link : '/#/',
            target : ''
        },
        {
            name : 'Monitor',
            selected : false,
            link : '/#/monitor',
            target : ''
        }
    ];
};

/* navigation */
_homeController.prototype.generateNavItems = function() {
    return this.navItems.map((item) => {
        return item;
    });
};
/* end */

_homeController.prototype.getData = function() {
    return {
        rules 			: this.rules,
        integrations 	: this.integrations,
        datatypes 		: this.datatypes,
        websites 		: this.websites,
        clients 		: this.clients,
        apis 			: this.apis,
        navItems 		: this.generateNavItems(),
    };
};

_homeController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_homeController.prototype.fetchRules = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/rules`)
        .then((response) => {
            this.rules = response.data;
        });
};

_homeController.prototype.fetchIntegrations = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/integrations`)
        .then((response) => {
            this.integrations = response.data;
        });
};

_homeController.prototype.fetchDataTypes = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/data/types`)
        .then((response) => {
            this.datatypes = response.data;
        });
};

_homeController.prototype.fetchWebsites = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/websites`)
        .then((response) => {
            this.websites = response.data;
        });
};

_homeController.prototype.fetchClients = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/clients`)
        .then((response) => {
            this.clients = response.data;
        });
};

_homeController.prototype.fetchAPIs = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/apis`)
        .then((response) => {
            this.apis = response.data;
        });
};

_homeController.prototype.refresh = function() {
    this.caller.rules = this.rules;
    this.caller.integrations = this.integrations;
    this.caller.datatypes = this.datatypes;
    this.caller.websites = this.websites;
    this.caller.clients = this.clients;
    this.caller.apis = this.apis;
    this.caller.navItems = this.generateNavItems();
    this.caller.$forceUpdate();
};

window.Home = {
    template : '#template-home',
    data 	 : () => {
        return window._homeControllerInstance.getData();
    },
    mounted  : function() {
        window._homeControllerInstance.setCaller(this);

        return Promise.all([
            window._homeControllerInstance.fetchRules(),
            window._homeControllerInstance.fetchIntegrations(),
            window._homeControllerInstance.fetchDataTypes(),
            window._homeControllerInstance.fetchWebsites(),
            window._homeControllerInstance.fetchClients(),
            window._homeControllerInstance.fetchAPIs(),
        ]).then(() => {
            window._homeControllerInstance.refresh();
        });
    }
};

window._homeControllerInstance = new _homeController(window.Home);