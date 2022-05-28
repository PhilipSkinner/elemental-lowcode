const _blobDetailController = function(page) {
    this._page = page;
    this.name = name;
    this.caller = null;
    this.store = {
        roles : {
            needsRole : false
        }
    };
    this.examplePostBody = null;
    this.navitems = [];
    this.loading = true;
};

_blobDetailController.prototype.setLoading = function() {
    this.loading = true;
};

_blobDetailController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_blobDetailController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_blobDetailController.prototype.getData = function() {
    return {
        name            : this.name,
        store           : this.store,
        navitems        : this.navitems,
        loading         : this.loading
    };
};

_blobDetailController.prototype.forceRefresh = function() {
    this.caller.store           = this.store;
    this.caller.navitems        = this.navitems;
    this.caller.name            = this.name;
    this.caller.loading         = this.loading;

    this.caller.$forceUpdate();
};

_blobDetailController.prototype.setNavItems = function() {
    this.navitems = [
        {
            name            : 'Documentation',
            selected        : true,
            route_name      : 'blobDetails',
            route_params    : {
                name : this.name
            }
        },
        {
            name            : 'Modify',
            selected        : false,
            route_name      : 'blobEditor',
            route_params    : {
                name : this.name
            }
        },
        {
            name            : 'Browse',
            selected        : false,
            route_name      : 'blobBrowser',
            route_params    : {
                name : this.name
            }
        }
    ];
};

_blobDetailController.prototype.fetchStore = function(name) {
    this.name = name;

    this.setNavItems();

    return window.axiosProxy
        .get(`${window.hosts.kernel}/blob/stores/${name}`)
        .then((response) => {
            this.store = response.data;

            this.setLoaded();
            this.forceRefresh();
        });
};

window.BlobDetails = {
    template : '#template-blobDetails',
    data     : () => {
        return window._blobDetailInstance.getData();
    },
    mounted  : function() {
        return window._blobDetailInstance.fetchStore(this.$route.params.name);
    },
    beforeCreate : function() {
        window._blobDetailInstance.setCaller(this);
        window._blobDetailInstance.setLoading();
    }
};

window._blobDetailInstance = new _blobDetailController(window.BlobDetails);