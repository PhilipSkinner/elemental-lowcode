const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	configReader	= require("../../../integration/lib/configReader");

const fs = {
	readFile : () => {}
};

const glob = {
	main : () => {}
};

const path = {
	join 		: () => {},
	basename 	: () => {}
};

const constructorTest = (done) => {
	const instance = configReader();
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.glob).not.toBe(null);
	done();
};

const configReadTest = (done) => {
	const globMock = sinon.mock(glob);
	globMock.expects("main").once().withArgs("doot/**/*.json").callsArgWith(1, null, [
		"one.json"
	]);

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "doot", "**/*.json").returns("doot/**/*.json");
	pathMock.expects("basename").once().withArgs("one.json").returns("one.json");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("one.json").callsArgWith(1, null, JSON.stringify({ hello : "world" }));

	const instance = configReader(fs, path, glob.main);
	instance.readConfigFromDir("doot").then((config) => {
		globMock.verify();
		pathMock.verify();
		fsMock.verify();

		expect(config).toEqual({
			one : {
				hello : "world"
			}
		});

		done();
	});
};

const globErrorTest = (done) => {
	const globMock = sinon.mock(glob);
	globMock.expects("main").once().withArgs("doot/**/*.json").callsArgWith(1, new Error("oops"));

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "doot", "**/*.json").returns("doot/**/*.json");

	const fsMock = sinon.mock(fs);

	const instance = configReader(fs, path, glob.main);
	instance.readConfigFromDir("doot").catch((err) => {
		globMock.verify();
		pathMock.verify();
		fsMock.verify();

		expect(err).toEqual(new Error("oops"));

		done();
	});
};

const configErrorTest = (done) => {
	const globMock = sinon.mock(glob);
	globMock.expects("main").once().withArgs("doot/**/*.json").callsArgWith(1, null, [
		"one.json"
	]);

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "doot", "**/*.json").returns("doot/**/*.json");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("one.json").callsArgWith(1, new Error("oops"));

	const instance = configReader(fs, path, glob.main);
	instance.readConfigFromDir("doot").catch((err) => {
		globMock.verify();
		pathMock.verify();
		fsMock.verify();

		expect(err).toEqual(new Error("oops"));

		done();
	});
};

const invalidJSONTest = (done) => {
	const globMock = sinon.mock(glob);
	globMock.expects("main").once().withArgs("doot/**/*.json").callsArgWith(1, null, [
		"one.json"
	]);

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "doot", "**/*.json").returns("doot/**/*.json");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("one.json").callsArgWith(1, null, "{}S{}S{}{}S{D}{SD}A{D}{}}{");

	const instance = configReader(fs, path, glob.main);
	instance.readConfigFromDir("doot").catch((err) => {
		globMock.verify();
		pathMock.verify();
		fsMock.verify();

		expect(err).toEqual(new Error("Unable to parse config file one.json"));

		done();
	});
};

describe("A config reader", () => {
	it("defaults its constructor arguments", constructorTest);
	it("can read config correctly", configReadTest);
	it("handling glob errors", globErrorTest);
	it("handling config read errors", configErrorTest);
	it("handling invalid JSON", invalidJSONTest);
});