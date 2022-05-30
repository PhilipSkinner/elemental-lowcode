const util = require("util");

const sqlSessionStore = function(connectionString, siteName, sqlStore) {
    this.connectionString = connectionString;
    this.name = `${siteName}__sessions`;
    this.tableDefinition = {
        "name" : this.name,
        "keys" : [
            {
                "type" : "unique",
                "paths" : [
                    "$.id"
                ]
            }
        ],
        "schema" : {
            "type" : "object",
            "properties" : {
                "session" : {
                    "type" : "string"
                }
            }
        }
    };

    this.sqlStore = sqlStore(connectionString, this.tableDefinition);
};

sqlSessionStore.prototype.all = function(cb) {
    this.sqlStore.getResources(this.name, 1, 500, []).then((sessions) => {
        cb(null, sessions.map((s) => {
            return JSON.parse(s.session);
        }));
    }).catch((err) => {
        cb(err);
    });
};

sqlSessionStore.prototype.destroy = function(sid, cb) {
    this.sqlStore.deleteResource(this.name, sid).then(() => {
        if (cb && typeof(cb) === "function") {
            cb();
        }
    }).catch((err) => {
        if (cb && typeof(cb) === "function") {
            cb(err);
        }
    });
};

sqlSessionStore.prototype.clear = function(cb) {
    cb(new Error("Not implemented"));
};

sqlSessionStore.prototype.length = function(cb) {
    cb(new Error("Not implemented"));
};

sqlSessionStore.prototype.get = function(sid, cb) {
    this.sqlStore.getResource(this.name, sid).then((session) => {
        if (!session) {
            cb(null, null);
        } else {
            cb(null, JSON.parse(session.session));
        }
    }).catch((err) => {
        cb(err);
    });
};

sqlSessionStore.prototype.set = function(sid, session, cb) {
    this.sqlStore.createResource(this.name, sid, {
        session : JSON.stringify(session)
    }).then(() => {
        cb();
    }).catch((err) => {
        if (err.toString().indexOf("Resource already exists") !== -1) {
            this.sqlStore.updateResource(this.name, sid, {
                session : JSON.stringify(session)
            }).then(() => {
                cb();
            }).catch((_err) => {
                cb(_err);
            });
        } else {
            cb(err);
        }
    });
};

sqlSessionStore.prototype.touch = function(sid, session, cb) {
    this.set(sid, session, cb);
};

module.exports = function(session, connectionString, siteName, sqlStore) {
    if (!sqlStore) {
        sqlStore = require("./stores/sqlStore");
    }

    if (session) {
        util.inherits(sqlSessionStore, session.Store);
    }

    return new sqlSessionStore(connectionString, siteName, sqlStore);
};