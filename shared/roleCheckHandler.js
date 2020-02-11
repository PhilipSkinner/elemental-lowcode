const roleCheckHandler = function() {

};

roleCheckHandler.prototype.enforceRoles = function(middleware, roles) {
	return (req, res, next) => {
		let token = req.headers['x-access-token'] || req.headers['authorization'] || '';
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length);
		}

		let found = false;
		try {
			let claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));

			if (claims.role || claims.roles) {
				let r = claims.role || claims.roles;
				if (!Array.isArray(r)) {
					r = [r];
				}

				roles.forEach((fr) => {
					if (r.indexOf(fr) !== -1) {
						found = true;
					}
				});
			}
		} catch(e) {}

		if (!found) {
			res.status(401);
			res.end();
			return;
		}
		
		middleware(req, res, next);
	};
};

module.exports = function() {
	return new roleCheckHandler();
};