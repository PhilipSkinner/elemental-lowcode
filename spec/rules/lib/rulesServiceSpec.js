const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	rulesService 	= require("../../../rules/lib/rulesService");

const app = {

};

const path = {
	join : () => {}
};

const glob = {
	main : () => {}
};

const configReader = {
	readDefinition : () => {}
};

const rulesInstance = {
	main : () => {},
	init : () => {}
};

const constructorTest = (done) => {
	const instance = rulesService();
	expect(instance.path).not.toBe(null);
	expect(instance.glob).not.toBe(null);
	expect(instance.configReader).not.toBe(null);
	expect(instance.rulesInstance).not.toBe(null);
	done();
};

const initTest = (done) => {
	const appMock = sinon.mock(app);

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs("doot", "**/*.json").returns("doot/**/*.json");

	const globMock = sinon.mock(glob);
	globMock.expects("main").once().withArgs("doot/**/*.json").callsArgWith(1, null, [
		"one.json"
	]);

	const configMock = sinon.mock(configReader);
	configMock.expects("readDefinition").once().withArgs("one.json").returns(Promise.resolve("a rule definition"));

	const ruleMock = sinon.mock(rulesInstance);
	ruleMock.expects("main").once().withArgs({}, "a rule definition").returns(rulesInstance);
	ruleMock.expects("init").once().returns(Promise.resolve());

	const instance = rulesService(app, path, glob.main, configReader, rulesInstance.main);
	instance.init("doot").then(() => {
		appMock.verify();
		pathMock.verify();
		globMock.verify();
		configMock.verify();
		ruleMock.verify();

		done();
	});
};

const globErrorTest = (done) => {
	const appMock = sinon.mock(app);

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs("doot", "**/*.json").returns("doot/**/*.json");

	const globMock = sinon.mock(glob);
	globMock.expects("main").once().withArgs("doot/**/*.json").callsArgWith(1, new Error("oops"));

	const configMock = sinon.mock(configReader);

	const ruleMock = sinon.mock(rulesInstance);

	const instance = rulesService(app, path, glob.main, configReader, rulesInstance.main);
	instance.init("doot").catch((err) => {
		appMock.verify();
		pathMock.verify();
		globMock.verify();
		configMock.verify();
		ruleMock.verify();

		expect(err).toEqual(new Error("oops"));

		done();
	});
};

describe("A rules service", () => {
	it("defaults its constructor arguments", constructorTest);
	it("initialises itself correctly", initTest);
	it("handles glob errors", globErrorTest);
});