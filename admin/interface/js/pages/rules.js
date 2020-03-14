const _rulesController = function(page) {
	this._page = page;
	this.rules = [];
};

_rulesController.prototype.getRules = function() {
	return {
		rules : this.rules
	};
};

_rulesController.prototype.fetchRules = function(caller) {
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
			caller.rules = response.data;
			caller.$forceUpdate();
		});
};

window.Rules = {
	template : "#template-rules",
	data 	 : () => {
		return window._rulesControllerInstance.getRules();
	},
	mounted  : function() {
		return window._rulesControllerInstance.fetchRules(this);
	}
};

window._rulesControllerInstance = new _rulesController(window.Rules);