const setup = function(fs, path, inquirer, idm) {
	this.fs 		= fs;
	this.path 		= path;
	this.inquirer 	= inquirer;
	this.idm 		= idm;
};

setup.prototype.shouldRun = function(dir) {
	//should run if the sqlite identity db has not been defined
	return !this.fs.existsSync(this.path.join(dir, "db.sqlite"));
};

setup.prototype.runSetup = function(dir) {
	return this.inquirer.prompt([
		{
			type : "input",
			name : "username",
			message : "Enter a username for your admin account:"
		},
		{
			type : "input",
			name : "password",
			message : "Password for this account:"
		}
	]).then((answers) => {
		process.env.DIR = dir;
		const idmInstance = this.idm();
		return new Promise((resolve, reject) => {
			return idmInstance.createUser({
				body : {
					username : answers.username,
					password : answers.password,
					claims : {
						roles : [
							"system_admin"
						]
					}
				}
			}, {
				status : () => {},
				send : () => {},
				setHeader : () => {}
			}, () => {
				return resolve();
			});
		});
	}).then(() => {
		console.log("Your administrative account has been setup, use this to login to the admin interface.");
	}).catch((err) => {
		console.log("There was an error setting up your administrative account.");
		throw err;
	});
};

module.exports = function(fs, path, inquirer, idm) {
	if (!fs) {
		fs = require("fs");
	}

	if (!path) {
		path = require("path");
	}

	if (!inquirer) {
		inquirer = require("inquirer");
	}

	if (!idm) {
		idm = require("../identity/lib/idm");
	}

	return new setup(fs, path, inquirer, idm);
};