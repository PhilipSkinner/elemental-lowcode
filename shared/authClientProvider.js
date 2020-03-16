const authClientProvider = function(config, request) {
	this.config = config;
	this.request = request;
};

authClientProvider.prototype.setSessionState = function(sessionState) {
	this.sessionState = sessionState;
};

authClientProvider.prototype.getAccessToken = function() {
	let token = this.sessionState && this.sessionState.getAccessToken ? this.sessionState.getAccessToken() : null;

	if (token) {
		return Promise.resolve(token);
	}

	return new Promise((resolve, reject) => {
		this.request.post('http://localhost:8008/token', {
			form : {
				grant_type 		: 'client_credentials',
				scope 			: this.config.scope,
				client_id 		: this.config.client_id,
				client_secret 	: this.config.client_secret
			}
		}, (err, response, body) => {
			if (err) {
				return reject(new Error('Error fetching client token'));
			}

			let data = null;
			try {
				data = JSON.parse(body);
			} catch(e) {
				return reject(new Error('Error parsing token response'));
			}

			if (data && data.access_token) {
				return resolve(data.access_token);
			}

			return resolve('');
		});
	});
};

module.exports = function(config, request) {
	if (!request) {
		request = require("request");
	}

	return new authClientProvider(config, request);
};