const
	sinon 			= require("sinon"),
	websiteService 	= require("../../../interface/lib/websiteService");

const constructorTest = (done) => {
	const instance = websiteService();
	expect(instance.configReader).not.toBe(null);
	expect(instance.websiteInstance).not.toBe(null);
	expect(instance.glob).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

describe("A website service", () => {
	it("defaults its constructor arguments", constructorTest);
});