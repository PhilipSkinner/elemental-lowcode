const
	sinon 		= require("sinon"),
	jasmine		= require("jasmine"),
	iocProvider = require("../../shared/iocProvider");

const path = {
	join 	: () => {},
	dirname : () => {}
};

const noParamsTest = (done) => {
	const func = function() {
		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const objectsTest = () => {
	const func = {};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);

	expect(func).toEqual({});
};

const environmentServiceTest = (done) => {
	const func = (environmentService) => {
		expect(environmentService).not.toBe(undefined);
		expect(environmentService).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const hostnameResolverTest = (done) => {
	const func = (hostnameResolver) => {
		expect(hostnameResolver).not.toBe(undefined);
		expect(hostnameResolver).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const storageServiceTest = (done) => {
	const func = (storageService) => {
		expect(storageService).not.toBe(undefined);
		expect(storageService).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const integrationServiceTest = (done) => {
	const func = (integrationService) => {
		expect(integrationService).not.toBe(undefined);
		expect(integrationService).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const rulesetServiceTest = (done) => {
	const func = (rulesetService) => {
		expect(rulesetService).not.toBe(undefined);
		expect(rulesetService).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const idmServiceTest = (done) => {
	const func = (idmService) => {
		expect(idmService).not.toBe(undefined);
		expect(idmService).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const authClientProviderTest = (done) => {
	const func = (authClientProvider) => {
		expect(authClientProvider).not.toBe(undefined);
		expect(authClientProvider).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const messagingServiceTest = (done) => {
	const func = (messagingService) => {
		expect(messagingService).not.toBe(undefined);
		expect(messagingService).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const sessionStateTest = (done) => {
	const func = (sessionState) => {
		expect(sessionState).not.toBe(undefined);
		expect(sessionState).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	instance.resolveRequirements(func);
};

const customServiceTest = (done) => {
	const func = (myCustomRequirement) => {
		expect(myCustomRequirement.write).not.toBe(null);

		done();
	};

	const instance = iocProvider(path);

	const pathMock = sinon.mock(path);
	process.env.DIR = "";
	pathMock.expects("dirname").once().withArgs("").returns("process dir");
	pathMock.expects("join").once().withArgs(process.cwd(), "process dir", "services", "myCustomRequirement").returns("fs");

	instance.resolveRequirements(func);
};

const unknownTest = () => {
	const func = (thisIsUnknown) => {};

	const instance = iocProvider(path);

	let err = null;
	try {
		instance.resolveRequirements(func);
	} catch(e) {
		err = e;
	}

	expect(err).toEqual(new Error("Could not resolve dependency thisIsUnknown! It could not be found."));
};

describe("An inversion of control provider", () => {
	it("handles no params", noParamsTest);
	it("handles objects", objectsTest);

	it("can resolve the environment service", environmentServiceTest);
	it("can resolve the hostname resolver", hostnameResolverTest);
	it("can resolve the storage service", storageServiceTest);
	it("can resolve the integration service", integrationServiceTest);
	it("can resolve the ruleset service", rulesetServiceTest);
	it("can resolve the idm service", idmServiceTest);
	it("can resolve the auth client provider", authClientProviderTest);
	it("can resolve the messaging service", messagingServiceTest);
	it("can resolve the session state", sessionStateTest);

	it("can resolve custom services", customServiceTest);
	it("handles unknown requirements", unknownTest);
});