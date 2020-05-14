const
	jasmine 			= require("jasmine"),
	sinon 				= require("sinon"),
	definitionProvider	= require("../../../api/lib/definitionProvider");

const fs = {
	readFile : () => {}
};

const path = {
	join : () => {}
};

const reqMethod = {
	main : () => {}
};

const resolveMethod = {
	main : () => {}
};

const constructorTest = (done) => {
	const instance = definitionProvider();
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

const definitionLoadTest = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, JSON.stringify({
		controllers : {
			get : "hello"
		},
		client_id : "woot",
		name : "doot"
	}));
	fsMock.expects("readFile").once().withArgs("woot.client.json").callsArgWith(1, null, JSON.stringify({
		my : "client"
	}));

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), sinon.match.any, "doot", "hello").returns("doot/hello");
	pathMock.expects("join").once().withArgs(sinon.match.any, "../identity", "woot.client.json").returns("woot.client.json");

	const resolveMock = sinon.mock(resolveMethod);
	resolveMock.expects("main").once().withArgs("doot/hello").returns("doot/hello");

	const reqMock = sinon.mock(reqMethod);
	reqMock.expects("main").once().withArgs("doot/hello").returns("an lovely controller");

	const instance = definitionProvider(fs, path, reqMethod.main, resolveMethod.main);
	instance.fetchDefinition("doot.json").then((definition) => {
		fsMock.verify();
		pathMock.verify();
		resolveMock.verify();
		reqMock.verify();

		expect(definition).toEqual({ 
			controllers : { 
				get : "an lovely controller" 
			},
			client_id : "woot",
			name : "doot",
			client : { 
				my : "client" 
			} 
		});

		done();
	});
};

const configReadError = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, new Error("oops"));

	const pathMock = sinon.mock(path);

	const resolveMock = sinon.mock(resolveMethod);

	const reqMock = sinon.mock(reqMethod);

	const instance = definitionProvider(fs, path, reqMethod.main, resolveMethod.main);
	instance.fetchDefinition("doot.json").catch((err) => {
		fsMock.verify();
		pathMock.verify();
		resolveMock.verify();
		reqMock.verify();

		expect(err).toEqual(new Error("oops"));

		done();
	});
};

const configJSONError = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, "lkjsdlkfsdlkfjdslk{}{}SA{D}{SD}A{SD}{}");
	
	const pathMock = sinon.mock(path);
	
	const resolveMock = sinon.mock(resolveMethod);
	
	const reqMock = sinon.mock(reqMethod);
	
	const instance = definitionProvider(fs, path, reqMethod.main, resolveMethod.main);
	instance.fetchDefinition("doot.json").catch((err) => {
		fsMock.verify();
		pathMock.verify();
		resolveMock.verify();
		reqMock.verify();

		expect(err).toEqual(new Error("Cannot read API definition doot.json"));

		done();
	});
};

const requireError = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, JSON.stringify({
		controllers : {
			get : "hello"
		},
		client_id : "woot",
		name : "doot"
	}));

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), sinon.match.any, "doot", "hello").returns("doot/hello");
	
	const resolveMock = sinon.mock(resolveMethod);
	resolveMock.expects("main").once().withArgs("doot/hello").returns("doot/hello");

	const reqMock = sinon.mock(reqMethod);
	reqMock.expects("main").once().withArgs("doot/hello").throws(new Error("oops"));

	const instance = definitionProvider(fs, path, reqMethod.main, resolveMethod.main);
	instance.fetchDefinition("doot.json").catch((err) => {
		fsMock.verify();
		pathMock.verify();
		resolveMock.verify();
		reqMock.verify();

		expect(err).toEqual(new Error("oops"));

		done();
	});
};

const clientReadError = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, JSON.stringify({
		controllers : {
			get : "hello"
		},
		client_id : "woot",
		name : "doot"
	}));
	fsMock.expects("readFile").once().withArgs("woot.client.json").callsArgWith(1, new Error("oops"));

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), sinon.match.any, "doot", "hello").returns("doot/hello");
	pathMock.expects("join").once().withArgs(sinon.match.any, "../identity", "woot.client.json").returns("woot.client.json");

	const resolveMock = sinon.mock(resolveMethod);
	resolveMock.expects("main").once().withArgs("doot/hello").returns("doot/hello");

	const reqMock = sinon.mock(reqMethod);
	reqMock.expects("main").once().withArgs("doot/hello").returns("an lovely controller");

	const instance = definitionProvider(fs, path, reqMethod.main, resolveMethod.main);
	instance.fetchDefinition("doot.json").catch((err) => {
		fsMock.verify();
		pathMock.verify();
		resolveMock.verify();
		reqMock.verify();

		expect(err).toEqual(new Error("oops"));

		done();
	});
};

const clientJSONError = (done) => {
	const fsMock = sinon.mock(fs);
	fsMock.expects("readFile").once().withArgs("doot.json").callsArgWith(1, null, JSON.stringify({
		controllers : {
			get : "hello"
		},
		client_id : "woot",
		name : "doot"
	}));
	fsMock.expects("readFile").once().withArgs("woot.client.json").callsArgWith(1, null, "}{}W{E}{{}{SA}D{AS}D{S}AD{");

	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), sinon.match.any, "doot", "hello").returns("doot/hello");
	pathMock.expects("join").once().withArgs(sinon.match.any, "../identity", "woot.client.json").returns("woot.client.json");

	const resolveMock = sinon.mock(resolveMethod);
	resolveMock.expects("main").once().withArgs("doot/hello").returns("doot/hello");

	const reqMock = sinon.mock(reqMethod);
	reqMock.expects("main").once().withArgs("doot/hello").returns("an lovely controller");

	const instance = definitionProvider(fs, path, reqMethod.main, resolveMethod.main);
	instance.fetchDefinition("doot.json").catch((err) => {
		fsMock.verify();
		pathMock.verify();
		resolveMock.verify();
		reqMock.verify();

		expect(err).toEqual(new Error("Cannot read client definition"));

		done();
	});
};

describe("An API definition provider", () => {
	it("defaults its constructor arguments", constructorTest);
	it("can fetch a definition", definitionLoadTest);
	it("handles file errors on config", configReadError);
	it("handles invalid config JSON", configJSONError);
	it("handles require errors", requireError);
	it("handles client file errors", clientReadError);
	it("handles invalid client JSON", clientJSONError);
});