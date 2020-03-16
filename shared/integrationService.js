const integrationService = function(request) {
	this.request = request;
};

integrationService.prototype.setAuthClientProvider = function(authClientProvider) {
	this.authClientProvider = authClientProvider;
};

integrationService.prototype.callIntegration = function(name, method, params, authToken) {
	return new Promise((resolve, reject) => {
		if (authToken) {
			return resolve(authToken);
		}

		if (this.authClientProvider) {
			return this.authClientProvider.getAccessToken().then((token) => {
				return resolve(token);
			}).catch(reject);
		}

		return resolve('');
	}).then((token) => {
		return new Promise((resolve, reject) => {
			this.request[method](`http://localhost:8004/${name}`, {
				qs : params
			}, (err, res, body) => {
				return resolve(JSON.parse(body));
			});
		});
	});
};

module.exports = function(request) {
	if (!request) {
		request = require("request");
	}

	return new integrationService(request);
};