const
	sinon 			= require("sinon"),
	sessionState 	= require("../../../interface/lib/sessionState");

const constructorTest = (done) => {
	const instance = sessionState();
	expect(instance.sessionName).toEqual("__session");
	done();
};

describe("A session state service", () => {
	it("defaults its constructor arguments", constructorTest);
});