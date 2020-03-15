const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	memoryStore 	= require("../../../../storage/lib/stores/memoryStore");

const constructorTest = (done) => {
	const instance = memoryStore();
	expect(instance.store).not.toBe(null);
	done();
};

describe("A memory storage service", () => {
	it("defaults its constructor arguments", constructorTest);
});