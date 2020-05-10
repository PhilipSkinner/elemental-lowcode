const _ruleDetailController = function(page) {
	this._page = page;
	this.caller = null;
	this.data = {
		ruleset 	: this.ruleset
	};
};

_ruleDetailController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_ruleDetailController.prototype.getData = function() {
	return this.data;
};

_ruleDetailController.prototype.fetchRule = function(name) {
	this.name = name;
	return window.axios
		.get(`${window.hosts.kernel}/rules/${name}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			this.ruleset = response.data;
			this.caller.ruleset = response.data;

			this.examplePostBody = JSON.stringify(window.JSONSchemaFaker.generate(this.ruleset.facts), null, 4);
			this.caller.examplePostBody = this.examplePostBody;

			this.caller.$forceUpdate();
		});
};

window.RuleDetails = {
	template : "#template-ruleDetails",
	data 	 : () => {
		return window._ruleDetailInstance.getData();
	},
	mounted  : function() {
		window._ruleDetailInstance.setCaller(this);
		return window._ruleDetailInstance.fetchRule(this.$route.params.name);
	}
};

window._ruleDetailInstance = new _ruleDetailController(window.RuleDetails);