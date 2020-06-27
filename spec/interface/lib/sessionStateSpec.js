const
	sinon 			= require("sinon"),
	sessionState 	= require("../../../interface/lib/sessionState");

const request = {
	cookies : {},
	session : {
		destroy : () => {
			request.session = null;
		}
	}
};

const response = {

};

const constructorTest = (done) => {
	const instance = sessionState();
	expect(instance.sessionName).toEqual("__session");
	done();
};

const lifecycleTest = (done) => {
	const instance = sessionState();

	instance.setContext(request, response);
	instance.setAccessToken("access token");
	instance.setIdentityToken("identity token");
	instance.setRefreshToken("refresh token");

	expect(instance.getSubject()).toBe(null);
	expect(instance.getAccessToken()).toEqual("access token");
	expect(instance.getIdentityToken()).toEqual("identity token");
	expect(instance.getRefreshToken()).toEqual("refresh token");
	expect(instance.isAuthenticated()).toEqual(true);

	//wipe the session
	instance.wipeSession();

	expect(instance.getSubject()).toBe(null);
	expect(instance.getAccessToken()).toBe(null);
	expect(instance.getIdentityToken()).toBe(null);
	expect(instance.getRefreshToken()).toBe(null);
	expect(instance.isAuthenticated()).toEqual(false);

	instance.setContext(request, response);
	instance.setAccessToken("access token");
	instance.setIdentityToken("identity token");
	instance.setRefreshToken("refresh token");

	expect(instance.getSubject()).toBe(null);
	expect(instance.getAccessToken()).toEqual("access token");
	expect(instance.getIdentityToken()).toEqual("identity token");
	expect(instance.getRefreshToken()).toEqual("refresh token");
	expect(instance.isAuthenticated()).toEqual(true);

	//deallocate should do the same thing
	instance.deallocate();
	expect(instance.getSubject()).toBe(null);
	expect(instance.getAccessToken()).toBe(null);
	expect(instance.getIdentityToken()).toBe(null);
	expect(instance.getRefreshToken()).toBe(null);
	expect(instance.isAuthenticated()).toEqual(false);

	//can parse tokens
	instance.setContext(request, response);
	instance.setAccessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
	expect(instance.getSubject()).toEqual("1234567890");

	//can save session data
	expect(instance.retrieveSession()).toBe(null);
	request.cookies.__session = Buffer.from(JSON.stringify("doot")).toString("base64");
	expect(instance.retrieveSession()).toEqual("doot");
	instance.saveSession("woot");
	expect(instance.retrieveSession()).toEqual("woot");

	done();
};

const nullContextTest = (done) => {
	const instance = sessionState();

	instance.setAccessToken("access token");
	instance.setIdentityToken("identity token");
	instance.setRefreshToken("refresh token");

	expect(instance.getSubject()).toBe(null);
	expect(instance.getAccessToken()).toEqual("access token");
	expect(instance.getIdentityToken()).toEqual("identity token");
	expect(instance.getRefreshToken()).toEqual("refresh token");
	expect(instance.isAuthenticated()).toEqual(true);

	instance.wipeSession();
	instance.generateResponseHeaders();

	done();
};

describe("A session state service", () => {
	it("defaults its constructor arguments", constructorTest);
	it("can handle all lifecycle events correctly", lifecycleTest);
	it("can handle null contexts", nullContextTest);
});