const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	fsStore 		= require("../../../../storage/lib/stores/fsStore");

const fs = {
	stat : () => {},
	mkdir : () => {},
	readdir : () => {},
	readFile : () => {},
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

const getListDirReadError = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects('join').twice(3).withArgs('doot', 'woot').returns('doot/woot');

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').once().withArgs('doot').callsArg(1);
	fsMock.expects('stat').once().withArgs('doot/woot').callsArg(1);
	fsMock.expects('readdir').once().withArgs('doot/woot').callsArgWith(1, new Error('oh dear'));

	const instance = fsStore('doot', fs, path);
	instance.getResources('woot').catch((err) => {
		expect(err).toEqual(new Error('oh dear'));

		fsMock.verify();
		pathMock.verify();

		done();
	});
};

const getListNoFiltersDefault = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects('join').exactly(4).withArgs('doot', 'woot').returns('doot/woot');
	pathMock.expects('join').once().withArgs('doot', 'woot', 'one').returns('doot/woot/one');
	pathMock.expects('join').once().withArgs('doot', 'woot', 'two').returns('doot/woot/two');

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').thrice().withArgs('doot').callsArg(1);
	fsMock.expects('stat').thrice().withArgs('doot/woot').callsArg(1);
	fsMock.expects('readdir').once().withArgs('doot/woot').callsArgWith(1, null, ['one', 'two']);
	fsMock.expects('readFile').once().withArgs('doot/woot/one').callsArgWith(1, null, JSON.stringify({one:1}));
	fsMock.expects('readFile').once().withArgs('doot/woot/two').callsArgWith(1, null, JSON.stringify({two:1}));

	const instance = fsStore('doot', fs, path);
	instance.getResources('woot').then((results) => {
		expect(results).toEqual([
			{
				one : 1,
				id : "one"
			},
			{
				two : 1,
				id : "two"
			}
		]);

		fsMock.verify();
		pathMock.verify();

		done();
	});
};

const getListFilters = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects('join').exactly(4).withArgs('doot', 'woot').returns('doot/woot');
	pathMock.expects('join').once().withArgs('doot', 'woot', 'one').returns('doot/woot/one');
	pathMock.expects('join').once().withArgs('doot', 'woot', 'two').returns('doot/woot/two');

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').thrice().withArgs('doot').callsArg(1);
	fsMock.expects('stat').thrice().withArgs('doot/woot').callsArg(1);
	fsMock.expects('readdir').once().withArgs('doot/woot').callsArgWith(1, null, ['one', 'two']);
	fsMock.expects('readFile').once().withArgs('doot/woot/one').callsArgWith(1, null, JSON.stringify({one:1}));
	fsMock.expects('readFile').once().withArgs('doot/woot/two').callsArgWith(1, null, JSON.stringify({two:1}));

	const instance = fsStore('doot', fs, path);
	instance.getResources('woot', 1, 5, [
		{
			path : "$.one",
			value : 1
		}
	]).then((results) => {
		expect(results).toEqual([
			{
				one : 1,
				id : "one"
			}
		]);

		fsMock.verify();
		pathMock.verify();

		done();
	});
};

const getResourceReadError = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects('join').once().withArgs('doot', 'woot').returns('doot/woot');
	pathMock.expects('join').once().withArgs('doot', 'woot', 'id').returns('doot/woot/id');

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').once().withArgs('doot').callsArg(1);
	fsMock.expects('stat').once().withArgs('doot/woot').callsArg(1);
	fsMock.expects('readFile').once().withArgs('doot/woot/id').callsArgWith(1, new Error('oh dear'));

	const instance = fsStore('doot', fs, path);
	instance.getResource('woot', 'id').then((result) => {
		expect(result).toBe(null);

		fsMock.verify();
		pathMock.verify();

		done();
	});
};

const getResourceJSONError = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects('join').once().withArgs('doot', 'woot').returns('doot/woot');
	pathMock.expects('join').once().withArgs('doot', 'woot', 'id').returns('doot/woot/id');

	const fsMock = sinon.mock(fs);
	fsMock.expects('stat').once().withArgs('doot').callsArg(1);
	fsMock.expects('stat').once().withArgs('doot/woot').callsArg(1);
	fsMock.expects('readFile').once().withArgs('doot/woot/id').callsArgWith(1, null, '{}{}{}{}{}{}klsdfkjsfk');

	const instance = fsStore('doot', fs, path);
	instance.getResource('woot', 'id').catch((err) => {
		expect(err).toEqual(new Error('Could not parse resource woot:id'));

		fsMock.verify();
		pathMock.verify();

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
		//it("correctly", detailsTest);
	});

	describe("can get a list of resources", () => {
		it("handling dir read errors", getListDirReadError);
		it("with no filters", getListNoFiltersDefault);
		it("handling filtering", getListFilters);
	});

	describe("can get a resource", () => {
		it("handling errors", getResourceReadError);
		it("handling JSON parse errors", getResourceJSONError);
	});
});