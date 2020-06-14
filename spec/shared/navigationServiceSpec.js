const
	sinon 				= require("sinon"),
	navigationService 	= require("../../shared/navigationService");

const constructorTest = (done) => {
	const instance = navigationService();
	done();
};

describe("A db provider", () => {
	it("defaults its constructor arguments", constructorTest);
});