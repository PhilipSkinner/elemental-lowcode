const
	sinon 			= require("sinon"),
	websiteInstance 	= require("../../../interface/lib/websiteInstance");

const constructorTest = (done) => {
	const instance = websiteInstance();
	expect(instance.controllerInstance).not.toBe(null);
	expect(instance.templateRenderer).not.toBe(null);
	expect(instance.express).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.hostnameResolver).not.toBe(null);
	done();
};

describe("A website instance", () => {
	it("defaults its constructor arguments", constructorTest);
});