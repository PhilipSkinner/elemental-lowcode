const
	sinon 		= require("sinon"),
	jasmine 	= require("jasmine"),
	idmService 	= require("../../shared/idmService");

const request = {
	get 	: () => {},
	put	 	: () => {},
	post 	: () => {}
};

const hostnameResolver = {
	resolveIdentity : () => {}
};

const authClientProvider = {
	getAccessToken : () => {}
};

const getUsersErrorTest = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("get").once().withArgs("http://identity.com/api/users", {
		headers : {
			Authorization : "Bearer my token"
		}
	}).callsArgWith(2, new Error("oops"));

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.getUsers().catch((err) => {
		expect(err).toEqual(new Error("oops"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const getUsersInvalidStatusCode = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("get").once().withArgs("http://identity.com/api/users", {
		headers : {
			Authorization : "Bearer doot"
		}
	}).callsArgWith(2, null, { statusCode : 401 }, "");

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);

	instance.getUsers("doot").catch((err) => {
		expect(err).toEqual(new Error("Invalid status code received - 401"));

		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const getUsersInvalidJSON = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("get").once().withArgs("http://identity.com/api/users", {
		headers : {
			Authorization : "Bearer "
		}
	}).callsArgWith(2, null, { statusCode : 200 }, "}{}{}{}{}{}");

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);

	instance.getUsers().catch((err) => {
		expect(err).toEqual(new Error("Invalid JSON response"));

		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const getUsersTest = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("get").once().withArgs("http://identity.com/api/users", {
		headers : {
			Authorization : "Bearer my token"
		}
	}).callsArgWith(2, null, { statusCode : 200 }, JSON.stringify({ hello : "world" }));

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.getUsers().then((users) => {
		expect(users).toEqual({
			hello : "world"
		});

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const registerUserErrorTest = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/api/users", {
		body 	: JSON.stringify({ hello : "world" }),
		headers : {
			Authorization : "Bearer my token",
			"content-type" : "application/json"
		}
	}).callsArgWith(2, new Error("oops"));

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.registerUser({
		hello : "world"
	}).catch((err) => {
		expect(err).toEqual(new Error("oops"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const registerUserInvalidStatusCode = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/api/users", {
		body 	: JSON.stringify({ hello : "world" }),
		headers : {
			Authorization : "Bearer my token",
			"content-type" : "application/json"
		}
	}).callsArgWith(2, null, { statusCode : 401 });

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.registerUser({
		hello : "world"
	}).catch((err) => {
		expect(err).toEqual(new Error("Invalid status code received - 401"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const registerUserInvalidLocation = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/api/users", {
		body 	: JSON.stringify({ hello : "world" }),
		headers : {
			Authorization : "Bearer my token",
			"content-type" : "application/json"
		}
	}).callsArgWith(2, null, { statusCode : 201, headers : {} });

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.registerUser({
		hello : "world"
	}).catch((err) => {
		expect(err).toEqual(new Error("Could not parse location header"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const registerUserTest = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").twice().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/api/users", {
		body 	: JSON.stringify({ hello : "world" }),
		headers : {
			Authorization : "Bearer my token",
			"content-type" : "application/json"
		}
	}).callsArgWith(2, null, { statusCode : 201, headers : { location : "/api/users/1234" } });

	requestMock.expects("get").once().withArgs("http://identity.com/api/users/1234", {
		headers : {
			Authorization : "Bearer my token"
		}
	}).callsArgWith(2, null, { statusCode : 200 }, JSON.stringify({ hello : "world" }));

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").twice().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.registerUser({
		hello : "world"
	}).then((user) => {
		expect(user).toEqual({
			hello : "world"
		});

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const getUserErrorTest = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("get").once().withArgs("http://identity.com/api/users/1234", {
		headers : {
			Authorization : "Bearer my token"
		}
	}).callsArgWith(2, new Error("oops"));

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.getUser("1234").catch((err) => {
		expect(err).toEqual(new Error("oops"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const getUserInvalidStatusCode = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("get").once().withArgs("http://identity.com/api/users/1234", {
		headers : {
			Authorization : "Bearer my token"
		}
	}).callsArgWith(2, null, { statusCode : 404 });

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.getUser("1234").catch((err) => {
		expect(err).toEqual(new Error("Invalid status code received - 404"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const getUserInvalidJSON = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("get").once().withArgs("http://identity.com/api/users/1234", {
		headers : {
			Authorization : "Bearer my token"
		}
	}).callsArgWith(2, null, { statusCode : 200 }, "{}{}{}{}{}{SD}{AS}D{");

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.getUser("1234").catch((err) => {
		expect(err).toEqual(new Error("Invalid JSON response"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const getUserTest = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("get").once().withArgs("http://identity.com/api/users/1234", {
		headers : {
			Authorization : "Bearer my token"
		}
	}).callsArgWith(2, null, { statusCode : 200 }, JSON.stringify({ hello : "world" }));

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.getUser("1234").then((user) => {
		expect(user).toEqual({
			hello : "world"
		});

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const updateUserErrorTest = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("put").once().withArgs("http://identity.com/api/users/1234", {
		body : JSON.stringify({
			username : "1234",
			password : "doot",
			claims : {
				hello : "world"
			}
		}),
		headers : {
			Authorization : "Bearer my token",
			"content-type" : "application/json"
		}
	}).callsArgWith(2, new Error("oops"));

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.updateUser("1234", "doot", {
		hello : "world"
	}).catch((err) => {
		expect(err).toEqual(new Error("oops"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const updateUserInvalidStatusCode = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("put").once().withArgs("http://identity.com/api/users/1234", {
		body : JSON.stringify({
			username : "1234",
			password : "doot",
			claims : {}
		}),
		headers : {
			Authorization : "Bearer my token",
			"content-type" : "application/json"
		}
	}).callsArgWith(2, null, { statusCode : 400 });

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.updateUser("1234", "doot").catch((err) => {
		expect(err).toEqual(new Error("Invalid status code received - 400"));

		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

const updateUserTest = (done) => {
	const authClientProviderMock = sinon.mock(authClientProvider);
	authClientProviderMock.expects("getAccessToken").once().returns(Promise.resolve("my token"));

	const requestMock = sinon.mock(request);
	requestMock.expects("put").once().withArgs("http://identity.com/api/users/1234", {
		body : JSON.stringify({
			username : "1234",
			password : "doot",
			claims : {
				hello : "world"
			}
		}),
		headers : {
			Authorization : "Bearer my token",
			"content-type" : "application/json"
		}
	}).callsArgWith(2, null, { statusCode : 204 });

	const hostnameMock = sinon.mock(hostnameResolver);
	hostnameMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = idmService(request, hostnameResolver);
	instance.setAuthClientProvider(authClientProvider);

	instance.updateUser("1234", "doot", {
		hello : "world"
	}).then(() => {
		authClientProviderMock.verify();
		authClientProviderMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameMock.verify();
		hostnameMock.restore();

		done();
	});
};

describe("An idm service provider", () => {
	describe("can get users", () => {
		it("handling errors", getUsersErrorTest);
		it("handling invalid status codes", getUsersInvalidStatusCode);
		it("handling invalid JSON", getUsersInvalidJSON);
		it("correctly", getUsersTest);
	});

	describe("can register a user", () => {
		it("handling errors", registerUserErrorTest);
		it("handling invalid status codes", registerUserInvalidStatusCode);
		it("handling invalid location header", registerUserInvalidLocation);
		it("correctly", registerUserTest);
	});

	describe("can get a user", () => {
		it("handling errors", getUserErrorTest);
		it("handling invalid status codes", getUserInvalidStatusCode);
		it("handling invalid JSON", getUserInvalidJSON);
		it("correctly", getUserTest);
	});

	describe("can update a user", () => {
		it("handling errors", updateUserErrorTest);
		it("handling invalid status codes", updateUserInvalidStatusCode);
		it("correctly", updateUserTest);
	});
});