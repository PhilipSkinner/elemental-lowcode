const bindValues = function() {
    this.ignored = [
        "_scope",
        "_controller"
    ];
};

bindValues.prototype.bindValues = function(view) {
    return view.map((tag) => {
        if (Array.isArray(tag)) {
            return this.bindValues(tag);
        }

        //check every property to see if we need to bind again
        Object.keys(tag).forEach((prop) => {
            if (this.ignored.indexOf(prop) === -1) {
                if (Array.isArray(tag[prop])) {
                    tag[prop] = this.bindValues(tag[prop]);
                }

                if (typeof(tag[prop]) === "object" && tag[prop] !== null) {
                    tag[prop] = this.bindValues([tag[prop]])[0];
                }
            }
        });

        //and finally if we have a bind value
        if (tag.bind) {
            //only specify these if the user hasn"t already
            if (!tag.value) {
                tag.value = tag.bind + "";
            }

            if (tag.tag === "textarea") {
                //special case, set to text
                tag.text = tag.value;
            }

            if (!tag.name) {
                tag.name = tag.bind.replace("$.", "").split(".").join("$$_$$");
            }
        }

        return tag;
    });
};

bindValues.prototype.apply = function(definition) {
    definition.view = this.bindValues(definition.view);

    return Promise.resolve(definition);
};

module.exports = function() {
    return new bindValues();
};