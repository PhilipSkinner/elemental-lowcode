const storageService = function(request) {
	this.request = request;
};

storageService.prototype.detailCollection = function(name) {
	return new Promise((resolve, reject) => {
		this.request.get(`http://localhost:8006/${name}/.details`, (err, res, body) => {
			return resolve(JSON.parse(body));
		});
	});
};

module.exports = function(request) {
	if (!request) {
		request = require('request');
	}

	return new storageService(request);
};