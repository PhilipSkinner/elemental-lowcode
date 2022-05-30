const _ruleDetailController = function(page) {
    this._page = page;
    this.name = name;
    this.caller = null;
    this.ruleset = {
        roles : {
            needsRole : false
        }
    };
    this.examplePostBody = null;
    this.navitems = [];
    this.loading = true;
};

_ruleDetailController.prototype.setLoading = function() {
    this.loading = true;
};

_ruleDetailController.prototype.setLoaded = function() {
    setTimeout(() => {
        this.loading = false;
        this.forceRefresh();
    }, 10);
};

_ruleDetailController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_ruleDetailController.prototype.getData = function() {
    return {
        name            : this.name,
        ruleset         : this.ruleset,
        examplePostBody : this.examplePostBody,
        navitems        : this.navitems,
        loading         : this.loading
    };
};

_ruleDetailController.prototype.forceRefresh = function() {
    this.caller.ruleset         = this.ruleset;
    this.caller.examplePostBody = this.examplePostBody;
    this.caller.navitems        = this.navitems;
    this.caller.name            = this.name;
    this.caller.loading         = this.loading;

    this.caller.$forceUpdate();
};

_ruleDetailController.prototype.setNavItems = function() {
    this.navitems = [
        {
            name            : "Documentation",
            selected        : true,
            route_name      : "rulesetDetails",
            route_params    : {
                name : this.name
            }
        },
        {
            name            : "Modify",
            selected        : false,
            route_name      : "rulesetEditor",
            route_params    : {
                name : this.name
            }
        }
    ];
};

_ruleDetailController.prototype.fetchRule = function(name) {
    this.name = name;

    this.setNavItems();

    return window.axiosProxy
        .get(`${window.hosts.kernel}/rules/${name}`)
        .then((response) => {
            this.ruleset = response.data;
            this.examplePostBody = JSON.stringify(window.JSONSchemaFaker.generate(this.ruleset.facts), null, 4);

            this.setLoaded();
            this.forceRefresh();
        });
};

window.RuleDetails = {
    template : "#template-ruleDetails",
    data 	 : () => {
        return window._ruleDetailInstance.getData();
    },
    mounted  : function() {
        return window._ruleDetailInstance.fetchRule(this.$route.params.name);
    },
    beforeCreate : function() {
        window._ruleDetailInstance.setCaller(this);
        window._ruleDetailInstance.setLoading();
    }
};

window._ruleDetailInstance = new _ruleDetailController(window.RuleDetails);