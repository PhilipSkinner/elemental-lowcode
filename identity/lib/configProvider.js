const configProvider = function(glob, path, fs, jose) {
	this.glob = glob;
	this.path = path;
	this.fs = fs;
	this.jose = jose;
};

configProvider.prototype.getClients = function(dir) {
	return new Promise((resolve, reject) => {
		this.glob(this.path.join(dir, '**/*.client.json'), (files) => {
			const allConfig = [];

			const doNext = () => {
				return new Promise((res, rej) => {
					if (files.length === 0) {
						return res();
					}

					const clientFile = files.pop();

					this.fs.readFile(clientFile, (err, data) => {
						if (err) {
							return rej(err);
						}

						let config = null;
						try {
							config = JSON.parse(data.toString('utf8'));
						} catch(e) {}

						if (config === null) {
							return rej(new Error(`Cannot read client config ${clientFile}`));
						}

						return res(config);
					});
				}).then((config) => {
					allConfig.push(config);
					return doNext();
				});
			};

			if (typeof(files) === 'undefined' || files === null) {
				return resolve(allConfig);
			}

			return doNext().then(resolve).catch(reject);
		});
	});
};

configProvider.prototype.generateAdminClient = function(secret) {
	return Promise.resolve({
		client_id : 'elemental_admin',
		client_secret : secret,
		redirect_uris : [
			'http://localhost:8002/auth'
		]
	});
};

configProvider.prototype.addJwks = function() {
	return new Promise((resolve, reject) => {
		//const keystore = this.jose.JWK.createKeyStore();

		//keystore.add(process.env.SIG, "pem").then(function(result) {
	    //	return resolve(result.toJSON(true));
		//});

		const keystore = new this.jose.JWKS.KeyStore();

		keystore.add(this.jose.JWK.asKey({
			key : process.env.SIG,
			format : 'pem',
			type : 'pkcs8'
		}));

		return resolve(keystore.toJWKS(true));
	});
};

configProvider.prototype.fetchConfig = function(dir, secret) {
	const config = {
		formats: {
    		AccessToken		: 'jwt',
    		IdentityToken 	: 'jwt'
  		}
	};

	return this.getClients(dir).then((clients) => {
		config.clients = clients;
		return this.generateAdminClient(secret);
	}).then((adminClient) => {
		config.clients.push(adminClient);
		return this.addJwks();
	}).then((jwks) => {
		console.log(jwks);
		config.jwks = jwks;
		return Promise.resolve(config);
	});
};

module.exports = function(glob, path, fs, jose) {
	if (!glob) {
		glob = require('glob');
	}

	if (!path) {
		path = require('path');
	}

	if (!fs) {
		fs = require('fs');
	}

	if (!jose) {
		jose = require('jose');
	}

	return new configProvider(glob, path, fs, jose);
};