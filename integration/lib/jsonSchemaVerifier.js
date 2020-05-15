const jsonSchemaVerifier = function(ajv) {
	this.ajv = ajv;
};

jsonSchemaVerifier.prototype.verify = function(config, body) {
	//attempt to JSON parse
	let data = null;
	try {
		data = JSON.parse(body);
	} catch(e) {}

	let validator = this.ajv.compile(config.value);

	if (!validator(data)) {
		return {
			errors : validator.errors
		};
	}

	return {
		data : data
	};
};

module.exports = function(ajv) {
	if (!ajv) {
		ajv = new require("ajv")({
			allErrors : true
		});
	}

	return new jsonSchemaVerifier(ajv);
};