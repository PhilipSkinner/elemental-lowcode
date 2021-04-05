const hostnameResolver = function() {

};

hostnameResolver.prototype._defaultValue = function(val, def) {
	return val === ""
		|| val === null
		|| val === "null"
		|| typeof(val) === "undefined" ? def : val;
};

hostnameResolver.prototype.resolveKernel = function() {
	return this._defaultValue(process.env.ELEMENTAL_KERNEL_HOST, "http://localhost:8001");
}

hostnameResolver.prototype.resolveAdmin = function() {
	return this._defaultValue(process.env.ELEMENTAL_ADMIN_HOST, "http://localhost:8002");
};

hostnameResolver.prototype.resolveAPI = function() {
	return this._defaultValue(process.env.ELEMENTAL_API_HOST, "http://localhost:8003");
};

hostnameResolver.prototype.resolveIntegration = function() {
	return this._defaultValue(process.env.ELEMENTAL_INTEGRATION_HOST, "http://localhost:8004");
};

hostnameResolver.prototype.resolveInterface = function() {
	return this._defaultValue(process.env.ELEMENTAL_INTERFACE_HOST, "http://localhost:8005");
};

hostnameResolver.prototype.resolveStorage = function() {
	return this._defaultValue(process.env.ELEMENTAL_STORAGE_HOST, "http://localhost:8006");
};

hostnameResolver.prototype.resolveRules = function() {
	return this._defaultValue(process.env.ELEMENTAL_RULES_HOST, "http://localhost:8007");
};

hostnameResolver.prototype.resolveIdentity = function() {
	return this._defaultValue(process.env.ELEMENTAL_IDENTITY_HOST, "http://localhost:8008");
};

hostnameResolver.prototype.resolveQueue = function() {
	return this._defaultValue(process.env.ELEMENTAL_QUEUE_HOST, "http://localhost:8009");
};

module.exports = function() {
	return new hostnameResolver();
};