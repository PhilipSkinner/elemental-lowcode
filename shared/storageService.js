const storageService = function(request, hostnameResolver) {
	this.request 			= request;
	this.authClientProvider = null;
	this.hostnameResolver 	= hostnameResolver;
};

storageService.prototype.setAuthClientProvider = function(authClientProvider) {
	this.authClientProvider = authClientProvider;
};

storageService.prototype.detailCollection = function(path, authToken) {
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
			this.request.get(`${this.hostnameResolver.resolveStorage()}/${path}`, {
				headers : {
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode !== 200) {
					return reject(body);
				}

				let result = null;
				try {
					result = JSON.parse(body);
				} catch(e) {
					return reject(new Error("Invalid response received from collection details"));
				}

				return resolve(result);
			});
		});
	});
};

storageService.prototype.getList = function(path, start, count, filters, orders, authToken) {
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
				qs[`filter_${path}`] = filters[path];
			});
		}

		if (typeof(orders) === "object" && orders !== null) {
			Object.keys(orders).forEach((path) => {
				qs[`order_${path}`] = orders[path];
			})
		}

		return new Promise((resolve, reject) => {
			this.request.get(`${this.hostnameResolver.resolveStorage()}/${path}`, {
				headers : {
					Authorization : `Bearer ${token}`
				},
				qs : qs
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode !== 200) {
					return reject(body);
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

storageService.prototype.getEntity = function(path, id, authToken) {
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
			this.request.get(`${this.hostnameResolver.resolveStorage()}/${path}/${id}`, {
				headers : {
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode !== 200) {
					return reject(body);
				}

				let result = null;
				try {
					result = JSON.parse(body);
				} catch(e) {
					return reject(new Error("Invalid response received when fetching entity"));
				}

				result.id = result.id || id;
				return resolve(result);
			});
		});
	});
};

storageService.prototype.createEntity = function(path, entity, authToken) {
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
			this.request.post(`${this.hostnameResolver.resolveStorage()}/${path}`, {
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
					return this.getEntity(path, res.headers.location.split("/").slice(-1)[0], token).then(resolve).catch(reject);
				}

				return reject(body);
			});
		});
	});
};

storageService.prototype.updateEntity = function(path, id, entity, authToken) {
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
			this.request.put(`${this.hostnameResolver.resolveStorage()}/${path}/${id}`, {
				body : JSON.stringify(entity),
				headers : {
					"content-type" : "application/json",
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode !== 204) {
					return reject(body);
				}

				return resolve();
			});
		});
	});
};

storageService.prototype.patchEntity = function(path, id, entity, authToken) {
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
			this.request.patch(`${this.hostnameResolver.resolveStorage()}/${path}/${id}`, {
				body : JSON.stringify(entity),
				headers : {
					"content-type" : "application/json",
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode !== 204) {
					return reject(body);
				}

				return resolve();
			});
		});
	});
};

storageService.prototype.deleteEntity = function(path, id, authToken) {
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
			this.request.delete(`${this.hostnameResolver.resolveStorage()}/${path}/${id}`, {
				headers : {
					Authorization : `Bearer ${token}`
				}
			}, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode !== 204) {
					return reject(body);
				}

				return resolve();
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

	return new storageService(request, hostnameResolver);
};