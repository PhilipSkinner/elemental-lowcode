const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	fsStore 		= require("../../../../storage/lib/stores/fsStore");

const fs = {
	stat : () => {},
	mkdir : () => {},
	readdir : () => {}
};

const path = {
	join : () => {}
};

const constructorTest = (done) => {
	const instance = fsStore();
	expect(instance.dir).not.toBe(null);
	expect(instance.path).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	done();
};

const ensureTypeError = (done) => {
	const pathMock = sinon.mock(path);

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').once().withArgs('doot').callsArgWith(1, new Error('oops'));
	fsMock.expects('mkdir').once().withArgs('doot').callsArgWith(1, new Error('error!!!111'));

	const instance = fsStore('doot', fs, path);
	instance.initType('woot').catch((err) => {
		expect(err).toEqual(new Error('error!!!111'));

		pathMock.verify();
		fsMock.verify();

		done();
	});
};

const ensureTypeTest = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects('join').once().withArgs('doot', 'woot').returns('doot/woot');

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').once().withArgs('doot').callsArgWith(1, new Error('oops'));
	fsMock.expects('mkdir').once().withArgs('doot').callsArg(1);
	fsMock.expects('stat').once().withArgs('doot/woot').callsArg(1);

	const instance = fsStore('doot', fs, path);
	instance.initType('woot').then(() => {
		pathMock.verify();
		fsMock.verify();

		done();
	});
};

const detailsError = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects('join').twice().withArgs('doot', 'woot').returns('doot/woot');

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').once().withArgs('doot').callsArgWith(1, new Error('oops'));
	fsMock.expects('mkdir').once().withArgs('doot').callsArg(1);
	fsMock.expects('stat').once().withArgs('doot/woot').callsArg(1);
	fsMock.expects('readdir').once().withArgs('doot/woot').callsArgWith(1, new Error('nope'));

	const instance = fsStore('doot', fs, path);
	instance.getDetails('woot').catch((err) => {
		expect(err).toEqual(new Error('nope'));

		pathMock.verify();
		fsMock.verify();

		done();
	});
};

const detailsTest = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects('join').twice().withArgs('doot', 'woot').returns('doot/woot');

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').once().withArgs('doot').callsArgWith(1, new Error('oops'));
	fsMock.expects('mkdir').once().withArgs('doot').callsArg(1);
	fsMock.expects('stat').once().withArgs('doot/woot').callsArg(1);
	fsMock.expects('readdir').once().withArgs('doot/woot').callsArgWith(1, null, {
		length : 1234
	});

	const instance = fsStore('doot', fs, path);
	instance.getDetails('woot').then((stats) => {
		expect(stats.count).toEqual(1234);

		pathMock.verify();
		fsMock.verify();

		done();
	});
};

describe("A file system storage service", () => {
	it("defaults its constructor arguments", constructorTest);

	describe("can ensure a type", () => {
		it("handling errors", ensureTypeError);
		it("correctly", ensureTypeTest);
	});

	describe("can get a types details", () => {
		it("handling errors", detailsError);
		it("correctly", detailsTest);
	});
});