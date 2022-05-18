const totpHelper = function(totpGenerator) {
    this.totpGenerator = totpGenerator;
};

totpHelper.prototype.generateTotp = function(string, settings) {
    return this.totpGenerator.gen(string, settings);
};

totpHelper.prototype.verifyTotp = function(string, code, settings) {
    return this.totpGenerator.verify(code, string, settings);
};

module.exports = function(totpGenerator) {
    if (!totpGenerator) {
        totpGenerator = require('notp').totp;
    }

    return new totpHelper(totpGenerator);
};