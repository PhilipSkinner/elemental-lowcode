const defineScope = function() {
    this.excluded = [
        "_controller"
    ];
};

defineScope.prototype.traverse = function(tags) {
    return tags.map((tag) => {
        Object.keys(tag).forEach((prop) => {
            if (this.excluded.indexOf(prop) !== -1) {
                return;
            }

            if (Array.isArray(tag[prop])) {
                tag[prop] = this.traverse(tag[prop]);
                return;
            }

            if (typeof(tag[prop]) === "object" && tag[prop] !== null) {
                tag[prop] = this.traverse([tag[prop]])[0];
                return;
            }
        });

        tag._scope = tag._scope || {};

        return tag;
    });
};

defineScope.prototype.apply = function(definition) {
    definition.view = this.traverse(definition.view);

    return Promise.resolve(definition);
};

module.exports = function() {
    return new defineScope();
};