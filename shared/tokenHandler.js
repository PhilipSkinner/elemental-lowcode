const tokenHandler = function(pubKey, config, jwt) {
	this.pubKey = pubKey;
	this.config = config || {
		ignore : []
	};
	this.jwt = jwt;
};

tokenHandler.prototype.tokenCheck = function(req, res, next) {
	//is this in our ignore list?
	let shouldIgnore = false;
	this.config.ignore.forEach((reg) => {
		if (reg.test(req.path)) {
			shouldIgnore = true;
		}
	});

	if (shouldIgnore) {
		next();
		return;
	}

	let token = req.headers["x-access-token"] || req.headers["authorization"] || "";

	if (token.startsWith("Bearer ")) {
		token = token.slice(7, token.length);
	}

	if (token) {
		this.jwt.verify(token, this.pubKey, { algorithms: ["RS256"] }, (err, decoded) => {
			if (err) {
				console.error("Invalid bearer token received on", req.path);
				res.status(401);
				res.end();
				return;
			} else {
				req.decoded = decoded;
				next();
				return;
			}
		});
	} else {
		res.status(401);
		res.end();
		return;
	}
};

module.exports = function(pubKey, config, jwt) {
	if (!jwt) {
		jwt = require("jsonwebtoken");
	}

	return new tokenHandler(pubKey, config, jwt);
};