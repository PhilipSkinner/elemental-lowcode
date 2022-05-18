const roleCheckHandler = function() {

};

roleCheckHandler.prototype.enforceRoles = function(middleware, roles) {
    return (req, res, next) => {
        let token = req.headers['x-access-token'] || req.headers['authorization'] || '';
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        if (!token) {
            if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.accessToken) {
                token = req.session.passport.user.accessToken;
            }
        }

        let found = false;
        try {
            let claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));

            //null roles means we just allow it through
            if (roles === null) {
                found = true;
            } else {
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
            }
        } catch(e) {
            found = false;
        }

        if (!found) {
            res.status(403);
            res.end();
            return;
        }

        middleware(req, res, next);
    };
};

module.exports = function() {
    return new roleCheckHandler();
};