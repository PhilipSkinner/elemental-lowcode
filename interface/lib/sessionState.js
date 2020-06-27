const sessionState = function(sessionName) {
	this.sessionName = sessionName || "__session";
};

sessionState.prototype.saveSession = function(sessionData) {
	this.sessionData = sessionData;
};

sessionState.prototype.retrieveSession = function() {
	if (this.sessionData) {
		return this.sessionData;
	}

	if (
		this.request
		&& this.request.cookies
		&& this.request.cookies[this.sessionName]
	) {
		try {
			this.sessionData = JSON.parse(Buffer.from(this.request.cookies.__session, "base64").toString("utf8"));
		} catch(e) {
			this.sessionData = null;
		}
	}

	return this.sessionData;
};

sessionState.prototype.wipeSession = function() {
	if (
		this.request
		&& this.request.session
		&& this.request.session.destroy
	) {
		this.request.session.destroy();
	}
};

sessionState.prototype.setAccessToken = function(accessToken) {
	this.request = this.request || {};
	this.request.session = this.request.session || {};
	this.request.session.passport = this.request.session.passport || {};
	this.request.session.passport.user = this.request.session.passport.user || {};
	this.request.session.passport.user.accessToken = accessToken;
};

sessionState.prototype.setIdentityToken = function(identityToken) {
	this.request = this.request || {};
	this.request.session = this.request.session || {};
	this.request.session.passport = this.request.session.passport || {};
	this.request.session.passport.user = this.request.session.passport.user || {};
	this.request.session.passport.user.idToken = identityToken;
};

sessionState.prototype.setRefreshToken = function(refreshToken) {
	this.request = this.request || {};
	this.request.session = this.request.session || {};
	this.request.session.passport = this.request.session.passport || {};
	this.request.session.passport.user = this.request.session.passport.user || {};
	this.request.session.passport.user.refreshToken = refreshToken;
};

sessionState.prototype.getSubject = function() {
	if (
		this.request
		&& this.request.session
		&& this.request.session.passport
		&& this.request.session.passport.user
		&& this.request.session.passport.user.accessToken
	) {
		try {
			let claims = JSON.parse(Buffer.from(this.request.session.passport.user.accessToken.split(".")[1], "base64").toString("utf8"));
			return claims.sub;
		} catch(e) {
			console.log("Error parsing token for subject");
		}
	}


	return null;
};

sessionState.prototype.getAccessToken = function() {
	if (
		this.request
		&& this.request.session
		&& this.request.session.passport
		&& this.request.session.passport.user
		&& this.request.session.passport.user.accessToken
	) {
		return this.request.session.passport.user.accessToken;
	}

	return null;
};

sessionState.prototype.getIdentityToken = function() {
	if (
		this.request
		&& this.request.session
		&& this.request.session.passport
		&& this.request.session.passport.user
		&& this.request.session.passport.user.idToken
	) {
		return this.request.session.passport.user.idToken;
	}

	return null;
};

sessionState.prototype.getRefreshToken = function() {
	if (
		this.request
		&& this.request.session
		&& this.request.session.passport
		&& this.request.session.passport.user
		&& this.request.session.passport.user.refreshToken
	) {
		return this.request.session.passport.user.refreshToken;
	}

	return null;
};

sessionState.prototype._isDefined = function(val) {
	return typeof(val) !== "undefined" && val !== null && val !== "";
};

sessionState.prototype.isAuthenticated = function() {
	return this._isDefined(this.request)
		&& this._isDefined(this.request.session)
		&& this._isDefined(this.request.session.passport)
		&& this._isDefined(this.request.session.passport.user)
		&& (
			this._isDefined(this.request.session.passport.user.accessToken)
			|| this._isDefined(this.request.session.passport.user.idToken)
			|| this._isDefined(this.request.session.passport.user.refreshToken)
		);
};

sessionState.prototype.setContext = function(request, response) {
	this.request = request;
	this.response = response;
};

sessionState.prototype.deallocate = function() {
	this.request = null;
	this.response = null;
	this.sessionData = null;
};

sessionState.prototype.generateResponseHeaders = function() {
	if (!this.sessionData) {
		this.sessionData = this.retrieveSession();
	}

	if (
		this.sessionData
		&& !this.response.headersSent
		&& this.response
		&& this.response.cookie
	) {
		this.response.cookie(this.sessionName, Buffer.from(JSON.stringify(this.sessionData)).toString("base64"));
	}
};

module.exports = function(sessionName) {
	return new sessionState(sessionName);
};