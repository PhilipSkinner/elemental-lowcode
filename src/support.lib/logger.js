const logger = function(log4js) {
    process.setMaxListeners(0);
    log4js.configure(require("./config/log4js.json"));

    this.loggers = {
        admin 		: log4js.getLogger("admin"),
        api 		: log4js.getLogger("api"),
        integration : log4js.getLogger("integration"),
        interface 	: log4js.getLogger("interface"),
        storage 	: log4js.getLogger("storage"),
        rules 		: log4js.getLogger("rules"),
        identity 	: log4js.getLogger("identity"),
        messaging 	: log4js.getLogger("messaging"),
        blob        : log4js.getLogger("blob"),
        default 	: log4js.getLogger("default"),
    };

    //set the levels on all
    Object.keys(this.loggers).forEach((k) => {
        this.loggers[k].level = "debug";
    });
};

logger.prototype.logStartup = function(name) {
    const parts = [
        "",
        "=====================================================",
        ` App: ${name} `,
        ` Started: ${new Date()}`,
        "=====================================================",
        ""
    ];

    parts.forEach((p) => {
        this.log(name, p);
    });
};

logger.prototype._processArgs = function(args) {
    const ret = [];

    Object.keys(args).forEach((n) => {
        if (n !== "0") {
            ret.push(args[n]);
        }
    });

    return ret;
};

logger.prototype._isWarningPresent = function(args) {
    let found = false;

    args.forEach((a) => {
        if (a.toLowerCase().indexOf("warning") === 0) {
            found = true;
        }
    });

    return found;
};

logger.prototype.log = function(app) {
    if (!this.loggers[app]) {
        app = "default";
    }

    const args = this._processArgs(arguments);

    if (this._isWarningPresent(args)) {
        this.loggers[app].warn.apply(this.loggers[app], args);
    } else {
        this.loggers[app].info.apply(this.loggers[app], args);
    }
};

logger.prototype.error = function(app) {
    if (!this.loggers[app]) {
        app = "default";
    }

    this.loggers[app].error.apply(this.loggers[app], this._processArgs(arguments));
};

logger.prototype.info = function(app) {
    if (!this.loggers[app]) {
        app = "default";
    }

    this.loggers[app].info.apply(this.loggers[app], this._processArgs(arguments));
};

logger.prototype.debug = function(app) {
    if (!this.loggers[app]) {
        app = "default";
    }

    this.loggers[app].debug.apply(this.loggers[app], this._processArgs(arguments));
};

logger.prototype.warn = function(app) {
    if (!this.loggers[app]) {
        app = "default";
    }

    this.loggers[app].warn.apply(this.loggers[app], this._processArgs(arguments));
};

module.exports = function(log4js) {
    if (!log4js) {
        log4js = require("log4js");
    }

    return new logger(log4js);
};