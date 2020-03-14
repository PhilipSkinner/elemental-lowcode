const integrationService = function(request) {
	this.request = request;
};

integrationService.prototype.callIntegration = function(name, method, params) {
	return new Promise((resolve, reject) => {
		this.request[method](`http://localhost:8004/${name}`, {
			qs : params
		}, (err, res, body) => {
			return resolve(JSON.parse(body));
		});
	});
};

module.exports = function(request) {
	if (!request) {
		request = require("request");
	}

	return new integrationService(request);
};