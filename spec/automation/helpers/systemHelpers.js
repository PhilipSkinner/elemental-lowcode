const
	childProcess 	= require("child_process"),
	request 		= require("request"),
	fs				= require("fs-extra"),
	path 			= require("path");

let currentProcess = null;
let token = null;

module.exports = {
	init : function() {
		return new Promise((resolve, reject) => {
			//delete the storage
			fs.removeSync(path.join(__dirname, "../../../kernel/.store"));
			fs.removeSync(path.join(__dirname, "../../../kernel/recordings.db"));

			currentProcess = childProcess.spawn("node", [
				"main.js",
				"--sources=../spec/automation/sources"
			], {
				cwd 	: path.join(__dirname, "../../../kernel")
			});

			currentProcess.stderr.on("data", (data) => {
				console.log(data.toString("utf8"));
			});

			setTimeout(() => {
				this.generateToken().then((_token) => {
					token = _token;
					resolve();
				});
			}, 3000);
		});
	},
	terminate : function() {
		return new Promise((resolve, reject) => {
			currentProcess.kill("SIGINT");

			setTimeout(resolve, 500);
		});
	},
	getToken : function() {
		return token;
	},
	generateToken : function() {
		return new Promise((resolve, reject) => {
			request.post(`http://localhost:8008/token`, {
				form : {
					grant_type 		: "client_credentials",
					scope 			: "roles",
					client_id 		: "test",
					client_secret 	: "test"
				}
			}, (err, response, body) => {
				if (err) {
					console.log(err);
					return reject(new Error("Error fetching client token"));
				}

				let data = null;
				try {
					data = JSON.parse(body);
				} catch(e) {
					return reject(new Error("Error parsing token response"));
				}

				if (data && data.access_token) {
					return resolve(data.access_token);
				}

				return resolve("");
			});
		});
	}
};