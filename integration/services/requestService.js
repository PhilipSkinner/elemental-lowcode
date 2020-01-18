const requestService = function(request, stringParser) {
	this.request = request;
	this.stringParser = stringParser;
};

requestService.prototype.sendRequest = function(requestConfig, variables) {
	return new Promise((resolve, reject) => {
		this.request({
			method 	: requestConfig.method,
			uri 	: this.stringParser.parseString(requestConfig.uri, variables),
		}, (err, res) => {			
			if (err) {
				return reject(err);
			}

			return resolve(res);	
		});
	});
};

module.exports = function(request, stringParser) {
	if (!request) {
		request = require('request');
	}

	if (!stringParser) {
		stringParser = require('./stringParser')();
	}

	return new requestService(request, stringParser);
};