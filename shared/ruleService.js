const ruleService = function(request, hostnameResolver) {
	this.request 			= request;
	this.hostnameResolver 	= hostnameResolver;
};

ruleService.prototype.setAuthClientProvider = function(authClientProvider) {
	this.authClientProvider = authClientProvider;
};

ruleService.prototype.callRuleset = function(name, facts, authToken) {
	return new Promise((resolve, reject) => {
		if (authToken) {
			return resolve(authToken);
		}

		if (this.authClientProvider) {
			return this.authClientProvider.getAccessToken().then((token) => {
				return resolve(token);
			}).catch(reject);
		}

		return resolve("");
	}).then((token) => {
		return new Promise((resolve, reject) => {
			this.request.post(`${this.hostnameResolver.resolveRules()}/${name}`, {
				body : JSON.stringify(facts),
				headers : {
					"content-type" : "application/json",
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				let result = null;
				try {
					result = JSON.parse(body);
				} catch(e) {
					return reject(new Error("Invalid response received from ruleset call"));
				}

				return resolve(result);
			});
		});
	});
};

module.exports = function(request, hostnameResolver) {
	if (!request) {
		request = require("request");
	}

	if (!hostnameResolver) {
		hostnameResolver = require("./hostnameResolver")();
	}

	return new ruleService(request, hostnameResolver);
};