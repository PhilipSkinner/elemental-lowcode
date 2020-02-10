const configProvider = function(glob, path, fs) {
	this.glob = glob;
	this.path = path;
	this.fs = fs;
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

		console.log(config.clients);
		return Promise.resolve(config);
	});
};

module.exports = function(glob, path, fs) {
	if (!glob) {
		glob = require('glob');
	}

	if (!path) {
		path = require('path');
	}

	if (!fs) {
		fs = require('fs');
	}

	return new configProvider(glob, path, fs);
};