const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	requestService	= require("../../../integration/lib/requestService");

const request = {
	main : () => {}
};

const stringParser = {
	parseString : () => {}
};

const constructorTest = (done) => {
	const instance = requestService();
	expect(instance.request).not.toBe(null);
	expect(instance.stringParser).not.toBe(null);
	done();
};

const requestTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("main").once().withArgs({
		method  : "GET",
		uri		: "http://elementalsystem.org?hello=world"
	}).callsArgWith(1, null, "my nice result");

	const parserMock = sinon.mock(stringParser);
	parserMock.expects("parseString").once().withArgs("http://elementalsystem.org", {
		hello : "world"
	}).returns("http://elementalsystem.org?hello=world");

	const instance = requestService(request.main, stringParser);
	instance.sendRequest({
		method : "GET",
		uri : "http://elementalsystem.org"
	}, {
		hello : "world"
	}).then((result) => {
		requestMock.verify();
		parserMock.verify();

		expect(result).toEqual("my nice result");

		done();
	});
};

const errorTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("main").once().withArgs({
		method  : "GET",
		uri		: "http://elementalsystem.org?hello=world"
	}).callsArgWith(1, new Error("network was eaten"));

	const parserMock = sinon.mock(stringParser);
	parserMock.expects("parseString").once().withArgs("http://elementalsystem.org", {
		hello : "world"
	}).returns("http://elementalsystem.org?hello=world");

	const instance = requestService(request.main, stringParser);
	instance.sendRequest({
		method : "GET",
		uri : "http://elementalsystem.org"
	}, {
		hello : "world"
	}).catch((err) => {
		requestMock.verify();
		parserMock.verify();

		expect(err).toEqual(new Error("network was eaten"));

		done();
	});
};

describe("A HTTP request service", () => {
	it("defaults its constructor arguments", constructorTest);
	it("can make a request", requestTest);
	it("can handle request errors", errorTest);
});