const secrets = function(configDir, storeDir, fileLister, path) {
	this.configDir 	= configDir;
	this.storeDir 	= storeDir;
	this.fileLister = fileLister;
	this.path 		= path;
};

secrets.prototype._listSecrets = function() {
	return this.fileLister.executeGlob(this.path.join(this.configDir, "**/*.secret.json")).then((results) => {
		return Promise.all(results.map((r) => {
			return this.fileLister.readJSONFile(this.configDir, r.basename);
		}));
	}).then((secrets) => {
		return Promise.all((secrets.map((s) => {
			return this.fileLister.readJSONFile(this.storeDir, `${s.name}.secret.json`).then((value) => {
				s.value = value.value;
				return Promise.resolve(s);
			}).catch((err) => {
				return Promise.resolve({});
			});
		})));
	});
};

secrets.prototype.initSecrets = function(clientSecret, keys) {
	const ret = {
		admin : {
			SECRET : clientSecret,
			SIG 	: keys.public
		},
		api : {
			SIG 	: keys.public
		},
		integration : {
			SIG 	: keys.public
		},
		website : {
			SIG 	: keys.public
		},
		data : {
			SIG 	: keys.public
		},
		rules : {
			SIG 	: keys.public
		},
		identity : {
			SECRET 		: clientSecret,
			SIG			: keys.private,
			SIG_PUBLIC  : keys.public,
			DEBUG 		: "oidc-provider:*"
		},
		queues : {
			SIG 	: keys.public
		}
	};

	return this._listSecrets().then((secrets) => {
		secrets.forEach((s) => {
			if (typeof(s) !== "undefined" && s !== null && typeof(s.scope) !== "undefined" && s.scope !== null && typeof(s.value) !== "undefined" && s.value !== null) {
				//generate our elemental env name
				const envName = `ELEMENTAL__ENV__${s.name}`;

				if (s.scope === "global") {
					Object.keys(ret).forEach((system) => {
						ret[system][envName] = s.value;
					});
				} else {
					const p = s.scope.split(":");
					ret[p[1]][envName] = s.value;
				}
			}
		});

		return Promise.resolve(ret);
	});
};

module.exports = function(configDir, storeDir, fileLister, path) {
	if (!fileLister) {
		fileLister = require('./fileLister')();
	}

	if (!path) {
		path = require("path");
	}

	return new secrets(configDir, storeDir, fileLister, path);
};