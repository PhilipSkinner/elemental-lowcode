const
	sinon = require("sinon"),
	definitionProvider = require("../../../messaging/lib/definitionProvider");

const fs = {
	readFile : () => {}
};

const path = {
	join : () => {}
};

const constructorDefaults = (done) => {
	const instance = definitionProvider();

	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);

	done();
};

const definitionTest = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(sinon.match.any, "../identity", "woot.client.json").returns("woot.client.json");
	pathMock.expects("join").once().withArgs("doot.js").returns("fs");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, JSON.stringify({
		client_id : "woot"
	}));
	fsMock.expects("readFile").once().withArgs("woot.client.json").callsArgWith(1, null, JSON.stringify({
		hello : "world"
	}))

	const instance = definitionProvider(fs, path);

	instance.fetchDefinition("doot.json").then((config) => {
		expect(config).toEqual({
			handler : jasmine.any(Object),
			client_id : "woot",
			client : {
				hello : "world"
			}
		});

		pathMock.verify();
		pathMock.restore();
		fsMock.verify();
		fsMock.restore();

		done();
	});
};

const definitionReadError = (done) => {
	const pathMock = sinon.mock(path);
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, new Error("oops"));

	const instance = definitionProvider(fs, path);

	instance.fetchDefinition("doot.json").catch((err) => {
		expect(err).toEqual(new Error("oops"));

		pathMock.verify();
		pathMock.restore();
		fsMock.verify();
		fsMock.restore();

		done();
	});
};

const definitionInvalidJSON = (done) => {
	const pathMock = sinon.mock(path);

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, "{}{}{}{}{}}");

	const instance = definitionProvider(fs, path);

	instance.fetchDefinition("doot.json").catch((err) => {
		expect(err).toEqual(new Error("Cannot read message queue definition doot.json"));

		pathMock.verify();
		pathMock.restore();
		fsMock.verify();
		fsMock.restore();

		done();
	});
};

const clientReadError = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(sinon.match.any, "../identity", "woot.client.json").returns("woot.client.json");
	pathMock.expects("join").once().withArgs("doot.js").returns("fs");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, JSON.stringify({
		client_id : "woot"
	}));
	fsMock.expects("readFile").once().withArgs("woot.client.json").callsArgWith(1, new Error("oops"));

	const instance = definitionProvider(fs, path);

	instance.fetchDefinition("doot.json").catch((err) => {
		expect(err).toEqual(new Error("oops"));

		pathMock.verify();
		pathMock.restore();
		fsMock.verify();
		fsMock.restore();

		done();
	});
};

const clientInvalidJSON = (done) => {
	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(sinon.match.any, "../identity", "woot.client.json").returns("woot.client.json");
	pathMock.expects("join").once().withArgs("doot.js").returns("fs");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, JSON.stringify({
		client_id : "woot"
	}));
	fsMock.expects("readFile").once().withArgs("woot.client.json").callsArgWith(1, null, "}{{}{}{}{}{}KJDFKJD{}");

	const instance = definitionProvider(fs, path);

	instance.fetchDefinition("doot.json").catch((err) => {
		expect(err).toEqual(new Error("Cannot read client definition"));

		pathMock.verify();
		pathMock.restore();
		fsMock.verify();
		fsMock.restore();

		done();
	});
};

describe("A messaging definition provider", () => {
	it("handles constructor defaulting", constructorDefaults);
	it("can read a definition", definitionTest);
	it("handling definition file read errors", definitionReadError);
	it("handling invalid definition JSON", definitionInvalidJSON);
	it("handling client file read errors", clientReadError);
	it("handling invalid client JSON", clientInvalidJSON);
});