const idm = function(app, roleCheckHandler, db, bcrypt, tokenHandler, uuid, emailValidator) {
    this.app 				= app;
    this.roleCheckHandler 	= roleCheckHandler;
    this.db 				= db;
    this.userDB 			= new this.db("User");
    this.clientDB  			= new this.db("Client");
    this.bcrypt 			= bcrypt;
    this.tokenHandler 		= tokenHandler;
    this.uuid 				= uuid;
    this.emailValidator     = emailValidator;

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
    if (
        typeof(req.body.username) === "undefined"
        || req.body.username === null
        || req.body.username.replace(/ /g, "") === ""
        || !this.emailValidator.validate(req.body.username)
    ) {
        res.status(400);
        res.json({
            errors : [
                "Username must be an email address."
            ]
        });
        return;
    }

    this._connect().then(() => {
        this.userDB.find(req.body.subject);
    }).then((existing) => {
        if (typeof(existing) !== "undefined" && existing !== null) {
            res.status(409);
            res.send("");
            next();
            return Promise.reject(new Error("User already exists"));
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
        req.body.subject = this.uuid();
        return this.userDB.upsert(req.body.subject, req.body, null);
    }).then(() => {
        res.setHeader("Location", `/api/users/${req.body.subject}`);
        res.status(201);
        res.send("");
        next();
    }).catch((err) => {
        console.error(err);
    });
};

idm.prototype.updateUser = function(req, res, next) {
    if (
        typeof(req.body.username) === "undefined"
        || req.body.username === null
        || req.body.username.replace(/ /g, "") === ""
        || !this.emailValidator.validate(req.body.username)
    ) {
        res.status(400);
        res.json({
            errors : [
                "Username must be an email address."
            ]
        });
        return;
    }

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

idm.prototype.createClient = function(req, res, next) {
    this._connect().then(() => {
        return this.clientDB.upsert(req.body.client_id, req.body, null);
    }).then(() => {
        res.setHeader("Location", `/api/clients/${req.body.client_id}`);
        res.status(201);
        res.send("");
        next();
    }).catch((err) => {
        console.error(err);
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
        }).catch(reject);
    });
};

idm.prototype.initRoutes = function() {
    this.app.use("/api", 					this.tokenHandler.tokenCheck.bind(this.tokenHandler));

    this.app.get("/api/users", 				this.roleCheckHandler.enforceRoles(this.getUsers.bind(this), 		["user_reader", "user_admin", "system_reader", "system_admin"]));
    this.app.get("/api/users/:id", 			this.roleCheckHandler.enforceRoles(this.getUser.bind(this), 		["user_reader", "user_admin", "system_reader", "system_admin"]));
    this.app.post("/api/users", 			this.roleCheckHandler.enforceRoles(this.createUser.bind(this), 		["user_writer", "user_admin", "system_writer", "system_admin"]));
    this.app.put("/api/users/:id", 			this.roleCheckHandler.enforceRoles(this.updateUser.bind(this), 		["user_writer", "user_admin", "system_writer", "system_admin"]));
    this.app.delete("/api/users/:id",		this.roleCheckHandler.enforceRoles(this.deleteUser.bind(this), 		["user_writer", "user_admin", "system_writer", "system_admin"]));

    //todo: need to complete these IdM endpoints
    this.app.post("/api/clients", 			this.roleCheckHandler.enforceRoles(this.createClient.bind(this), 	["client_writer", "client_admin", "system_writer", "system_admin"]));
};

module.exports = function(app, roleCheckHandler, db, bcrypt, tokenHandler, uuid, emailValidator) {
    if (!db) {
        db = require("../../support.lib/db")();
    }

    if (!roleCheckHandler) {
        roleCheckHandler = require("../../support.lib/roleCheckHandler")();
    }

    if (!bcrypt) {
        bcrypt = require("bcrypt");
    }

    if (!tokenHandler) {
        tokenHandler = require("../../support.lib/tokenHandler")();
    }

    if (!uuid) {
        uuid = require("uuid").v4;
    }

    if (!emailValidator) {
        emailValidator = require("email-validator");
    }

    return new idm(app, roleCheckHandler, db, bcrypt, tokenHandler, uuid, emailValidator);
};