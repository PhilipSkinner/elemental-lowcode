const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	typesReader	= require("../../../storage/lib/typesReader");

const constructorTest = (done) => {
	const instance = typesReader();
	expect(instance.glob).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

describe("A storage types reader", () => {
	it("defaults its constructor arguments", constructorTest);
});