const
	sinon 				= require("sinon"),
	controllerInstance 	= require("../../../interface/lib/controllerInstance");

const constructorTest = (done) => {
	const instance = controllerInstance();
	expect(instance.path).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	expect(instance.controllerState).not.toBe(null);
	expect(instance.roleCheckHandler).not.toBe(null);
	done();
};

describe("A controller instance", () => {
	it("defaults its constructor arguments", constructorTest);
});