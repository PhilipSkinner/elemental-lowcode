const _securityController = function(page) {
    this._page = page;
    this.clients = [];
    this.scopes = [];
    this.users = [];
    this.secrets = [];
    this.bannedPasswords = [];
    this.currentSecret = {};
    this.settingsVisible = true;
    this.storageVisible = false;
    this.secretsVisible = false;
    this.bannedPasswordsVisible = false;
    this.addingBannedPassword = false;
    this.settingSecretValue = false;
    this.addingSecret = false;
    this.showAlert = false;
    this.currentPassword = "";
    this.navitems = [
        {
            name 		: "Settings",
            event 		: this.showSettings.bind(this),
            selected 	: this.settingsVisible
        },
        {
            name        : "Banned Passwords",
            event       : this.showBannedPasswords.bind(this),
            selected    : this.bannedPasswordsVisible
        },
        {
            name 		: "Secrets",
            event 		: this.showSecrets.bind(this),
            selected	: this.secretsVisible
        }
    ];
    this.config = {};
};

_securityController.prototype.getData = function() {
    return {
        clients 					: this.clients,
        users 						: this.users,
        scopes 						: this.scopes,
        bannedPasswords             : this.bannedPasswords,
        settingsVisible 			: this.settingsVisible,
        secretsVisible 				: this.secretsVisible,
        bannedPasswordsVisible      : this.bannedPasswordsVisible,
        addingBannedPassword        : this.addingBannedPassword,
        addingSecret 				: this.addingSecret,
        Secrets 					: this.secrets,
        navitems 					: this.navitems,
        config 						: this.config,
        showAlert 					: this.showAlert,
        currentSecret 				: this.currentSecret,
        settingSecretValue 			: this.settingSecretValue,
        currentPassword             : this.currentPassword,
        deleteClientConfirmVisible 	: false,
        confirmClientDeleteAction 	: () => {},
        deleteUserConfirmVisible 	: false,
        confirmUserDeleteAction 	: () => {},
        deleteSecretConfirmVisible 	: false,
        confirmSecretDeleteAction 	: () => {}
    };
};

_securityController.prototype.forceRefresh = function() {
    this.caller.clients = this.clients;
    this.caller.users = this.users;
    this.caller.scopes = this.scopes;
    this.caller.bannedPasswords = this.bannedPasswords;
    this.caller.settingsVisible = this.settingsVisible;
    this.caller.showAlert = this.showAlert;
    this.caller.config = this.config;
    this.navitems[0].selected = this.settingsVisible;
    this.navitems[1].selected = this.bannedPasswordsVisible;
    this.navitems[2].selected = this.secretsVisible;
    this.caller.navitems = this.navitems;
    this.caller.secretsVisible = this.secretsVisible;
    this.caller.addingSecret = this.addingSecret;
    this.caller.secrets = this.secrets;
    this.caller.currentSecret = this.currentSecret;
    this.caller.settingSecretValue = this.settingSecretValue;
    this.caller.bannedPasswordsVisible = this.bannedPasswordsVisible;
    this.caller.addingBannedPassword = this.addingBannedPassword;
    this.caller.currentPassword = this.currentPassword;

    this.caller.$forceUpdate();
};

_securityController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_securityController.prototype.showSettings = function() {
    this.settingsVisible = true;
    this.secretsVisible = false;
    this.addingSecret = false;
    this.bannedPasswordsVisible = false;
    this.addingBannedPassword = false;

    this.forceRefresh();
};

_securityController.prototype.showSecrets = function() {
    this.settingsVisible = false;
    this.addingSecret = false;
    this.secretsVisible = true;
    this.bannedPasswordsVisible = false;
    this.addingBannedPassword = false;

    this.forceRefresh();
};

_securityController.prototype.showBannedPasswords = function() {
    this.settingsVisible = false;
    this.addingSecret = false;
    this.secretsVisible = false;
    this.bannedPasswordsVisible = true;
    this.addingBannedPassword = false;

    this.forceRefresh();
};

_securityController.prototype.addBannedPassword = function() {
    this.addingBannedPassword = true;
    this.currentPassword = "";

    this.forceRefresh();
};

_securityController.prototype.cancelSetBannedPassword = function() {
    this.addingBannedPassword = false;
    this.currentPassword = "";

    this.forceRefresh();
};

_securityController.prototype.addSecret = function() {
    this.addingSecret = true;
    this.currentSecret = {};

    this.forceRefresh();
};

_securityController.prototype.setSecret = function(name) {
    this.settingSecretValue = true;
    this.currentSecret = {
        name 	: name,
        value 	: ""
    };

    this.forceRefresh();
};

_securityController.prototype.cancelSetSecret = function() {
    this.currentSecret = {};
    this.settingSecretValue = false;

    this.forceRefresh();
};

_securityController.prototype.deleteClient = function(name) {
    this.caller.deleteSecretConfirmVisible = false;
    this.caller.deleteUserConfirmVisible = false;
    this.caller.deleteClientConfirmVisible = true;
    this.caller.confirmClientDeleteAction = () => {
        this.caller.deleteSecretConfirmVisible = false;
        this.caller.deleteUserConfirmVisible = false;
        this.caller.deleteClientConfirmVisible = false;
        return this._deleteClient(name);
    };
    this.caller.$forceUpdate();
    return;
};

_securityController.prototype._deleteClient = function(clientId) {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/security/clients/${clientId}`)
        .then((response) => {
            return this.fetchClients();
        });
};

_securityController.prototype.fetchClients = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/clients`)
        .then((response) => {
            this.clients = response.data;
            this.forceRefresh();
        });
};

_securityController.prototype.deleteScope = function(scope) {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/security/scopes/${scope}`)
        .then((response) => {
            return this.fetchScopes();
        });
};

_securityController.prototype.fetchScopes = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/scopes`)
        .then((response) => {
            this.scopes = response.data;
            this.forceRefresh();
        });
};

_securityController.prototype.deleteUser = function(userId) {
    this.caller.deleteSecretConfirmVisible = false;
    this.caller.deleteUserConfirmVisible = true;
    this.caller.deleteClientConfirmVisible = false;
    this.caller.confirmUserDeleteAction = () => {
        this.caller.deleteSecretConfirmVisible = false;
        this.caller.deleteUserConfirmVisible = false;
        this.caller.deleteClientConfirmVisible = false;
        return this._deleteUser(userId);
    };
    this.caller.$forceUpdate();
    return;
};

_securityController.prototype._deleteUser = function(userId) {
    return window.axiosProxy
        .delete(`${window.hosts.identity}/api/users/${userId}`)
        .then((response) => {
            return this.fetchUsers();
        });
};

_securityController.prototype.fetchUsers = function() {
    return window.axiosProxy
        .get(`${window.hosts.identity}/api/users`)
        .then((response) => {
            this.users = response.data;
            this.forceRefresh();
        });
};

_securityController.prototype.fetchSecrets = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/secrets`).then((response) => {
            this.secrets = response.data;
            this.forceRefresh();
        });
};

_securityController.prototype.fetchBannedPasswords = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/bannedpasswords`).then((response) => {
            this.bannedPasswords = response.data;
            this.forceRefresh();
        });
};

_securityController.prototype.saveBannedPassword = function() {
    this.bannedPasswords.push(this.caller.currentPassword);

    //remove duplicates
    this.bannedPasswords = this.bannedPasswords.filter((v, i, s) => { return s.indexOf(v) === i; });

    return window.axiosProxy
        .put(`${window.hosts.kernel}/security/bannedpasswords`, JSON.stringify(this.bannedPasswords), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            this.showBannedPasswords();
            return this.fetchBannedPasswords();
        });
};

_securityController.prototype.removeBannedPassword = function(password) {
    //remove duplicates && the password
    this.bannedPasswords = this.bannedPasswords.filter((v, i, s) => {
        return s.indexOf(v) === i && v !== password;
    });

    return window.axiosProxy
        .put(`${window.hosts.kernel}/security/bannedpasswords`, JSON.stringify(this.bannedPasswords), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            this.showBannedPasswords();
            return this.fetchBannedPasswords();
        });
};

_securityController.prototype.saveSecret = function() {
    return window.axiosProxy
        .post(`${window.hosts.kernel}/security/secrets`, JSON.stringify({
            name : this.currentSecret.name,
            scope : this.currentSecret.scope
        }), {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            this.showSecrets();
            return this.fetchSecrets();
        });
};

_securityController.prototype.removeSecret = function(name) {
    this.caller.deleteSecretConfirmVisible = true;
    this.caller.deleteUserConfirmVisible = false;
    this.caller.deleteClientConfirmVisible = false;
    this.caller.confirmSecretDeleteAction = () => {
        this.caller.deleteSecretConfirmVisible = false;
        this.caller.deleteUserConfirmVisible = false;
        this.caller.deleteClientConfirmVisible = false;
        return this._removeSecret(name);
    };
    this.caller.$forceUpdate();
    return;
};

_securityController.prototype._removeSecret = function(name) {
    return window.axiosProxy
        .delete(`${window.hosts.kernel}/security/secrets/${name}`).then((response) => {
            return this.fetchSecrets();
        });
};

_securityController.prototype.saveSecretValue = function() {
    return window.axiosProxy
        .put(`${window.hosts.kernel}/security/secrets/${this.currentSecret.name}`, this.currentSecret.value, {
            headers : {
                "Content-Type" : "text/plain",
            }
        }).then((response) => {
            this.cancelSetSecret();
            return this.forceRefresh();
        });
};

window.Security = {
    template : "#template-security",
    data 	 : () => {
        return window._securityControllerInstance.getData();
    },
    mounted  : function() {
        window._securityControllerInstance.setCaller(this);

        return window._securityControllerInstance.fetchClients().then(() => {
            return window._securityControllerInstance.fetchScopes();
        }).then(() => {
            return window._securityControllerInstance.fetchUsers();
        }).then(() => {
            return window._securityControllerInstance.fetchSecrets();
        }).then(() => {
            return window._securityControllerInstance.fetchBannedPasswords();
        });
    }
};

window._securityControllerInstance = new _securityController(window.Security);