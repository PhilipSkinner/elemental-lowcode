const idm = function(app, roleCheckHandler, db, bcrypt, tokenHandler) {
	this.app 				= app;
	this.roleCheckHandler 	= roleCheckHandler;
	this.db 				= db;
	this.userDB 			= new this.db("User");
	this.bcrypt 			= bcrypt;
	this.tokenHandler 		= tokenHandler;

	this.connected 			= false;

	//support none HTTP usage of lib
	if (this.app) {
		this.initRoutes();
	}
};

idm.prototype.getUsers = function(req, res, next) {
	this._connect().then(() => {
		return this.userDB.fetch();
	}).then((users) => {
		res.json(users);
		next();
	});
};

idm.prototype.getUser = function(req, res, next) {
	this._connect().then(() => {
		return this.userDB.find(req.params.id);
	}).then((user) => {
		res.json(user);
		next();
	});
};

idm.prototype.createUser = function(req, res, next) {
	this._connect().then(() => {
		this.userDB.find(req.body.username);
	}).then((existing) => {
		console.log(existing);
		if (typeof(existing) !== 'undefined' && existing !== null) {
			res.status(409);
			res.send("");
			next();
			return Promise.reject(new Error('User already exists'));
		}

		//generate the password
		return new Promise((resolve, reject) => {
			this.bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					return reject(err);
				}

				return resolve(hash);
			});
		});
	}).then((password) => {
		req.body.password = password;
		return this.userDB.upsert(req.body.username, req.body, null);
	}).then(() => {
		res.setHeader("Location", `/api/users/${req.body.username}`);
		res.status(201);
		res.send("");
		next();
	}).catch((err) => {
		console.log(err);
	});
};

idm.prototype.updateUser = function(req, res, next) {
	this._connect().then(() => {
		//do we need to generate a password?
		if (/^\$\d.\$\d{1,2}.*?\..*?$/gm.test(req.body.password) === false) {
			return new Promise((resolve, reject) => {
				this.bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return reject(err);
					}

					return resolve(hash);
				});
			});
		}

		return Promise.resolve(req.body.password);
	}).then((password) => {
		req.body.password = password;
		return this.userDB.upsert(req.params.id, req.body, null);
	}).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

idm.prototype.deleteUser = function(req, res, next) {
	this._connect().then(() => {
		return this.userDB.destroy(req.params.id);
	}).then(() => {
		res.status(204);
		res.send("");
		next();
	});
};

idm.prototype._connect = function() {
	if (this.connected) {
		return Promise.resolve();
	}

	return new Promise((resolve, reject) => {
		this.db.connect().then(() => {
			this.connected = true;
			return resolve();
		});
	});
}

idm.prototype.initRoutes = function() {
	this.app.use("/api", 					this.tokenHandler.tokenCheck.bind(this.tokenHandler));

	this.app.get("/api/users", 				this.roleCheckHandler.enforceRoles(this.getUsers.bind(this), 		["user_reader", "user_admin", "system_reader", "system_admin"]));
	this.app.get("/api/users/:id", 			this.roleCheckHandler.enforceRoles(this.getUser.bind(this), 		["user_reader", "user_admin", "system_reader", "system_admin"]));
	this.app.post("/api/users", 			this.roleCheckHandler.enforceRoles(this.createUser.bind(this), 		["user_writer", "user_admin", "system_writer", "system_admin"]));
	this.app.put("/api/users/:id", 			this.roleCheckHandler.enforceRoles(this.updateUser.bind(this), 		["user_writer", "user_admin", "system_writer", "system_admin"]));
	this.app.delete("/api/users/:id",		this.roleCheckHandler.enforceRoles(this.deleteUser.bind(this), 		["user_writer", "user_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, roleCheckHandler, db, bcrypt, tokenHandler) {
	if (!db) {
		db = require("../../shared/db")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require('../../shared/roleCheckHandler')();
	}

	if (!bcrypt) {
		bcrypt = require("bcrypt");
	}

	if (!tokenHandler) {
		tokenHandler = require('../../shared/tokenHandler')(process.env.SIG_PUBLIC);
	}

	return new idm(app, roleCheckHandler, db, bcrypt, tokenHandler);
};