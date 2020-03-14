const
	jasmine 		= require('jasmine'),
	sinon 			= require('sinon'),
	configReader 	= require('../../../rules/lib/configReader');

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

const fileReadError = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects('readFile').once().withArgs('what.json').callsArgWith(1, new Error('oops'));

	const pathMock = sinon.mock(path);
	pathMock.expects('join').once().withArgs(process.cwd(), './doot.json').returns('what.json');

	const instance = configReader(fs, path);
	instance.readDefinition("./doot.json").catch((err) => {
		expect(err).toEqual(new Error('oops'));		

		fsMock.verify();
		pathMock.verify();

		done();
	});
};

const invalidJSON = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects('readFile').once().withArgs('what.json').callsArgWith(1, null, "lijef}{}{}{}{");

	const pathMock = sinon.mock(path);
	pathMock.expects('join').once().withArgs(process.cwd(), './doot.json').returns('what.json');

	const instance = configReader(fs, path);
	instance.readDefinition("./doot.json").catch((err) => {
		expect(err).toEqual(new Error('Cannot read rules definition ./doot.json'));		

		fsMock.verify();
		pathMock.verify();

		done();
	});
};

const success = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects('readFile').once().withArgs('what.json').callsArgWith(1, null, '{"hello":"world"}');

	const pathMock = sinon.mock(path);
	pathMock.expects('join').once().withArgs(process.cwd(), './doot.json').returns('what.json');

	const instance = configReader(fs, path);
	instance.readDefinition("./doot.json").then((config) => {
		expect(config.hello).toEqual("world");

		fsMock.verify();
		pathMock.verify();

		done();
	});
};

describe("A config reader", () => {
	it("defaults deps in its constructor", constructorTest);

	describe("can read rule configuration", () => {
		it("handling file read errors", fileReadError);
		it("handling invalid JSON", invalidJSON);
		it("successfully", success);
	});
});
