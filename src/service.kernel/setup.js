const setup = function(fs, path, inquirer, idm) {
    this.fs 		= fs;
    this.path 		= path;
    this.inquirer 	= inquirer;
    this.idm 		= idm;
};

setup.prototype.shouldRun = function(dir) {
    //should run if the sqlite identity db has not been defined
    return !this.fs.existsSync(this.path.join(dir, 'db.sqlite'));
};

setup.prototype.runSetup = function() {
    //no longer required as we're hooking into the existing IdP now
    return Promise.resolve();
};

module.exports = function(fs, path, inquirer, idm) {
    if (!fs) {
        fs = require('fs');
    }

    if (!path) {
        path = require('path');
    }

    if (!inquirer) {
        inquirer = require('inquirer');
    }

    if (!idm) {
        idm = require('../service.identity.idp/lib/idm');
    }

    return new setup(fs, path, inquirer, idm);
};