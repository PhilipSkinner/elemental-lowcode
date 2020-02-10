const tokenHandler = function(pubKey, jwt) {
	this.pubKey = pubKey;
	this.jwt = jwt;
};

tokenHandler.prototype.tokenCheck = function(req, res, next) {
	let token = req.headers['x-access-token'] || req.headers['authorization'] || '';
	if (token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}

	if (token) {
		console.log(token, this.pubKey);

		this.jwt.verify(token, this.pubKey, { algorithms: ['RS256'] }, (err, decoded) => {
			if (err) {
				res.status(401);
				res.end();
				return;
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(401);
		res.end();
		return;
	}
}

module.exports = function(pubKey, jwt) {
	if (!jwt) {
		jwt = require('jsonwebtoken');
	}

	return new tokenHandler(pubKey, jwt);
};