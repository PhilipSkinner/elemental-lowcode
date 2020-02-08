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
	return axios
		.get('http://localhost:8001/rules')
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

const Rules = {
	template : '#template-rules',
	data 	 : () => {
		return _rulesControllerInstance.getRules();
	},
	mounted  : function() {
		return _rulesControllerInstance.fetchRules(this);
	}
};

const _rulesControllerInstance = new _rulesController(Rules);