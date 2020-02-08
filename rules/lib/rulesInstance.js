const rulesInstance = function(app, definition, ajv, comparitorService) {
	this.app = app;
	this.definition = definition;
	this.ajv = ajv;
	this.comparitorService = comparitorService;
};

rulesInstance.prototype.executeRules = function(req, res, next) {
	//validate the facts
	let validator = this.ajv.compile(this.definition.facts);

	if (!validator(req.body)) {
		res.status(422);
		res.json({
			errors : validator.errors
		});
		res.end();
		return;
	}

	//run through our executors
	this.definition.rules.forEach((rule) => {
		if (this.comparitorService.evaluate(req.body, rule.comparitors)) {
			//return the output
			res.json(rule.output);
			res.end();
			return;
		}
	});

	res.status(400);
	res.json(null);
	res.end();
	return;
};

rulesInstance.prototype.init = function() {
	return new Promise((resolve, reject) => {
		console.log(`Hosting ${this.definition.name} on /${this.definition.name}`);
		this.app.post(`/${this.definition.name}`, this.executeRules.bind(this));
		return resolve();
	});
};

module.exports = function(app, definition, ajv, comparitorService) {
	if (!ajv) {
		ajv = require('ajv')({
			allErrors : true
		});
	}

	if (!comparitorService) {
		comparitorService = require('./comparitorService')();
	}

	return new rulesInstance(app, definition, ajv, comparitorService);
};