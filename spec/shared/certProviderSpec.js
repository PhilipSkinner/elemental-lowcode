const
	jasmine 		= require("jasmine"),
	sinon 			= require("sinon"),
	certProvider 	= require("../../shared/certProvider");

const crypto = {
	generateKeyPairSync : () => {}
};

const fs = {
	readFileSync : () => {},
	writeFileSync : () => {}
};

const path = {
	join : () => {}
};

const constructorTest = (done) => {
	const instance = certProvider();
	expect(instance.crypt).not.toBe(null);
	expect(instance.fs).not.toBe(null);
	expect(instance.path).not.toBe(null);
	done();
};

const getPublicKeyExists = () => {
	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "signing-private.key").returns("/signing-private.key");
	pathMock.expects("join").once().withArgs(process.cwd(), "signing-public.key").returns("/signing-public.key");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFileSync").once().withArgs("/signing-private.key").returns("goodbye!");
	fsMock.expects("readFileSync").once().withArgs("/signing-public.key").returns("hello there");

	const cryptoMock = sinon.mock(crypto);

	const instance = certProvider(crypto, fs, path);

	expect(instance.fetchPublicSigningKey()).toEqual("hello there");

	pathMock.verify();
	pathMock.restore();
	fsMock.verify();
	fsMock.restore();
	cryptoMock.verify();
	cryptoMock.restore();
};

const getPublicKeyDoesntExist = () => {
	const pathMock = sinon.mock(path);
	pathMock.expects("join").twice().withArgs(process.cwd(), "signing-private.key").returns("/signing-private.key");
	pathMock.expects("join").twice().withArgs(process.cwd(), "signing-public.key").returns("/signing-public.key");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFileSync").once().withArgs("/signing-private.key").returns(null);
	fsMock.expects("readFileSync").once().withArgs("/signing-public.key").returns(null);
	fsMock.expects("writeFileSync").once().withArgs("/signing-private.key", "goodbye!");
	fsMock.expects("writeFileSync").once().withArgs("/signing-public.key", "hello there");

	const cryptoMock = sinon.mock(crypto);
	cryptoMock.expects("generateKeyPairSync").once().withArgs("rsa", {
		modulusLength : 2048,
		publicKeyEncoding : {
			type : "spki",
			format : "pem"
		},
		privateKeyEncoding : {
			type : "pkcs8",
			format : "pem"
		}
	}).returns({
		privateKey : "goodbye!",
		publicKey : "hello there"
	});

	const instance = certProvider(crypto, fs, path);

	expect(instance.fetchPublicSigningKey()).toEqual("hello there");

	pathMock.verify();
	pathMock.restore();
	fsMock.verify();
	fsMock.restore();
	cryptoMock.verify();
	cryptoMock.restore();
};

const getPrivateKeyExists = () => {
	const pathMock = sinon.mock(path);
	pathMock.expects("join").once().withArgs(process.cwd(), "signing-private.key").returns("/signing-private.key");
	pathMock.expects("join").once().withArgs(process.cwd(), "signing-public.key").returns("/signing-public.key");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFileSync").once().withArgs("/signing-private.key").returns("goodbye!");
	fsMock.expects("readFileSync").once().withArgs("/signing-public.key").returns("hello there");

	const cryptoMock = sinon.mock(crypto);

	const instance = certProvider(crypto, fs, path);

	expect(instance.fetchPrivateSigningKey()).toEqual("goodbye!");

	pathMock.verify();
	pathMock.restore();
	fsMock.verify();
	fsMock.restore();
	cryptoMock.verify();
	cryptoMock.restore();
};

const getPrivateKeyDoesntExist = () => {
	const pathMock = sinon.mock(path);
	pathMock.expects("join").twice().withArgs(process.cwd(), "signing-private.key").returns("/signing-private.key");
	pathMock.expects("join").twice().withArgs(process.cwd(), "signing-public.key").returns("/signing-public.key");

	const fsMock = sinon.mock(fs);
	fsMock.expects("readFileSync").once().withArgs("/signing-private.key").returns(null);
	fsMock.expects("readFileSync").once().withArgs("/signing-public.key").returns(null);
	fsMock.expects("writeFileSync").once().withArgs("/signing-private.key", "goodbye!");
	fsMock.expects("writeFileSync").once().withArgs("/signing-public.key", "hello there");

	const cryptoMock = sinon.mock(crypto);
	cryptoMock.expects("generateKeyPairSync").once().withArgs("rsa", {
		modulusLength : 2048,
		publicKeyEncoding : {
			type : "spki",
			format : "pem"
		},
		privateKeyEncoding : {
			type : "pkcs8",
			format : "pem"
		}
	}).returns({
		privateKey : "goodbye!",
		publicKey : "hello there"
	});

	const instance = certProvider(crypto, fs, path);

	expect(instance.fetchPrivateSigningKey()).toEqual("goodbye!");

	pathMock.verify();
	pathMock.restore();
	fsMock.verify();
	fsMock.restore();
	cryptoMock.verify();
	cryptoMock.restore();
};

describe("A certificate provider", () => {
	it("defaults its constructor arguments", constructorTest);

	describe("can fetch the public signing key", () => {
		it("when it already exists", getPublicKeyExists);
		it("when it doesn't exist", getPublicKeyDoesntExist);
	});

	describe("can fetch the private signing key", () => {
		it("when it already exists", getPrivateKeyExists);
		it("when it doesn't exist", getPrivateKeyDoesntExist);
	});
});