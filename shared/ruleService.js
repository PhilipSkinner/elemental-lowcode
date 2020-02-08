const ruleService = function(request) {
	this.request = request;
};

ruleService.prototype.callRuleset = function(name, facts) {
	return new Promise((resolve, reject) => {
		this.request.post(`http://localhost:8007/${name}`, {
			body : JSON.stringify(facts),
			headers : {
				'content-type' : 'application/json'
			}
		}, (err, res, body) => {
			return resolve(JSON.parse(body));
		});
	});
};

module.exports = function(request) {
	if (!request) {
		request = require('request');
	}

	return new ruleService(request);
};