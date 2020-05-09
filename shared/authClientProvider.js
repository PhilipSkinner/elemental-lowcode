const authClientProvider = function(config, request) {
	this.config = config;
	this.request = request;
};

authClientProvider.prototype.setSessionState = function(sessionState) {
	this.sessionState = sessionState;
};

authClientProvider.prototype.loginUser = function(username, password) {
	return new Promise((resolve, reject) => {
		this.request.post("http://localhost:8008/token", {
			form : {
				grant_type 		: "password",
				username 		: username,
				password 		: password,
				scope 			: this.config.scope,
				client_id 		: this.config.client_id,
				client_secret 	: this.config.client_secret,
			}
		}, (err, res, body) => {
			if (err) {
				return reject(err);
			}

			if (res.statusCode === 200) {
				//parse the payload
				const payload = JSON.parse(body);

				//set our sessions access token
				this.sessionState.setAccessToken(payload.access_token);

				//and our identity
				this.sessionState.setIdentityToken(payload.id_token);

				//finally, our refresh token
				this.sessionState.setRefreshToken(payload.refresh_token);

				//and resolve
				return resolve();
			}

			return reject(new Error('Invalid credentials'));
		});
	});
};


authClientProvider.prototype.getAccessToken = function() {
	let token = this.sessionState && this.sessionState.getAccessToken ? this.sessionState.getAccessToken() : null;

	if (token) {
		return Promise.resolve(token);
	}

	if (!this.config) {
		return Promise.resolve("");
	}

	return new Promise((resolve, reject) => {
		this.request.post("http://localhost:8008/token", {
			form : {
				grant_type 		: "client_credentials",
				scope 			: this.config.scope,
				client_id 		: this.config.client_id,
				client_secret 	: this.config.client_secret
			}
		}, (err, response, body) => {
			if (err) {
				return reject(new Error("Error fetching client token"));
			}

			let data = null;
			try {
				data = JSON.parse(body);
			} catch(e) {
				return reject(new Error("Error parsing token response"));
			}

			if (data && data.access_token) {
				return resolve(data.access_token);
			}

			return resolve("");
		});
	});
};

module.exports = function(config, request) {
	if (!request) {
		request = require("request");
	}

	return new authClientProvider(config, request);
};