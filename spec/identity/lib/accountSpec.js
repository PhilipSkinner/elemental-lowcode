const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	account 		= require("../../../identity/lib/account");

class db {

};

const defaultsTest = (done) => {
	const instance = account(db, null);

	done();
};

describe("An account provider", () => {
	it("defaults its constructor args", defaultsTest);
});