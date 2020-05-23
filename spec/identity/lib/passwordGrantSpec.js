const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	passwordGrant	= require("../../../identity/lib/passwordGrant");

const defaultsTest = (done) => {
	const instance = passwordGrant({});

	done();
};

describe("A password grant handler", () => {
	it("defaults its constructor args", defaultsTest);
});