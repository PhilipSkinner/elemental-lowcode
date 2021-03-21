const
	jasmine 			= require("jasmine"),
	sinon 				= require("sinon"),
	authClientProvider 	= require("../../shared/authClientProvider");

const request = {
	post : () => {}
};

const hostnameResolver = {
	resolveIdentity : () => {}
};

const sessionState = {
	setAccessToken 		: () => {},
	setIdentityToken 	: () => {},
	setRefreshToken 	: () => {},
	wipeSession			: () => {},
	getRefreshToken 	: () => {},
	getAccessToken 		: () => {},
};

const defaultsTest = () => {
	const instance = authClientProvider();

	expect(instance.config).toBe(undefined);
	expect(instance.request).not.toBe(null);
	expect(instance.hostnameResolver).not.toBe(null);
};

const sessionStateTest = () => {
	const instance = authClientProvider();

	expect(instance.sessionState).toBe(undefined);

	instance.setSessionState("doot");

	expect(instance.sessionState).toEqual("doot");
};

const loginErrorTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "password",
			username 		: "hello",
			password 		: "world",
			scope 			: "openid",
			client_id 		: "my_client",
			client_secret 	: "my_client_secret"
		}
	}).callsArgWith(2, new Error("oops"));

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "my_client",
		client_secret 	: "my_client_secret"
	}, request, hostnameResolver);

	instance.loginUser("hello", "world").catch((err) => {
		expect(err).toEqual(new Error("oops"));

		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

const loginInvalidStatusCodeTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("https://identity.org/token", {
		form : {
			grant_type 		: "password",
			username 		: "world",
			password 		: "hello",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret"
		}
	}).callsArgWith(2, null, {
		statusCode : 401
	});

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("https://identity.org");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	instance.loginUser("world", "hello").catch((err) => {
		expect(err).toEqual(new Error("Invalid credentials"));

		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

const loginInvalidPayloadTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("https://identity.org/token", {
		form : {
			grant_type 		: "password",
			username 		: "world",
			password 		: "hello",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret"
		}
	}).callsArgWith(2, null, {
		statusCode : 200
	}, "{}{}{}{}NOTJSON");

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("https://identity.org");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	instance.loginUser("world", "hello").catch((err) => {
		expect(err).toEqual(new Error("Error parsing token response"));

		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

const loginTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("https://identity.org/token", {
		form : {
			grant_type 		: "password",
			username 		: "world",
			password 		: "hello",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret"
		}
	}).callsArgWith(2, null, {
		statusCode : 200
	}, JSON.stringify({
		access_token 	: "access token",
		id_token 		: "id token",
		refresh_token 	: "refresh token"
	}));

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("https://identity.org");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("setAccessToken").once().withArgs("access token");
	sessionMock.expects("setIdentityToken").once().withArgs("id token");
	sessionMock.expects("setRefreshToken").once().withArgs("refresh token");

	instance.setSessionState(sessionState);

	instance.loginUser("world", "hello").then(() => {
		sessionMock.verify();
		sessionMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

const logoutTest = () => {
	const instance = authClientProvider();

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("wipeSession").once();

	instance.setSessionState(sessionState);

	instance.logoutUser();

	sessionMock.verify();
	sessionMock.restore();
};

const expirationNullTokenTest = () => {
	const instance = authClientProvider();

	expect(instance.tokenExpired(null)).toEqual(true);
};

const expirationEmptyTokenTest = () => {
	const instance = authClientProvider();

	expect(instance.tokenExpired("      ")).toEqual(true);
};

const expirationUndefinedTokenTest = () => {
	const instance = authClientProvider();

	expect(instance.tokenExpired()).toEqual(true);
};

const expirationInvalidTokenTest = () => {
	const instance = authClientProvider();

	expect(instance.tokenExpired("notatoken")).toEqual(true);
};

const expirationMissingExpClaimTest = () => {
	const instance = authClientProvider();

	const token = `header.${Buffer.from(JSON.stringify({}), "utf8").toString("base64")}.footer`;

	expect(instance.tokenExpired(token)).toEqual(false);
};

const expirationLessThanAMinuteTest = () => {
	const instance = authClientProvider();

	const time = Math.floor(new Date() / 1000);
	const token = `header.${Buffer.from(JSON.stringify({ exp : time + 30 }), "utf8").toString("base64")}.footer`;

	expect(instance.tokenExpired(token)).toEqual(true);
};

const expirationNotExpiredTest = () => {
	const instance = authClientProvider();

	const time = Math.floor(new Date() / 1000);
	const token = `header.${Buffer.from(JSON.stringify({ exp : time + 120 }), "utf8").toString("base64")}.footer`;

	expect(instance.tokenExpired(token)).toEqual(false);
};

const refreshMissingTokenTest = (done) => {
	const instance = authClientProvider();

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getRefreshToken").once().returns(null);

	instance.setSessionState(sessionState);

	instance.refreshUserToken().then((token) => {
		expect(token).toBe(null);

		sessionMock.verify();
		sessionMock.restore();

		done();
	});
};

const refreshErrorTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "refresh_token",
			refresh_token 	: "noot noot",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, new Error("oops"));

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getRefreshToken").once().returns("noot noot");

	instance.setSessionState(sessionState);

	instance.refreshUserToken().catch((err) => {
		expect(err).toEqual(new Error("oops"));

		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();
		sessionMock.verify();
		sessionMock.restore();

		done();
	});
};

const refreshInvalidStatusCodeTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "refresh_token",
			refresh_token 	: "noot noot",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, null, {
		statusCode : 401
	});

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getRefreshToken").once().returns("noot noot");

	instance.setSessionState(sessionState);

	instance.refreshUserToken().catch((err) => {
		expect(err).toEqual(new Error("Error refreshing user access token"));

		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();
		sessionMock.verify();
		sessionMock.restore();

		done();
	});
};

const refreshInvalidResponseTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "refresh_token",
			refresh_token 	: "noot noot",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, null, {
		statusCode : 200
	}, "KJSDKJSKDJKASJD{}{}{}{!!!!!");

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getRefreshToken").once().returns("noot noot");

	instance.setSessionState(sessionState);

	instance.refreshUserToken().catch((err) => {
		expect(err).toEqual(new Error("Error parsing refresh token response"));

		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();
		sessionMock.verify();
		sessionMock.restore();

		done();
	});
};

const refreshTokenTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "refresh_token",
			refresh_token 	: "noot noot",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, null, {
		statusCode : 200
	}, JSON.stringify({
		access_token 	: "access token",
		id_token 	 	: "id token",
		refresh_token 	: "refresh token"
	}));

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getRefreshToken").once().returns("noot noot");
	sessionMock.expects("setAccessToken").once().withArgs("access token");
	sessionMock.expects("setIdentityToken").once().withArgs("id token");
	sessionMock.expects("setRefreshToken").once().withArgs("refresh token");
	sessionMock.expects("getAccessToken").once().returns("hello there");

	instance.setSessionState(sessionState);

	instance.refreshUserToken().then((token) => {
		expect(token).toEqual("hello there");

		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();
		sessionMock.verify();
		sessionMock.restore();

		done();
	});
};

const getTokenUserTokenTest = (done) => {
	const instance = authClientProvider();

	const time = Math.floor(new Date() / 1000);
	const token = `header.${Buffer.from(JSON.stringify({ exp : time + 120 }), "utf8").toString("base64")}.footer`;

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getAccessToken").once().returns(token);

	instance.setSessionState(sessionState);

	instance.getAccessToken().then((_token) => {
		expect(_token).toEqual(token);

		sessionMock.verify();
		sessionMock.restore();

		done();
	});
};

const getTokenNoConfigTest = (done) => {
	const instance = authClientProvider();

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getAccessToken").once().returns(null);

	instance.setSessionState(sessionState);

	instance.getAccessToken().then((token) => {
		expect(token).toEqual("")

		sessionMock.verify();
		sessionMock.restore();

		done();
	});
};

const getTokenErrorTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "client_credentials",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, new Error("oops"));

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getAccessToken").once().returns(null);

	instance.setSessionState(sessionState);

	instance.getAccessToken().catch((err) => {
		expect(err).toEqual(new Error("oops"));

		sessionMock.verify();
		sessionMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

const getTokenInvalidStatusCodeTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "client_credentials",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, null, {
		statusCode : 401
	});

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getAccessToken").once().returns(null);

	instance.setSessionState(sessionState);

	instance.getAccessToken().then((token) => {
		expect(token).toEqual("");

		sessionMock.verify();
		sessionMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

const getTokenInvalidPayloadTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "client_credentials",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, null, {
		statusCode : 200
	}, "IUSIUDIUSD()*(*{}{}{}");

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getAccessToken").once().returns(null);

	instance.setSessionState(sessionState);

	instance.getAccessToken().catch((err) => {
		expect(err).toEqual(new Error("Error parsing token response"));

		sessionMock.verify();
		sessionMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

const getTokenMissingAccessTokenTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "client_credentials",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, null, {
		statusCode : 200
	}, JSON.stringify({

	}));

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getAccessToken").once().returns(null);

	instance.setSessionState(sessionState);

	instance.getAccessToken().then((token) => {
		expect(token).toEqual("");

		sessionMock.verify();
		sessionMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

const getTokenTest = (done) => {
	const requestMock = sinon.mock(request);
	requestMock.expects("post").once().withArgs("http://identity.com/token", {
		form : {
			grant_type 		: "client_credentials",
			scope 			: "openid",
			client_id 		: "another_client",
			client_secret 	: "another_client_secret",
		}
	}).callsArgWith(2, null, {
		statusCode : 200
	}, JSON.stringify({
		access_token : "hello there"
	}));

	const hostnameResolverMock = sinon.mock(hostnameResolver);
	hostnameResolverMock.expects("resolveIdentity").once().returns("http://identity.com");

	const instance = authClientProvider({
		scope 			: "openid",
		client_id 		: "another_client",
		client_secret 	: "another_client_secret"
	}, request, hostnameResolver);

	const sessionMock = sinon.mock(sessionState);
	sessionMock.expects("getAccessToken").once().returns(null);

	instance.setSessionState(sessionState);

	instance.getAccessToken().then((token) => {
		expect(token).toEqual("hello there");

		sessionMock.verify();
		sessionMock.restore();
		requestMock.verify();
		requestMock.restore();
		hostnameResolverMock.verify();
		hostnameResolverMock.restore();

		done();
	});
};

describe("AuthClientProvider", () => {
	it("defaults constructor args", defaultsTest);
	it("can set session state", sessionStateTest);

	describe("can login a user", () => {
		it("handling errors", loginErrorTest);
		it("handling none 200 status codes", loginInvalidStatusCodeTest);
		it("handling invalid payloads", loginInvalidPayloadTest);
		it("correctly", loginTest);
	});

	it("can logout a user", logoutTest);

	describe("can determine if a token has expired", () => {
		it("handling null tokens", expirationNullTokenTest);
		it("handling empty tokens", expirationEmptyTokenTest);
		it("handling undefined tokens", expirationUndefinedTokenTest);
		it("handling invalid strings", expirationInvalidTokenTest);
		it("handling missing expiration claim", expirationMissingExpClaimTest);
		it("with less than 60 seconds", expirationLessThanAMinuteTest);
		it("more than 60 seconds", expirationNotExpiredTest);
	});

	describe("can refresh a token", () => {
		it("handling a missing refresh token", refreshMissingTokenTest);
		it("handling errors", refreshErrorTest);
		it("handling none 200 error codes", refreshInvalidStatusCodeTest);
		it("handling invalid token response", refreshInvalidResponseTest);
		it("correctly", refreshTokenTest);
	});

	describe("can get an access token", () => {
		it("resolves user token if set", getTokenUserTokenTest);
		it("resolves empty when there is no config", getTokenNoConfigTest);
		it("handling errors", getTokenErrorTest);
		it("handling invalid status codes", getTokenInvalidStatusCodeTest);
		it("handling invalid payload", getTokenInvalidPayloadTest);
		it("handling missing access token in payload", getTokenMissingAccessTokenTest);
		it("correctly", getTokenTest);
	});
});