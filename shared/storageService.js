const storageService = function(request) {
	this.request = request;
	this.authClientProvider = null;
};

storageService.prototype.setAuthClientProvider = function(authClientProvider) {
	this.authClientProvider = authClientProvider;
};

storageService.prototype.detailCollection = function(name, authToken) {
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
			this.request.get(`http://localhost:8006/${name}/.details`, {
				headers : {
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
					console.log(body);
					return reject(new Error("Invalid response received from collection details"));
				}

				return resolve(result);
			});
		});
	});
};

storageService.prototype.getList = function(name, start, count, filters, authToken) {
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
		const qs = {
			start : start,
			count : count
		};

		if (typeof(filters) === "object" && filters !== null) {
			Object.keys(filters).forEach((path) => {
				qs['filter_' + path] = filters[path];
			});
		}

		return new Promise((resolve, reject) => {
			this.request.get(`http://localhost:8006/${name}`, {
				headers : {
					Authorization : `Bearer ${token}`
				},
				qs : qs
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				let result = null;
				try {
					result = JSON.parse(body);
				} catch(e) {
					return reject(new Error("Invalid response received from getting list of results"));
				}

				return resolve(result);
			});
		});
	});
};

storageService.prototype.getEntity = function(name, id, authToken) {
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
			this.request.get(`http://localhost:8006/${name}/${id}`, {
				headers : {
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
					return reject(new Error("Invalid response received when fetching entity"));
				}

				result.id = id;
				return resolve(result);
			});
		});
	});
};

storageService.prototype.createEntity = function(name, entity, authToken) {
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
			this.request.post(`http://localhost:8006/${name}`, {
				body : JSON.stringify(entity),
				headers : {
					"content-type" : "application/json",
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode === 201) {
					return resolve();
				}

				return reject(body);
			});
		});
	});
};

storageService.prototype.updateEntity = function(name, id, entity, authToken) {
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
			this.request.put(`http://localhost:8006/${name}/${id}`, {
				body : JSON.stringify(entity), 
				headers : {
					"content-type" : "application/json",
					Authorization : `Bearer ${token}`	
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				return resolve();
			});
		});
	});
};

storageService.prototype.deleteEntity = function(name, id, authToken) {
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
			this.request.delete(`http://localhost:8006/${name}/${id}`, {
				headers : {
					Authorization : `Bearer ${token}`	
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				return resolve();
			});
		});
	});
};

module.exports = function(request) {
	if (!request) {
		request = require("request");
	}

	return new storageService(request);
};