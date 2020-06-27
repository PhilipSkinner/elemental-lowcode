const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	configReader 	= require("../../../interface/lib/configReader");

const fs = {
	readFile : () => {}
};

const path = {
	join : () => {}
};

const constructorTest = (done) => {
	const instance = configReader();
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

const definitionErrors = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, new Error("oh noes"));

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "doot.json").returns("doot.json");

	const instance = configReader(fs, path);

	instance.readDefinition("doot.json").catch((err) => {
		expect(err).toEqual(new Error("oh noes"));

		fsMock.verify();
		fsMock.restore();
		pathMock.verify();
		pathMock.restore();

		done();
	});
};

const definitionInvalid = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, "{}{}{}{}{}{");

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "doot.json").returns("doot.json");

	const instance = configReader(fs, path);

	instance.readDefinition("doot.json").catch((err) => {
		expect(err).toEqual(new Error("Cannot read website definition doot.json"));

		fsMock.verify();
		fsMock.restore();
		pathMock.verify();
		pathMock.restore();

		done();
	});
};

const definitionTest = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, JSON.stringify({
		hello : "world"
	}));

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "doot.json").returns("doot.json");

	const instance = configReader(fs, path);

	instance.readDefinition("doot.json").then((definition) => {
		expect(definition).toEqual({
			hello : "world"
		});

		fsMock.verify();
		fsMock.restore();
		pathMock.verify();
		pathMock.restore();

		done();
	});
};

const mainErrors = (done) => {
	process.env.DIR = "ourdir"

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("main.json").callsArgWith(1, new Error("oh noes"));

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "ourdir", "main.json").returns("main.json");

	const instance = configReader(fs, path);

	instance.readMainConfig().then((config) => {
		expect(config).toEqual({});

		fsMock.verify();
		fsMock.restore();
		pathMock.verify();
		pathMock.restore();

		done();
	});
};

const mainInvalid = (done) => {
	process.env.DIR = "ourdir"

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("main.json").callsArgWith(1, null, "{P{}{}{}");

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "ourdir", "main.json").returns("main.json");

	const instance = configReader(fs, path);

	instance.readMainConfig().then((config) => {
		expect(config).toEqual({});

		fsMock.verify();
		fsMock.restore();
		pathMock.verify();
		pathMock.restore();

		done();
	});
};

const mainTest = (done) => {
	process.env.DIR = "ourdir"

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("main.json").callsArgWith(1, null, JSON.stringify({
		hello : "world"
	}));

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "ourdir", "main.json").returns("main.json");

	const instance = configReader(fs, path);

	instance.readMainConfig().then((config) => {
		expect(config).toEqual({
			hello : "world"
		});

		fsMock.verify();
		fsMock.restore();
		pathMock.verify();
		pathMock.restore();

		done();
	});
};

describe("A config reader", () => {
	it("defaults its constructor arguments", constructorTest);

	describe("can read a website definition", () => {
		it("handling file read errors", definitionErrors);
		it("handling invalid JSON", definitionInvalid);
		it("correctly", definitionTest);
	});

	describe("can read the main config", () => {
		it("handling file read errors", mainErrors);
		it("handling invalid JSON", mainInvalid);
		it("correctly", mainTest);
	});
});