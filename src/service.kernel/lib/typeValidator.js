const typeValidator = function(fs, path, ajv) {
    this.fs 	= fs;
    this.path 	= path;
    this.ajv 	= ajv;
};

typeValidator.prototype.getTypeDefinition = function(typeName) {
    return new Promise((resolve, reject) => {
        return this.fs.readFile(this.path.join(__dirname, `../types/${typeName}.json`), (err, data) => {
            if (err) {
                return reject(err);
            }

            let schema = null;
            try {
                schema = JSON.parse(data.toString('utf8'));
            } catch(e) {
                return reject(new Error(`Could not read schema for ${typeName}`));
            }

            return resolve(schema);
        });
    });
};

typeValidator.prototype.validate = function(typeName, object) {
    return this.getTypeDefinition(typeName).then((definition) => {
        let validator = this.ajv.compile(definition);

        if (!validator(object)) {
            return Promise.reject(validator.errors);
        }

        return Promise.resolve();
    });
};

module.exports = function(fs, path, ajv) {
    if (!fs) {
        fs = require('fs');
    }

    if (!path) {
        path = require('path');
    }

    if (!ajv) {
        ajv = require('ajv')({
            allErrors : true
        });
    }

    return new typeValidator(fs, path, ajv);
};