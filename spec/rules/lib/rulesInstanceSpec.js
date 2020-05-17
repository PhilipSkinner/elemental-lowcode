const
	jasmine 		= require('jasmine'),
	sinon 			= require('sinon'),
	rulesInstance 	= require('../../../rules/lib/rulesInstance');

const app = {
	post : () => {}
};

const ajv = {

};

const comparitorService = {
	evaluate : () => {}
};

const roleCheckHandler = {
	enforceRoles : () => {}
};

const constructorTest = (done) => {
	const instance = rulesInstance();
	expect(instance.ajv).not.toBe(null);
	expect(instance.comparitorService).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	done();
};

const initTest = (done) => {
	const appMock = sinon.mock(app);
	appMock.expects('post').once().withArgs('/doot');

	const roleCheckHandlerMock = sinon.mock(roleCheckHandler);
	roleCheckHandlerMock.expects('enforceRoles').once().withArgs(sinon.match.any, ["system_admin", "system_exec", "rules_exec", "doot_exec"]);

	const instance = rulesInstance(app, {
		name : 'doot'
	}, ajv, comparitorService, roleCheckHandler);
	instance.init().then(() => {
		appMock.verify();
		roleCheckHandlerMock.verify();

		done();
	});
};

const invalidFactsTest = (done) => {
	const instance = rulesInstance(app, {
		name 	: 'doot',
		facts 	: {
			type 		: "object",
			properties 	: {
				value : {
					type : "string"
				}
			}
		}
	}, null, comparitorService, roleCheckHandler);
	instance.executeRules({
		body : {
			value : {
				not : "a string"
			}
		}
	}, {
		status : (code) => {
			expect(code).toEqual(422);
		},
		json : (body) => {
			expect(body).toEqual({
				errors : [
					{
						keyword: 'type',
						dataPath: '.value',
						schemaPath: '#/properties/value/type',
						params: {
							type: 'string'
						},
						message: 'should be string'
					}
				]
			});
		},
		end : () => {
			done();
		}
	});
};

const noMatchingRulesets = (done) => {
	const comparitorServiceMock = sinon.mock(comparitorService);
	comparitorServiceMock.expects('evaluate').once().withArgs({
		value : "a string"
	}, "doot").returns(false);

	const instance = rulesInstance(app, {
		name 	: 'doot',
		facts 	: {
			type 		: "object",
			properties 	: {
				value : {
					type : "string"
				}
			}
		},
		rules : [
			{
				comparitors : "doot"
			}
		]
	}, null, comparitorService, roleCheckHandler);
	instance.executeRules({
		body : {
			value : "a string"
		}
	}, {
		status : (code) => {
			expect(code).toEqual(400);
		},
		json : (body) => {
			expect(body).toBe(null);
		},
		end : () => {
			comparitorServiceMock.verify();

			done();
		}
	});
};

const executionTest = (done) => {
	const comparitorServiceMock = sinon.mock(comparitorService);
	comparitorServiceMock.expects('evaluate').once().withArgs({
		value : "a string"
	}, "doot").returns(true);

	const instance = rulesInstance(app, {
		name 	: 'doot',
		facts 	: {
			type 		: "object",
			properties 	: {
				value : {
					type : "string"
				}
			}
		},
		rules : [
			{
				comparitors : "doot",
				output : {
					value : "three"
				}
			}
		]
	}, null, comparitorService, roleCheckHandler);
	instance.executeRules({
		body : {
			value : "a string"
		}
	}, {
		json : (body) => {
			expect(body).toEqual({
				value : "three"
			});
		},
		end : () => {
			comparitorServiceMock.verify();

			done();
		}
	});
};

const roleReplaceTest = (done) => {
	const appMock = sinon.mock(app);
	appMock.expects('post').once().withArgs('/doot');

	const roleCheckHandlerMock = sinon.mock(roleCheckHandler);
	roleCheckHandlerMock.expects('enforceRoles').once().withArgs(sinon.match.any, ["system_admin", "one", "two"]);

	const instance = rulesInstance(app, {
		name : 'doot',
		roles : {
			replace : {
				exec : true
			},
			exec : [
				"one",
				"two"
			]
		}
	}, ajv, comparitorService, roleCheckHandler);
	instance.init().then(() => {
		appMock.verify();
		roleCheckHandlerMock.verify();

		done();
	});
};

const extraRolesTest = (done) => {
	const appMock = sinon.mock(app);
	appMock.expects('post').once().withArgs('/doot');

	const roleCheckHandlerMock = sinon.mock(roleCheckHandler);
	roleCheckHandlerMock.expects('enforceRoles').once().withArgs(sinon.match.any, ["system_admin", "system_exec", "rules_exec", "doot_exec", "one", "two"]);

	const instance = rulesInstance(app, {
		name : 'doot',
		roles : {
			replace : {},
			exec : [
				"one",
				"two"
			],
			needsRole : {}
		}
	}, ajv, comparitorService, roleCheckHandler);
	instance.init().then(() => {
		appMock.verify();
		roleCheckHandlerMock.verify();

		done();
	});
};

const noRolesTest = (done) => {
	const appMock = sinon.mock(app);
	appMock.expects('post').once().withArgs('/doot');

	const roleCheckHandlerMock = sinon.mock(roleCheckHandler);
	roleCheckHandlerMock.expects('enforceRoles').once().withArgs(sinon.match.any, null);

	const instance = rulesInstance(app, {
		name : 'doot',
		roles : {
			needsRole : {
				exec : false
			}
		}
	}, ajv, comparitorService, roleCheckHandler);
	instance.init().then(() => {
		appMock.verify();
		roleCheckHandlerMock.verify();

		done();
	});
};

describe("A rules service instance", () => {
	it("defaults its constructor arguments", constructorTest);
	it("initialises its endpoints", initTest);

	describe("can execute rules", () => {
		it("handling invalid facts", invalidFactsTest);
		it("handling no matching rulesets", noMatchingRulesets);
		it("correctly executing  rules", executionTest);
		it("handling role replacement", roleReplaceTest);
		it("handling extra roles", extraRolesTest);
		it("handling no roles", noRolesTest);
	});
});