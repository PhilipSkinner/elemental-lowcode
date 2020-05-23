const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	configProvider 	= require("../../../identity/lib/configProvider");

const defaultsTest = (done) => {
	const instance = configProvider(null, null, null, null, {}, {}, null);

	expect(instance.glob).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	expect(instance.jose).not.toBe(null);
	expect(instance.userDB).not.toBe(null);
	expect(instance.db).not.toBe(null);
	expect(instance.hostnameResolver).not.toBe(null);

	done();
};

describe("A config provider", () => {
	it("defaults its constructor args", defaultsTest);
});