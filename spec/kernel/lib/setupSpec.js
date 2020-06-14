const
	sinon 			= require("sinon"),
	setup 			= require("../../../kernel/lib/setup");

const constructorTest = (done) => {
	const instance = setup();
	expect(instance.mkdirp).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	done();
};

describe("A setup provider", () => {
	it("defaults its constructor arguments", constructorTest);
});