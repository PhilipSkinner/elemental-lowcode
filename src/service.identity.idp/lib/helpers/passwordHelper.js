const passwordHelper = function() {
    this.numbers = ["0","1","2","3","4","5","6","7","8","9"];
    this.lowercase = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    this.uppercase = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
};

passwordHelper.prototype.isBannedPassword = function(banList, password) {
    if (typeof(banList) === "undefined" || banList === null || !Array.isArray(banList)) {
        return false;
    }

    return banList.indexOf(password) !== -1;
};

passwordHelper.prototype.passwordStrongEnough = function(rules, password) {
    //extract details of the password
    const details = {
        length : password.length,
        lowercase : 0,
        uppercase : 0,
        numeric : 0,
        symbol : 0
    };

    password.split("").forEach((char) => {
        if (this.numbers.indexOf(char) !== -1) {
            details.numeric++;
        } else if (this.lowercase.indexOf(char) !== -1) {
            details.lowercase++;
        } else if (this.uppercase.indexOf(char) !== -1) {
            details.uppercase++;
        } else {
            details.symbol++;
        }
    });

    //check the length
    if (details.length > rules.max_length) {
        return false;
    }

    if (details.length < rules.min_length) {
        return false;
    }

    //check the alpha
    if (details.lowercase + details.uppercase < rules.rules.alpha) {
        return false;
    }

    //check the numeric
    if (details.numeric < rules.rules.numeric) {
        return false;
    }

    //symbols
    if (details.symbol < rules.rules.symbols) {
        return false;
    }

    //mixed case required?
    if (rules.rules.mixed_case && (details.lowercase === 0 || details.uppercase === 0)) {
        return false;
    }

    //check our validation regex
    const re = new RegExp(rules.validation_regex);
    return re.test(password);
};

module.exports = function() {
    return new passwordHelper();
};