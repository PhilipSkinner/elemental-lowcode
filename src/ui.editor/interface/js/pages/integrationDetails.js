const _integrationDetailController = function(page) {
    this._page = page;
    this.caller = null;
    this.integration = {
        method : '',
        roles : {
            needsRole : false
        },
        variables : {}
    };
    this.loading = true;
    this.navitems = [];
};

_integrationDetailController.prototype.setLoading = function() {
    this.loading = true;
};

_integrationDetailController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_integrationDetailController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_integrationDetailController.prototype.getData = function() {
    return {
        integration : this.integration,
        loading     : this.loading,
        navitems    : this.navitems,
        name        : this.name
    };
};

_integrationDetailController.prototype.forceRefresh = function() {
    this.caller.integration = this.integration;
    this.caller.loading     = this.loading;
    this.caller.navitems    = this.navitems;
    this.caller.name        = this.name;

    this.caller.$forceUpdate();
};

_integrationDetailController.prototype.setNavItems = function() {
    this.navitems = [
        {
            name            : 'Documentation',
            selected        : true,
            route_name      : 'integrationDetails',
            route_params    : {
                name : this.name
            }
        },
        {
            name            : 'Modify',
            selected        : false,
            route_name      : 'integrationEditor',
            route_params    : {
                name : this.name
            }
        }
    ];
};

_integrationDetailController.prototype.fetchType = function(name) {
    this.name = name;

    this.setNavItems();

    return window.axiosProxy
        .get(`${window.hosts.kernel}/integrations/${name}`)
        .then((response) => {
            this.integration = response.data;

            this.setLoaded();
            this.forceRefresh();
        });
};

window.IntegrationDetails = {
    template : '#template-integrationDetails',
    data 	 : () => {
        return window._integrationDetailInstance.getData();
    },
    mounted  : function() {
        return window._integrationDetailInstance.fetchType(this.$route.params.name);
    },
    beforeCreate : function() {
        window._integrationDetailInstance.setCaller(this);
        window._integrationDetailInstance.setLoading();
    }
};

window._integrationDetailInstance = new _integrationDetailController(window.IntegrationDetails);