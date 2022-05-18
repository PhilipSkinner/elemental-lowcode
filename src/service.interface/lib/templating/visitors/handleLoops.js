const handleLoops = function(dataResolver) {
    this.dataResolver = dataResolver;
    this.modified = false;
};

handleLoops.prototype.expandNext = function(view, data) {
    this.modified = false;
    view = view.map((tag) => {
        if (typeof(tag) !== 'object' || tag === null) {
            return tag;
        }

        if (Array.isArray(tag)) {
            return this.expand(tag, data);
        }

        if (tag.repeat) {
            //we are going to repeat this tag, get our enumeration
            var parts = tag.repeat.split(' ');
            var arr = this.dataResolver.resolveValue(parts[2], data || {}, tag._scope ? tag._scope.data : {});
            var dataPropName = parts[0].replace('$.', '');

            if (typeof(arr) === 'string' && arr !== parts[2] && arr !== '') {
                parts[2] = arr;
                tag.repeat = parts.join(' ');
                this.modified = true;
                return tag;
            }

            if (typeof(arr) === 'number') {
                //generate the array
                let newArr = [];
                for (var i = 0; i < arr; i++) {
                    newArr.push(i+1);
                }
                arr = newArr;
            }

            //ok, for each child decorate it with our new scoped data and then copy
            let controllerInstances = {};
            var base = JSON.stringify(tag, function(key, value) {
                if (key === '_controller') {
                    let instanceId = Math.random() + '';
                    controllerInstances[instanceId] = value;
                    return instanceId;
                }

                return value;
            });
            var generated = [];

            if (Array.isArray(arr)) {
                generated = arr.map((item, index) => {
                    var copy = JSON.parse(base, function(key, value) {
                        if (key === '_controller') {
                            return controllerInstances[value];
                        }

                        return value;
                    });

                    //delete the repeat
                    delete(copy.repeat);

                    //set our scoped data
                    copy._scope = copy._scope || {};
                    copy._scope.data = copy._scope.data || {};
                    var itemData = {};
                    itemData[dataPropName] = item;
                    copy._scope.data = Object.assign(copy._scope ? copy._scope.data : {}, itemData);
                    copy._scope.data._index = index;

                    return copy;
                });

                this.modified = true;
            }

            //return our generated items
            if (this.modified) {
                return generated;
            }
        }

        //if we got this far, there was no repeating group
        Object.keys(tag).forEach((prop) => {
            if (Array.isArray(tag[prop])) {
                tag[prop] = this.expand(tag[prop], Object.assign(data, tag._scope ? tag._scope.data : {}));
                return;
            }
        });

        return tag;
    });

    return view;
};

function refReplacer() {
    let m = new Map(), v= new Map(), init = null;

    return function(field, value) {
        let p= m.get(this) + (Array.isArray(this) ? `[${field}]` : '.' + field);
        let isComplex= value===Object(value);

        if (isComplex) m.set(value, p);

        let pp = v.get(value)||'';
        let path = p.replace(/undefined\.\.?/,'');
        let val = pp ? `#REF:${pp[0]=='[' ? '$':'$.'}${pp}` : value;

        !init ? (init=value) : (val===init ? val='#REF:$' : 0);
        if(!pp && isComplex) v.set(value, path);

        return val;
    };
}

handleLoops.prototype.expand = function(view, data) {
    this.modified = true;
    let localData = JSON.parse(JSON.stringify(data, refReplacer()));
    while (this.modified) {
        view = this.expandNext(view, localData);
    }

    return view;
};

handleLoops.prototype.apply = function(definition) {
    definition.view = this.expand(definition.view, definition.data);

    return Promise.resolve(definition);
};

handleLoops.prototype.applySync = function(definition) {
    definition.view = this.expand(definition.view, definition.data);

    return definition;
};

module.exports = function(dataResolver) {
    if (!dataResolver) {
        dataResolver = require('../../../../support.lib/dataResolver')();
    }

    return new handleLoops(dataResolver);
};