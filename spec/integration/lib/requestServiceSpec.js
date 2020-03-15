const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	requestService	= require("../../../integration/lib/requestService");

const constructorTest = (done) => {
	const instance = requestService();
	expect(instance.request).not.toBe(null);
	expect(instance.stringParser).not.toBe(null);
	done();
};

describe("A HTTP request service", () => {
	it("defaults its constructor arguments", constructorTest);
});