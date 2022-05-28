const hostnameResolver = function() {

};

hostnameResolver.prototype._defaultValue = function(val, def) {
    return val === ""
		|| val === null
		|| val === "null"
		|| typeof(val) === "undefined"
        || val === "undefined" ? def : val;
};

hostnameResolver.prototype._protocolPrefix = function(hostname) {
    return this._defaultValue(process.env.DEFAULT_PROTOCOL, "http") + "://" + hostname;
};

hostnameResolver.prototype.resolveKernel = function() {
    return this._protocolPrefix(this._defaultValue(process.env.KERNEL_HOST, "localhost:8001"));
};

hostnameResolver.prototype.resolveAdmin = function() {
    return this._protocolPrefix(this._defaultValue(process.env.ADMIN_HOST, "localhost:8002"));
};

hostnameResolver.prototype.resolveAPI = function() {
    return this._protocolPrefix(this._defaultValue(process.env.API_HOST, "localhost:8003"));
};

hostnameResolver.prototype.resolveIntegration = function() {
    return this._protocolPrefix(this._defaultValue(process.env.INTEGRATION_HOST, "localhost:8004"));
};

hostnameResolver.prototype.resolveInterface = function() {
    return this._protocolPrefix(this._defaultValue(process.env.INTERFACE_HOST, "localhost:8005"));
};

hostnameResolver.prototype.resolveStorage = function() {
    return this._protocolPrefix(this._defaultValue(process.env.STORAGE_HOST, "localhost:8006"));
};

hostnameResolver.prototype.resolveRules = function() {
    return this._protocolPrefix(this._defaultValue(process.env.RULES_HOST, "localhost:8007"));
};

hostnameResolver.prototype.resolveIdentity = function() {
    return this._protocolPrefix(this._defaultValue(process.env.IDENTITY_HOST, "localhost:8008"));
};

hostnameResolver.prototype.resolveExternalIdentity = function() {
    return this._protocolPrefix(this._defaultValue(process.env.EXTERNAL_IDENTITY_HOST, this._defaultValue(process.env.IDENTITY_HOST, "localhost:8008")));
};

hostnameResolver.prototype.resolveQueue = function() {
    return this._protocolPrefix(this._defaultValue(process.env.QUEUE_HOST, "localhost:8009"));
};

hostnameResolver.prototype.resolveBlob = function() {
    return this._protocolPrefix(this._defaultValue(process.env.BLOB_HOST, 'localhost:8010'));
};

module.exports = function() {
    return new hostnameResolver();
};