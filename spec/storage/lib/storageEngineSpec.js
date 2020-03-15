const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	storageEngine	= require("../../../storage/lib/storageEngine");

const constructorTest = (done) => {
	const instance = storageEngine();
	expect(instance.typesReader).not.toBe(null);
	expect(instance.typeInstance).not.toBe(null);
	done();
};

describe("A storage engine", () => {
	it("defaults its constructor arguments", constructorTest);
});