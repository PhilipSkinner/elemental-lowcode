const hostnameResolver = function() {

};

hostnameResolver.prototype.resolveKernel = function() {
	return process.env.ELEMENTAL_KERNEL_HOST || "http://localhost:8001";
}

hostnameResolver.prototype.resolveAdmin = function() {
	return process.env.ELEMENTAL_ADMIN_HOST || "http://localhost:8002";
};

hostnameResolver.prototype.resolveAPI = function() {
	return process.env.ELEMENTAL_API_HOST || "http://localhost:8003";
};

hostnameResolver.prototype.resolveIntegration = function() {
	return process.env.ELEMENTAL_INTEGRATION_HOST || "http://localhost:8004";
};

hostnameResolver.prototype.resolveInterface = function() {
	return process.env.ELEMENTAL_INTERFACE_HOST || "http://localhost:8005";
};

hostnameResolver.prototype.resolveStorage = function() {
	return process.env.ELEMENTAL_STORAGE_HOST || "http://localhost:8006";
};

hostnameResolver.prototype.resolveRules = function() {
	return process.env.ELEMENTAL_RULES_HOST || "http://localhost:8007";
};

hostnameResolver.prototype.resolveIdentity = function() {
	return process.env.ELEMENTAL_IDENTITY_HOST || "http://localhost:8008";
};

module.exports = function() {
	return new hostnameResolver();
};