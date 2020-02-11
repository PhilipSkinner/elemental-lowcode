const certProvider = function(crypto, fs, path) {
	this.crypto = crypto;
	this.fs = fs;
	this.path = path;
};

certProvider.prototype._generateKeypair = function() {
	return this.crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: 'spki',
			format: 'pem'
		},
		privateKeyEncoding: {
			type: 'pkcs8',
			format: 'pem'
		}
	});
};

certProvider.prototype._fetchSigningKeypair = function() {
	let ret = {
		privateKey : null,
		publicKey : null
	};

	try {
		ret.privateKey = this.fs.readFileSync(this.path.join(process.cwd(), 'signing-private.key')).toString('utf8');
	} catch(e) {}

	try {
		ret.publicKey = this.fs.readFileSync(this.path.join(process.cwd(), 'signing-public.key')).toString('utf8');
	} catch(e) {}

	if (ret.privateKey === null || ret.publicKey === null) {
		ret = this._generateKeypair();

		//and persist
		this.fs.writeFileSync(this.path.join(process.cwd(), 'signing-private.key'), ret.privateKey);
		this.fs.writeFileSync(this.path.join(process.cwd(), 'signing-public.key'), ret.publicKey);
	}	

	return ret;
};

certProvider.prototype.fetchPulicSigningKey = function() {
	return this._fetchSigningKeypair().publicKey;
};

certProvider.prototype.fetchPrivateSigningKey = function() {
	return this._fetchSigningKeypair().privateKey;
};

module.exports = function(crypto, fs, path) {
	if (!crypto) {
		crypto = require('crypto');
	}

	if (!fs) {
		fs = require('fs');
	}

	if (!path) {
		path = require('path');
	}

	return new certProvider(crypto, fs, path);
};