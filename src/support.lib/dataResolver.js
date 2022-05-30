const dataResolver = function(stringFormat, environmentService) {
    this.stringFormat = stringFormat;
    this.environmentService = environmentService;
};

dataResolver.prototype.detectValues = function(string, data, scope, replaceUndefined) {
    if (!string || !string.indexOf || (string.indexOf("$.") === -1 && string.indexOf("$(") === -1)) {
        return string;
    }

    const regex = /(?:\$\.[\w.]+)/gm;
    let m;
    //scoped data takes precedence
    let scopedData = Object.assign(scope, data);

    let replacements = [];

    while ((m = regex.exec(string)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match) => {
            let matchingValues = [];
            for (let i = 3; i < match.length + 1; i++) {
                let slicedString = match.slice(0, i);
                var rep = this.resolveValue(slicedString, scopedData, replaceUndefined);

                if (typeof(rep) === "boolean") {
                    rep = rep.toString();
                }

                if (rep === null) {
                    rep = "";
                }

                if (typeof(rep) !== "undefined" && rep !== slicedString) {
                    matchingValues.push({
                        val: slicedString,
                        rep: rep
                    });
                }
                if (i == match.length) {
                    if (matchingValues.length != 0) {
                        replacements.push(matchingValues.pop());
                    } else if (replaceUndefined) {
                        replacements.push({ val: slicedString, rep: "" });
                    }
                }
            }
        });
    }

    replacements.forEach((r) => {
        if (typeof(r.rep) === "object") {
            string = r.rep;
        } else {
            string = string.replace(r.val, r.rep);
        }
    });

    //now detect functions
    const funcRegex = /(?:\$\(.*\)(?!\)))/gm;
    replacements = [];

    while ((m = funcRegex.exec(string)) !== null) {
        if (m.index === funcRegex.lastIndex) {
            funcRegex.lastIndex++;
        }

        m.forEach((match) => {
            var rep = this.resolveFunction(match, scopedData);

            replacements.push({
                val : match,
                rep : rep
            });
        });
    }

    replacements.forEach((r) => {
        if (typeof(r.rep) === "object") {
            string = r.rep;
        } else {
            string = string.replace(r.val, r.rep);
        }
    });

    return string;
};

dataResolver.prototype.resolveFunction = function(fn, data) {
    //does it have unresolved values?
    if (fn.indexOf("$.") !== -1) {
        return fn;
    }

    //allow access to the string formatter
    const stringFormat = this.stringFormat; // eslint-disable-line no-unused-vars

    //evaluate and return the value
    let evalStatement = fn.slice(2).slice(0, -1);

    //does it contain another function?
    if (evalStatement.indexOf("$(") !== -1) {
        //we need to evaluate the inner statement first
        evalStatement = this.detectValues(evalStatement, data, {}, false);
    }

    try {
        return eval(evalStatement);
    } catch(e) {
        console.error(evalStatement, e);
    }

    return "";
};

dataResolver.prototype.resolveValue = function(path, data, replaceUndefined) {
    let current = Object.assign({
        env : this.environmentService.listEnvironmentVariables()
    }, data);
    let parts = path.replace("$.", "").split(".");

    parts.forEach((p) => {
        if (current) {
            current = current[p];
        }
    });

    if (typeof(current) === "undefined" && !replaceUndefined) {
        return path;
    }

    if (replaceUndefined && typeof(current) === "undefined") {
        return "";
    }

    return current;
};

module.exports = function(stringFormat, environmentService) {
    if (!stringFormat) {
        stringFormat = require("elemental-string-format");
    }

    if (!environmentService) {
        environmentService = require("./environmentService")();
    }

    return new dataResolver(stringFormat, environmentService);
};