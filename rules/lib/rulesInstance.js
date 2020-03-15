const rulesInstance = function(app, definition, ajv, comparitorService, roleCheckHandler) {
	this.app = app;
	this.definition = definition;
	this.ajv = ajv;
	this.comparitorService = comparitorService;
	this.roleCheckHandler = roleCheckHandler;
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

	let done = false;
	//run through our executors
	this.definition.rules.forEach((rule) => {
		if (!done && this.comparitorService.evaluate(req.body, rule.comparitors)) {
			done = true;
			//return the output
			res.json(rule.output);
			res.end();
			return;
		}
	});

	if (done) {
		return;
	}

	res.status(400);
	res.json(null);
	res.end();
	return;
};

rulesInstance.prototype.init = function() {
	return new Promise((resolve, reject) => {
		const execRoles = [
			"system_admin",
			"system_exec",
			"rules_exec",
			`${this.definition.name}_exec`
		];

		console.log(`Hosting ${this.definition.name} on /${this.definition.name}`);
		this.app.post(`/${this.definition.name}`, this.roleCheckHandler.enforceRoles(this.executeRules.bind(this), execRoles));
		return resolve();
	});
};

module.exports = function(app, definition, ajv, comparitorService, roleCheckHandler) {
	if (!ajv) {
		ajv = require("ajv")({
			allErrors : true
		});
	}

	if (!comparitorService) {
		comparitorService = require("./comparitorService")();
	}

	if (!roleCheckHandler) {
		roleCheckHandler = require("../../shared/roleCheckHandler")();
	}

	return new rulesInstance(app, definition, ajv, comparitorService, roleCheckHandler);
};