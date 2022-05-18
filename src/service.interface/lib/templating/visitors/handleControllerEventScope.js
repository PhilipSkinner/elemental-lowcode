const handleControllerEventScope = function() {
    this.eventTypes = [
        'onclick',
        'submit'
    ];

    this.ignored = [
        '_scope',
        '_controller'
    ];
};

handleControllerEventScope.prototype.expand = function(view, data) {
    let ourView = view;

    if (!Array.isArray(ourView)) {
        ourView = [view];
    }

    ourView.forEach((tag) => {
        if (typeof(tag) === 'object' && tag !== null) {
            //do we have some events?
            this.eventTypes.forEach((event) => {
                if (typeof(tag[event]) === 'object' && tag[event] !== null && data._controller) {
                    tag[event].params = tag[event].params || {};
                    tag[event].params._identifier = data._controller.identifier;
                }
            });

            Object.keys(tag).forEach((k) => {
                if (this.ignored.indexOf(k) === -1) {
                    this.expand(tag[k], data);
                }
            });
        }
    });

    return ourView;
};

handleControllerEventScope.prototype.apply = function(definition) {
    definition.view = this.expand(definition.view, definition.data);

    return Promise.resolve(definition);
};

handleControllerEventScope.prototype.applySync = function(definition) {
    definition.view = this.expand(definition.view, definition.data);

    return definition;
};

module.exports = function() {
    return new handleControllerEventScope();
};