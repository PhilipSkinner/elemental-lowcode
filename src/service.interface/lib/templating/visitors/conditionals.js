const conditionals = function() {
    this.ignoredProps = [
        '_scope',
        '_controller'
    ];
};

conditionals.prototype.evaluate = function(ifStatement) {
    var valid = null;

    if (!Array.isArray(ifStatement)) {
        ifStatement = [ifStatement];
    }

    if (ifStatement.length === 0) {
        return true;
    }

    for (var i = 0; i < ifStatement.length; i++) {
        var statement = ifStatement[i];

        //evaluate the statement
        var result = false;
        try {
            result = eval(statement.statement);
        } catch(e) {
            //console.log("Error evaluating statement", statement, e);
        }

        //now set our validity
        if (statement.logicalOperator === 'and') {
            if (valid === null) {
                valid = true;
            }

            valid = valid && result;
        } else if (statement.logicalOperator === 'or') {
            if (valid === null) {
                valid = false;
            }

            valid = valid || result;
        }
    }

    if (!valid) {
        return false;
    }

    return true;
};

conditionals.prototype.restrict = function(view) {
    return view.map((tag) => {
        if (Array.isArray(tag)) {
            return this.restrict(tag);
        }

        if (tag.if) {
            if (!this.evaluate(tag.if)) {
                tag.__display = false;
            }
        }

        Object.keys(tag).forEach((prop) => {
            if (this.ignoredProps.indexOf(prop) !== -1) {
                return;
            }

            if (Array.isArray(tag[prop])) {
                tag[prop] = this.restrict(tag[prop]);
                return;
            }

            if (typeof(tag[prop]) === 'object' && tag[prop] !== null) {
                tag[prop] = this.restrict([tag[prop]])[0];
                return;
            }
        });

        return tag;
    });
};

conditionals.prototype.apply = function(definition) {
    definition.view = this.restrict(definition.view);

    return Promise.resolve(definition);
};

module.exports = function() {
    return new conditionals();
};