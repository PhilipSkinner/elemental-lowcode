const idmService = function(request) {
	this.request = request;
	this.authClientProvider = null;
};

idmService.prototype.setAuthClientProvider = function(authClientProvider) {
	this.authClientProvider = authClientProvider;
};

idmService.prototype._getToken = function(authToken) {
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
	});
};

idmService.prototype.registerUser = function(user, authToken) {
	return this._getToken(authToken).then((token) => {
		return new Promise((resolve, reject) => {
			this.request.post("http://localhost:8008/api/users", {
				body : JSON.stringify(user),
				headers : {
					Authorization 	: `Bearer ${token}`,
					"content-type" 	: "application/json"
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode === 201) {
					return this.getUser(res.headers.location.split('/').slice(-1)[0], authToken).then(resolve).catch(reject);
				}

				return reject(body);
			});
		});
	});
};

idmService.prototype.getUser = function(user, authToken) {
	return this._getToken(authToken).then((token) => {
		return new Promise((resolve, reject) => {
			this.request.get(`http://localhost:8008/api/users/${user}`, {
				headers : {
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode === 200) {
					return resolve(JSON.parse(body));
				}

				return reject(body);
			});
		});
	});
};

module.exports = function(request) {
	if (!request) {
		request = require("request");
	}

	return new idmService(request);
};