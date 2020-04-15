const _rulesController = function(page) {
	this._page = page;
	this.rules = [];
};

_rulesController.prototype.getRules = function() {
	return {
		rules : this.rules
	};
};

_rulesController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_rulesController.prototype.fetchRules = function() {
	return window.axios
		.get("http://localhost:8001/rules", {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			response.data = response.data.map((w) => {
				w.url = `http://localhost:8007/${w.name}/`;
				return w;
			});

			this.rules = response.data;
			this.caller.rules = response.data;
			this.caller.$forceUpdate();
		});
};

_rulesController.prototype.removeRule = function(rule) {
	return window.axios
		.delete(`http://localhost:8001/rules/${rule}`, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		})
		.then((response) => {
			return this.fetchRules();
		});
};

window.Rules = {
	template : "#template-rules",
	data 	 : () => {
		return window._rulesControllerInstance.getRules();
	},
	mounted  : function() {
		window._rulesControllerInstance.setCaller(this);
		return window._rulesControllerInstance.fetchRules();
	}
};

window._rulesControllerInstance = new _rulesController(window.Rules);