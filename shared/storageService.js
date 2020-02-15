const storageService = function(request) {
	this.request = request;
};

storageService.prototype.detailCollection = function(name, token) {
	return new Promise((resolve, reject) => {
		this.request.get(`http://localhost:8006/${name}/.details`, {
			headers : {
				Authorization : `Bearer ${token}`
			}
		}, (err, res, body) => {
			return resolve(JSON.parse(body));
		});
	});
};

storageService.prototype.getList = function(name, start, count, token) {
	return new Promise((resolve, reject) => {
		this.request.get(`http://localhost:8006/${name}?start=${start}&count=${count}`, {
			headers : {
				Authorization : `Bearer ${token}`
			}
		}, (err, res, body) => {
			return resolve(JSON.parse(body));
		});
	});
};

storageService.prototype.getEntity = function(name, id, token) {
	return new Promise((resolve, reject) => {
		this.request.get(`http://localhost:8006/${name}/${id}`, {
			headers : {
				Authorization : `Bearer ${token}`
			}
		}, (err, res, body) => {
			var data = JSON.parse(body);
			data.id = id;
			return resolve(data);
		});
	});
};

storageService.prototype.createEntity = function(name, entity, token) {
	return new Promise((resolve, reject) => {
		this.request.post(`http://localhost:8006/${name}`, {
			body : JSON.stringify(entity),
			headers : {
				'content-type' : 'application/json',
				Authorization : `Bearer ${token}`
			}
		}, (err, res, body) => {
			console.log(body);
			return resolve();
		});
	});
};

storageService.prototype.updateEntity = function(name, id, entity, token) {
	return new Promise((resolve, reject) => {
		this.request.put(`http://localhost:8006/${name}/${id}`, {
			body : JSON.stringify(entity), 
			headers : {
				'content-type' : 'application/json',
				Authorization : `Bearer ${token}`	
			}
		}, (err, res, body) => {
			return resolve();
		});
	});
};

module.exports = function(request) {
	if (!request) {
		request = require('request');
	}

	return new storageService(request);
};