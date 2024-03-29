const _securityClientEditorController = function(page) {
    this._page = page;
    this.showAlert = false;
    this.error = {
        visible : false
    };
    this.sectionVisible = "details";
    this.navitems = [
        {
            name        : "Details",
            event       : this.showDetails.bind(this),
            selected    : this.sectionVisible == "details"
        },
        {
            name        : "Claims",
            event       : this.showClaims.bind(this),
            selected    : this.sectionVisible == "claims"
        },
        {
            name        : "User Actions",
            event       : this.showRegistration.bind(this),
            selected    : this.sectionVisible == "registration"
        },
        {
            name        : "Password Enforcement",
            event       : this.showPasswords.bind(this),
            selected    : this.sectionVisible == "passwords"
        },
        {
            name        : "Terms & Privacy",
            event       : this.showTerms.bind(this),
            selected    : this.sectionVisible == "terms"
        },
        {
            name        : "Editor",
            event       : this.showEditor.bind(this),
            selected    : this.sectionVisible == "editor"
        }
    ];
    this.client = {
        grant_types : [],
        scope : "",
        redirect_uris : [],
        client_claims : {},
        user_claims : {},
        features : {
            validate : {},
            registration : {},
            reset : {},
            totp : {},
            login : {},
            terms : {
                implicit_consents : []
            },
            privacy : {
                implicit_consents : []
            },
            banned_passwords : [],
            password : {
                rules : {},
                helpers : []
            }
        },
        redirect_uris : [],
        post_logout_redirect_uris : []
    };
    this.grantTypes = {};
    this.addingScope = false;
    this.newScope = "";
    this.allScopes = [];
    this.addingRedirectUri = false;
    this.newRedirectUri = "";
    this.addingTermsImplicitConsent = false;
    this.newTermsImplicitConsent = "";
    this.addingPrivacyImplicitConsent = false;
    this.newPrivacyImplicitConsent = "";
    this.addingBannedPassword = false;
    this.newBannedPassword = "";
    this.addingClientClaim = false;
    this.addingUserClaim = false;
    this.newClaimName = "";
    this.newClaimValue = "";
    this.addingPasswordHelper = false;
    this.helperDescription = "";
    this.helperRegex = "";
    this.helperIndex = -1;
};

_securityClientEditorController.prototype.removePasswordHelper = function(index) {
    this.client.features.password.helpers = this.client.features.password.helpers.reduce((sum, a, i) => {
        if (i !== index) {
            sum.push(a);
        }

        return sum;
    }, []);

    this.refreshEditorState();
};

_securityClientEditorController.prototype.cancelAddPasswordHelper = function() {
    this.addingPasswordHelper = false;
    this.helperDescription = "";
    this.helperRegex = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.savePasswordHelper = function(index) {
    if (index === -1) {
        this.client.features.password.helpers.push({
            description : this.caller.helperDescription,
            regex       : this.caller.helperRegex
        });
    } else {
        this.client.features.password.helpers[index].description = this.caller.helperDescription;
        this.client.features.password.helpers[index].regex = this.caller.helperRegex;
    }

    this.addingPasswordHelper = false;
    this.helperDescription = "";
    this.helperRegex = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.modifyPasswordHelper = function(index) {
    this.addingPasswordHelper = true;
    this.helperDescription = "";
    this.helperRegex = "";
    this.helperIndex = index;

    if (index > -1) {
        this.helperDescription = this.client.features.password.helpers[index].description;
        this.helperRegex = this.client.features.password.helpers[index].regex;
    }

    this.forceRefresh();
};

_securityClientEditorController.prototype.removeClientClaim = function(name, value) {
    this.client.client_claims = Object.keys(this.client.client_claims).reduce((sum, a) => {
        if (a !== name) {
            sum[a] = this.client.client_claims[a];
        } else {
            var newValues = this.client.client_claims[a].reduce((claims, b) => {
                if (b !== value) {
                    claims.push(b);
                }

                return claims;
            }, []);

            if (newValues.length > 0) {
                sum[a] = newValues;
            }
        }

        return sum;
    }, {});

    this.refreshEditorState();
};

_securityClientEditorController.prototype.removeUserClaim = function(name, value) {
    this.client.user_claims = Object.keys(this.client.user_claims).reduce((sum, a) => {
        if (a !== name) {
            sum[a] = this.client.user_claims[a];
        } else {
            var newValues = this.client.user_claims[a].reduce((claims, b) => {
                if (b !== value) {
                    claims.push(b);
                }

                return claims;
            }, []);

            if (newValues.length > 0) {
                sum[a] = newValues;
            }
        }

        return sum;
    }, {});

    this.refreshEditorState();
};

_securityClientEditorController.prototype.cancelAddClientClaim = function() {
    this.addingClientClaim = false;
    this.newClaimValue = "";
    this.newClaimName = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.cancelAddUserClaim = function() {
    this.addingUserClaim = false;
    this.newClaimValue = "";
    this.newClaimName = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.saveClientClaim = function() {
    if (typeof(this.client.client_claims[this.caller.newClaimName]) === "undefined") {
        this.client.client_claims[this.caller.newClaimName] = [];
    }

    if (!Array.isArray(this.client.client_claims[this.caller.newClaimName])) {
        this.client.client_claims[this.caller.newClaimName] = [this.client.client_claims[this.caller.newClaimName]];
    }

    this.client.client_claims[this.caller.newClaimName].push(this.caller.newClaimValue);

    this.addingClientClaim = false;
    this.newClaimValue = "";
    this.newClaimName = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.saveUserClaim = function() {
    if (typeof(this.client.user_claims[this.caller.newClaimName]) === "undefined") {
        this.client.user_claims[this.caller.newClaimName] = [];
    }

    if (!Array.isArray(this.client.user_claims[this.caller.newClaimName])) {
        this.client.user_claims[this.caller.newClaimName] = [this.client.user_claims[this.caller.newClaimName]];
    }

    this.client.user_claims[this.caller.newClaimName].push(this.caller.newClaimValue);

    this.addingUserClaim = false;
    this.newClaimValue = "";
    this.newClaimName = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.addClientClaim = function() {
    this.addingClientClaim = true;
    this.newClaimValue = "";
    this.newClaimName = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.addUserClaim = function() {
    this.addingUserClaim = true;
    this.newClaimValue = "";
    this.newClaimName = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.clientClaims = function() {
    return Object.keys(this.client.client_claims || {}).reduce((sum, key) => {
        if (!Array.isArray(this.client.client_claims[key])) {
            this.client.client_claims[key] = [this.client.client_claims[key]];
        }

        return sum.concat(this.client.client_claims[key].map((m) => {
            return { name : key, value : m }
        }));
    }, []);
};

_securityClientEditorController.prototype.userClaims = function() {
    return Object.keys(this.client.user_claims || {}).reduce((sum, key) => {
        if (!Array.isArray(this.client.user_claims[key])) {
            this.client.user_claims[key] = [this.client.user_claims[key]];
        }

        return sum.concat(this.client.user_claims[key].map((m) => {
            return { name : key, value : m }
        }));
    }, []);
};

_securityClientEditorController.prototype.cancelAddBannedPassword = function() {
    this.newBannedPassword = ""
    this.addingBannedPassword = false;
    this.forceRefresh();
};

_securityClientEditorController.prototype.saveBannedPassword = function() {
    this.client.features.banned_passwords.push(this.caller.newBannedPassword);
    this.newBannedPassword = ""
    this.addingBannedPassword = false;
    this.forceRefresh();
};

_securityClientEditorController.prototype.removeBannedPassword = function(password) {
    this.client.features.banned_passwords = this.client.features.banned_passwords.reduce((sum, a) => {
        if (a !== password) {
            sum.push(a);
        }

        return sum;
    }, []);
    this.forceRefresh();
};

_securityClientEditorController.prototype.addBannedPassword = function() {
    this.addingBannedPassword = true;
    this.newBannedPassword = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.removePrivacyImplicitConsent = function(consent) {
    this.client.features.privacy.implicit_consents = this.client.features.privacy.implicit_consents.reduce((sum, a) => {
        if (a !== consent) {
            sum.push(a);
        }

        return sum;
    }, []);
    this.forceRefresh();
};

_securityClientEditorController.prototype.cancelAddPrivacyImplicitConsent = function() {
    this.newPrivacyImplicitConsent = "";
    this.addingPrivacyImplicitConsent = false;
    this.forceRefresh();
};

_securityClientEditorController.prototype.savePrivacyImplicitConsent = function() {
    this.client.features.privacy.implicit_consents.push(this.caller.newPrivacyImplicitConsent);
    this.newPrivacyImplicitConsent = "";
    this.addingPrivacyImplicitConsent = false;
    this.forceRefresh();
};

_securityClientEditorController.prototype.addPrivacyImplicitConsent = function() {
    this.addingPrivacyImplicitConsent = true;
    this.newPrivacyImplicitConsent = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.removeTermsImplicitConsent = function(consent) {
    this.client.features.terms.implicit_consents = this.client.features.terms.implicit_consents.reduce((sum, a) => {
        if (a !== consent) {
            sum.push(a);
        }

        return sum;
    }, []);
    this.forceRefresh();
};

_securityClientEditorController.prototype.cancelAddTermsImplicitConsent = function() {
    this.newTermsImplicitConsent = "";
    this.addingTermsImplicitConsent = false;
    this.forceRefresh();
};

_securityClientEditorController.prototype.saveTermsImplicitConsent = function() {
    this.client.features.terms.implicit_consents.push(this.caller.newTermsImplicitConsent);
    this.newTermsImplicitConsent = "";
    this.addingTermsImplicitConsent = false;
    this.forceRefresh();
};

_securityClientEditorController.prototype.addTermsImplicitConsent = function() {
    this.addingTermsImplicitConsent = true;
    this.newTermsImplicitConsent = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.standardiseClient = function() {
    this.client.grant_types                         = this.client.grant_types || [];
    this.client.scope                               = this.client.scope || "";
    this.client.redirect_uris                       = this.client.redirect_uris || {};
    this.client.client_claims                       = this.client.client_claims || {};
    this.client.user_claims                         = this.client.user_claims || {};
    this.client.features                            = this.client.features || {};
    this.client.features.registration               = this.client.features.registration || {};
    this.client.features.reset                      = this.client.features.reset || {};
    this.client.features.totp                       = this.client.features.totp || {};
    this.client.features.terms                      = this.client.features.terms || {};
    this.client.features.terms.implicit_consents    = this.client.features.terms.implicit_consents || [];
    this.client.features.privacy                    = this.client.features.privacy || {};
    this.client.features.privacy.implicit_consents  = this.client.features.privacy.implicit_consents || [];
    this.client.features.banned_passwords           = this.client.features.banned_passwords || [];
    this.client.features.password                   = this.client.features.password || {};
    this.client.features.password.rules             = this.client.features.password.rules || {};
    this.client.features.password.helpers           = this.client.features.password.helpers || [];
    this.client.features.login                      = this.client.features.login || {};
    this.client.features.validate                   = this.client.features.validate || {};
    this.client.redirect_uris                       = this.client.redirect_uris || [];
    this.client.post_logout_redirect_uris           = this.client.post_logout_redirect_uris || [];
};

_securityClientEditorController.prototype.cancelAddingLogoutRedirectUri = function() {
    this.addingLogoutRedirectUri = false;
    this.newLogoutRedirectUri = "https://";
    this.forceRefresh();
};

_securityClientEditorController.prototype.saveLogoutRedirectUri = function() {
    this.client.post_logout_redirect_uris.push(this.caller.newLogoutRedirectUri.trim());

    this.addingLogoutRedirectUri = false;
    this.newLogoutRedirectUri = "https://";
    this.forceRefresh();
};

_securityClientEditorController.prototype.addLogoutRedirectUri = function() {
    this.addingLogoutRedirectUri = true;
    this.newLogoutRedirectUri = "https://";
    this.forceRefresh();
};

_securityClientEditorController.prototype.removeLogoutRedirectUri = function(uri) {
    this.client.post_logout_redirect_uris = this.client.post_logout_redirect_uris.reduce((sum, a) => {
        if (a !== uri) {
            sum.push(a);
        }

        return sum;
    }, []);

    this.forceRefresh();
};

_securityClientEditorController.prototype.cancelAddingRedirectUri = function() {
    this.addingRedirectUri = false;
    this.newRedirectUri = "https://";
    this.forceRefresh();
};

_securityClientEditorController.prototype.saveRedirectUri = function() {
    this.client.redirect_uris.push(this.caller.newRedirectUri.trim());

    this.addingRedirectUri = false;
    this.newRedirectUri = "https://";
    this.forceRefresh();
};

_securityClientEditorController.prototype.addRedirectUri = function() {
    this.addingRedirectUri = true;
    this.newRedirectUri = "https://";
    this.forceRefresh();
};

_securityClientEditorController.prototype.removeRedirectUri = function(uri) {
    this.client.redirect_uris = this.client.redirect_uris.reduce((sum, a) => {
        if (a !== uri) {
            sum.push(a);
        }

        return sum;
    }, []);

    this.forceRefresh();
};

_securityClientEditorController.prototype.cancelAddScope = function() {
    this.addingScope = false;
    this.newScope = "";
    this.forceRefresh();    
};

_securityClientEditorController.prototype.saveScope = function() {
    this.client.scope += ` ${this.caller.newScope}`;

    this.addingScope = false;
    this.newScope = "";
    this.forceRefresh();    
};

_securityClientEditorController.prototype.addScope = function() {
    this.addingScope = true;
    this.newScope = "";
    this.forceRefresh();
};

_securityClientEditorController.prototype.removeScope = function(scope) {    
    this.client.scope = this.client.scope.split(" ").reduce((sum, a) => {
        if (a !== scope) {
            sum += `${a} `;
        }
        return sum;
    }, "");

    this.forceRefresh();
};

_securityClientEditorController.prototype.showDetails = function() {
    this.navitems[0].selected = true;
    this.navitems[1].selected = false;
    this.navitems[2].selected = false;
    this.navitems[3].selected = false;
    this.navitems[4].selected = false;
    this.navitems[5].selected = false;
    this.sectionVisible = "details";

    this.refreshInternalState();    

    this.forceRefresh();
};

_securityClientEditorController.prototype.showClaims = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = true;
    this.navitems[2].selected = false;
    this.navitems[3].selected = false;
    this.navitems[4].selected = false;
    this.navitems[5].selected = false;
    this.sectionVisible = "claims";

    this.refreshInternalState();

    this.forceRefresh();
};

_securityClientEditorController.prototype.showRegistration = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = false;
    this.navitems[2].selected = true;
    this.navitems[3].selected = false;
    this.navitems[4].selected = false;
    this.navitems[5].selected = false;
    this.sectionVisible = "registration";

    this.refreshInternalState();

    this.forceRefresh();
};

_securityClientEditorController.prototype.showPasswords = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = false;
    this.navitems[2].selected = false;
    this.navitems[3].selected = true;
    this.navitems[4].selected = false;
    this.navitems[5].selected = false;
    this.sectionVisible = "passwords";

    this.refreshInternalState();

    this.forceRefresh();
};

_securityClientEditorController.prototype.showTerms = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = false;
    this.navitems[2].selected = false;
    this.navitems[3].selected = false;
    this.navitems[4].selected = true;
    this.navitems[5].selected = false;
    this.sectionVisible = "terms";

    this.refreshInternalState();

    this.forceRefresh();
};

_securityClientEditorController.prototype.showEditor = function() {
    this.navitems[0].selected = false;
    this.navitems[1].selected = false;
    this.navitems[2].selected = false;
    this.navitems[3].selected = false;
    this.navitems[4].selected = false;
    this.navitems[5].selected = true;
    this.sectionVisible = "editor";

    this.refreshEditorState();

    this.forceRefresh();
};

_securityClientEditorController.prototype.refreshInternalState = function() {
    this.client = JSON.parse(this.editor.getValue());

    this.grantTypes = {};
    if (this.client.grant_types) {
        this.client.grant_types.forEach((a) => {
            this.grantTypes[a] = true;
        });
    }
};

_securityClientEditorController.prototype.initEditor = function() {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById("clientEditor"), {
        mode : "ace/mode/json",
        selectionStyle : "text"
    });
    this.editor.commands.addCommand({
        name : "save",
        bindKey : {
            win: "Ctrl-S",
            mac: "Cmd-S"
        },
        exec : () => {
            this.save();
        }
    });
    this.editor.setTheme("ace/theme/twilight");
};

_securityClientEditorController.prototype.initBlankType = function() {
    this.name = null;

    //set the example
    this.editor.setValue(JSON.stringify({
        client_id : "my-client",
        client_secret : "my really secret secret",
        scope : "openid roles",
        redirect_uris : [
            `${window.hosts.interface}/callback`
        ],
        features : {
            registration : {
                enabled : false
            }
        }
    }, null, 4));

    this.refreshInternalState();
    this.standardiseClient();
    this.forceRefresh();
};

_securityClientEditorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_securityClientEditorController.prototype.getData = function() {
    return {
        showAlert                       : this.showAlert,
        error                           : this.error,
        navitems                        : this.navitems,
        sectionVisible                  : this.sectionVisible,
        client                          : this.client,
        grantTypes                      : this.grantTypes,
        addingScope                     : this.addingScope,
        newScope                        : this.newScope,
        allScopes                       : this.allScopes,
        addingRedirectUri               : this.addingRedirectUri,
        newRedirectUri                  : this.newRedirectUri,
        addingTermsImplicitConsent      : this.addingTermsImplicitConsent,
        newTermsImplicitConsent         : this.newTermsImplicitConsent,
        addingPrivacyImplicitConsent    : this.addingPrivacyImplicitConsent,
        newPrivacyImplicitConsent       : this.newPrivacyImplicitConsent,
        addingBannedPassword            : this.addingBannedPassword,
        newBannedPassword               : this.newBannedPassword,
        addingClientClaim               : this.addingClientClaim,
        addingUserClaim                 : this.addingUserClaim,
        newClaimName                    : this.newClaimName,
        newClaimValue                   : this.newClaimValue,
        addingPasswordHelper            : this.addingPasswordHelper,
        helperDescription               : this.helperDescription,
        helperRegex                     : this.helperRegex,
        helperIndex                     : this.helperIndex,
        addingLogoutRedirectUri         : this.addingLogoutRedirectUri,
        newLogoutRedirectUri            : this.newLogoutRedirectUri,
    };
};

_securityClientEditorController.prototype.forceRefresh = function() {
    this.caller.showAlert                       = this.showAlert;
    this.caller.error                           = this.error;
    this.caller.navitems                        = this.navitems;
    this.caller.sectionVisible                  = this.sectionVisible;
    this.caller.client                          = this.client;
    this.caller.grantTypes                      = this.grantTypes;
    this.caller.addingScope                     = this.addingScope;
    this.caller.newScope                        = this.newScope;
    this.caller.allScopes                       = this.allScopes;
    this.caller.addingRedirectUri               = this.addingRedirectUri;
    this.caller.newRedirectUri                  = this.newRedirectUri;
    this.caller.addingTermsImplicitConsent      = this.addingTermsImplicitConsent;
    this.caller.newTermsImplicitConsent         = this.newTermsImplicitConsent;
    this.caller.addingPrivacyImplicitConsent    = this.addingPrivacyImplicitConsent;
    this.caller.newPrivacyImplicitConsent       = this.newPrivacyImplicitConsent;
    this.caller.addingBannedPassword            = this.addingBannedPassword;
    this.caller.newBannedPassword               = this.newBannedPassword;
    this.caller.addingClientClaim               = this.addingClientClaim;
    this.caller.addingUserClaim                 = this.addingUserClaim;
    this.caller.newClaimName                    = this.newClaimName;
    this.caller.newClaimValue                   = this.newClaimValue;
    this.caller.addingPasswordHelper            = this.addingPasswordHelper;
    this.caller.helperDescription               = this.helperDescription;
    this.caller.helperRegex                     = this.helperRegex;
    this.caller.helperIndex                     = this.helperIndex;
    this.caller.addingLogoutRedirectUri         = this.addingLogoutRedirectUri;
    this.caller.newLogoutRedirectUri            = this.newLogoutRedirectUri;
    this.refreshEditorState();

    this.caller.$forceUpdate();
};

_securityClientEditorController.prototype.refreshEditorState = function() {
    this.client.grant_types = Object.keys(this.grantTypes).reduce((sum, a) => {
        if (this.grantTypes[a]) {
            sum.push(a);
        }

        return sum;
    }, []);

    this.editor.setValue(JSON.stringify(this.client, null, 4));
}

_securityClientEditorController.prototype.fetchClient = function(name) {
    this.name = name;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/clients/${name}`)
        .then((response) => {            
            this.client = response.data;  
            this.standardiseClient();          
            this.editor.setValue(JSON.stringify(response.data, null, 4));
            this.refreshInternalState();
            this.forceRefresh();
        });
};

_securityClientEditorController.prototype.save = function() {
    if (this.sectionVisible !== "editor") {
        this.refreshEditorState();
    } else {
        this.refreshInternalState();
    }

    var data = this.editor.getValue();

    if (this.name) {
        return window.axiosProxy
            .put(`${window.hosts.kernel}/security/clients/${this.name}`, data, {
                headers : {
                    "Content-Type" : "application/json",
                }
            })
            .then((response) => {
                this.showAlert = true;
                this.forceRefresh();                

                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();                
                }, 1500);
            }).catch((err) => {
                this.error = {
                    visible : true,
                    title : "Error saving client",
                    description : err.toString()
                };
                
                this.forceRefresh();
            });
    } else {
        return window.axiosProxy
            .post(`${window.hosts.kernel}/security/clients`, this.editor.getValue(), {
                headers : {
                    "Content-Type" : "application/json",
                }
            })
            .then((response) => {
                this.name = this.client.client_id;
                location.href = `/#/security/client/${this.name}`;
                this.showAlert = true;
                this.forceRefresh();                

                setTimeout(() => {
                    this.showAlert = false;
                    this.forceRefresh();                
                }, 1500);
            }).catch((err) => {
                this.error = {
                    visible : true,
                    title : "Error saving client",
                    description : err.toString()
                };
                
                this.forceRefresh();
            });
    }
};

_securityClientEditorController.prototype.fetchScopes = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/scopes`)
        .then((response) => {
            this.allScopes = response.data;
            this.forceRefresh();
        });
};

window.SecurityClientEditor = {
    template : "#template-securityClientEditor",
    data 	 : () => {
        return window._securityClientEditorControllerInstance.getData();
    },
    mounted  : function() {
        window._securityClientEditorControllerInstance.setCaller(this);
        window._securityClientEditorControllerInstance.initEditor();
        return window._securityClientEditorControllerInstance.fetchScopes().then(() => {
            if (this.$route.params.id === ".new") {
                window._securityClientEditorControllerInstance.initBlankType();
                return null;
            }

            return window._securityClientEditorControllerInstance.fetchClient(this.$route.params.id);
        });
    }
};

window._securityClientEditorControllerInstance = new _securityClientEditorController(window.SecurityClientEditor);