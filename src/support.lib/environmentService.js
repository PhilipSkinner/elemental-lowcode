const environmentService = function() {

};

environmentService.prototype.getEnvironmentVariable = function(name) {
    return process.env[name];
};

environmentService.prototype.listEnvironmentVariables = function() {
    let ret = {};

    Object.keys(process.env).forEach((name) => {
        if (name.indexOf("ELEMENTAL__ENV__") !== 0) {
            ret[name] = process.env[name];
        }
    });

    return ret;
};

environmentService.prototype.getSecret = function(name) {
    return process.env[`ELEMENTAL__ENV__${name}`];
};

environmentService.prototype.listSecrets = function() {
    let ret = {};

    Object.keys(process.env).forEach((name) => {
        if (name.indexOf("ELEMENTAL__ENV__") === 0) {
            ret[name.replace("ELEMENTAL__ENV__", "")] = process.env[name];
        }
    });

    return ret;
};

module.exports = function() {
    return new environmentService();
};