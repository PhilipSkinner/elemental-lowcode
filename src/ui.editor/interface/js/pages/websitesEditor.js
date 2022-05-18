const _websitesEditorController = function(page) {
    this._page                      = page;
    this.website                    = {};
    this.clients                    = [];
    this.routes                     = [];
    this.tags                       = [];
    this.mainVisible                = true;
    this.viewEditorVisible          = false;
    this.controllerEditorVisible    = false;
    this.newResourceVisible         = false;
    this.sourceMode                 = false;
    this.resources                  = {};
    this.staticfiles                = [];
    this.tagsets                    = {};
    this.filteredTagsets            = {};
    this.activeView                 = {};
    this.loadedTagsets              = {};
    this.activeDefinition           = {};
    this.activeProperties           = {};
    this.uniqueTags                 = {};
    this.loadedProperties           = {};
    this.propertyGroups             = {};
    this.tagSelected                = false;
    this.editor                     = null;
    this.activeRoute                = null;
    this.activeErrorHandler         = null;
    this.tagSearchTerms             = '';
    this.mainNavItems               = [
        {
            name        : 'Config',
            event       : this.showConfig.bind(this),
            selected    : true
        },
        {
            name        : 'Routes',
            event       : this.showRoutes.bind(this),
            selected    : false
        },
        {
            name        : 'Tags',
            event       : this.showTags.bind(this),
            selected    : false
        },
        {
            name        : 'Resources',
            event       : this.showResources.bind(this),
            selected    : false
        },
        {
            name        : 'Errors',
            event       : this.showErrors.bind(this),
            selected    : false
        },
        {
            name        : 'View',
            event       : this.viewWebsite.bind(this),
            selected    : false
        }
    ];
    this.editorNavItems = [
        {
            name        : 'Interface',
            event       : this.showViewEditor.bind(this),
            selected    : true
        },
        {
            name        : 'Source',
            event       : this.showViewSource.bind(this),
            selected    : false
        },
        {
            name        : 'Controller',
            event       : this.showControllerEditor.bind(this),
            selected    : false
        },
        {
            name        : 'View',
            event       : this.viewRoute.bind(this),
            selected    : false,
            visible     : this.isRouteSelected.bind(this)
        },
        {
            name        : 'Handles',
            event       : this.viewHandles.bind(this),
            selected    : false,
            visible     : this.isHandlerSelected.bind(this)
        }
    ];
};

/* navigation */
_websitesEditorController.prototype.isRouteSelected = function() {
    return this.activeRoute.route;
};

_websitesEditorController.prototype.isHandlerSelected = function() {
    return this.activeRoute.handles;
};

_websitesEditorController.prototype._resetNavState = function() {
    this.mainNavItems.forEach((i) => {
        i.selected = false;
    });
};

_websitesEditorController.prototype.showConfig = function() {
    this._resetNavState();
    this.mainNavItems[0].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.showRoutes = function() {
    this._resetNavState();
    this.mainNavItems[1].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.showTags = function() {
    this._resetNavState();
    this.mainNavItems[2].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.showResources = function() {
    this._resetNavState();
    this.mainNavItems[3].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.showErrors = function() {
    this._resetNavState();
    this.mainNavItems[4].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.viewWebsite = function() {
    window.open(`${window.hosts.interface}/${this.website.name}/`, '_blank');
};

_websitesEditorController.prototype._resetEditorNavState = function() {
    if (this.activeResource) {
        //get our active state!
        if (this.controllerEditorVisible) {
            this.resources[this.activeResource] = this.editor.getValue();
        } else if (this.editorNavItems[0].selected) {
            this.resources[this.activeResource] = this.getConfigFromEditor();
        } else if (this.sourceMode) {
            this.resources[this.activeResource] = this.editor.getValue();
        }
    }

    this.editorNavItems.forEach((i) => {
        i.selected = false;
    });
};

_websitesEditorController.prototype.showControllerEditor = function() {
    this._resetEditorNavState();
    if (this.activeRoute) {
        this.editController(this.activeRoute.controller);
    }
    this.editorNavItems[2].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.showViewEditor = function() {
    this._resetEditorNavState();
    if (this.activeRoute) {
        this.editView(this.activeRoute.view);
    }
    this.showEditor();
    this.editorNavItems[0].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.showViewSource = function() {
    this._resetEditorNavState();
    if (this.activeRoute) {
        this.editView(this.activeRoute.view, true);
    }
    this.showSource();
    this.editorNavItems[1].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.viewHandles = function() {
    this._resetEditorNavState();
    this.editorNavItems[4].selected = true;
    this.refreshState();
};

_websitesEditorController.prototype.viewRoute = function() {
    if (this.activeRoute && this.activeRoute.route) {
        window.open(`${window.hosts.interface}/${this.website.name}${this.activeRoute.route}`, '_blank');
    }
};

_websitesEditorController.prototype.resetPopupFlags = function() {
    this.caller.deleteStaticConfirmVisible = false;
    this.caller.deleteTagConfirmVisible = false;
    this.caller.deleteRouteConfirmVisible = false;
    this.caller.deleteErrorHandlerConfirmVisible = false;
}

/* end navigation */

_websitesEditorController.prototype.wipeData = function() {
    this.website                    = {};
    this.routes                     = [];
    this.tags                       = [];
    this.resources                  = {};
    this.staticfiles                = [];
    this.errorhandlers              = [];
    this.mainVisible                = true;
    this.viewEditorVisible          = false;
    this.controllerEditorVisible    = false;
    this.newResourceVisible         = false;
    this.sourceMode                 = false;
    this.activeProperties           = {};
    this.activeDefinition           = {};
    this.propertyGroups             = {};
    this.loadedTagsets              = {};
    this.uniqueTags                 = {};
    this.loadedProperties           = {};
    this.tagSelected                = false;
    this.tagsets                    = {};
    this.filteredTagsets            = {};
    this.tagSearchTerms             = '';
    this._resetNavState();
    this._resetEditorNavState();
    this.mainNavItems[0].selected = true;
    this.editorNavItems[0].selected = true;
};

_websitesEditorController.prototype.filterTags = function(event) {
    //get the keywords
    _websitesEditorControllerInstance.tagSearchTerms = event.target.value;

    //refresh
    _websitesEditorControllerInstance.refreshState();
};

_websitesEditorController.prototype._filteredTagsets = function() {
    if (this.tagSearchTerms.replace(/ /g, '') === '') {
        return this.tagsets;
    }

    var filteredTagsets = {};
    var terms = this.tagSearchTerms.toLowerCase();
    Object.keys(this.tagsets).forEach((setName) => {
        let tags = this.tagsets[setName].tags;

        tags.forEach((tag) => {
            if (
                tag.tag.toLowerCase().indexOf(terms) !== -1
                || tag.name.toLowerCase().indexOf(terms) !== -1
            ) {
                if (!filteredTagsets[setName]) {
                    filteredTagsets[setName] = {
                        tags : [],
                        name : setName
                    };
                }

                filteredTagsets[setName].tags.push(tag);
            }
        });
    });

    return filteredTagsets;
};

_websitesEditorController.prototype.generateNavItems = function() {
    return this.mainNavItems.map((item) => {
        return item;
    });
};

_websitesEditorController.prototype.generateEditorNavItems = function() {
    return this.editorNavItems.map((item) => {
        return item;
    });
};

_websitesEditorController.prototype.getData = function() {
    return {
        website                             : this.website,
        routes                              : this.routes,
        clients                             : this.clients,
        tags                                : this.tags,
        mainVisible                         : this.mainVisible,
        viewEditorVisible                   : this.viewEditorVisible,
        controllerEditorVisible             : this.controllerEditorVisible,
        newResourceVisible                  : this.newResourceVisible,
        showAlert                           : false,
        sourceMode                          : this.sourceMode,
        staticfiles                         : this.staticfiles,
        tagsets                             : this.tagsets,
        filteredTagsets                     : this._filteredTagsets(),
        activeView                          : this.activeView,
        activeProperties                    : this.activeProperties,
        allProperties                       : this.propertyGroups,
        tagSelected                         : this.tagSelected,
        activeDefinition                    : this.activeDefinition,
        deleteRouteConfirmVisible           : false,
        confirmRouteDeleteAction            : () => {},
        deleteTagConfirmVisible             : false,
        confirmTagDeleteAction              : () => {},
        deleteStaticConfirmVisible          : false,
        confirmStaticDeleteAction           : () => {},
        deleteErrorHandlerConfirmVisible    : false,
        confirmErrorHandlerDeleteAction     : () => {},
        mainNavItems                        : this.generateNavItems(),
        editorNavItems                      : this.generateEditorNavItems(),
        tagSearchTerms                      : this.tagSearchTerms,
        activeRoute                         : this.activeRoute,
        errorCodes                          : [
            {
                code : 400,
                error : 'Bad Request'
            },
            {
                code : 401,
                error : 'Unauthorized'
            },
            {
                code : 402,
                error : 'Payment Required'
            },
            {
                code : 403,
                error : 'Forbidden'
            },
            {
                code : 404,
                error : 'Not Found'
            },
            {
                code : 405,
                error : 'Method Not Allowed'
            },
            {
                code : 406,
                error : 'Not Acceptable'
            },
            {
                code : 408,
                error : 'Request Timeout'
            },
            {
                code : 409,
                error : 'Conflict'
            },
            {
                code : 411,
                error : 'Length Required'
            },
            {
                code : 412,
                error : 'Precondition Failed'
            },
            {
                code : 413,
                error : 'Payload Too Large'
            },
            {
                code : 414,
                error : 'URI Too Long'
            },
            {
                code : 415,
                error : 'Unsupported Media Type'
            },
            {
                code : 417,
                error : 'Expectation Failed'
            },
            {
                code : 422,
                error : 'Unprocessable Entity'
            },
            {
                code : 429,
                error : 'Too Many Requests'
            },
            {
                code : 431,
                error : 'Request Header Fields Too Large'
            },
            {
                code : 500,
                error : 'Internal Server Error'
            },
            {
                code : 501,
                error : 'Not Implemented'
            },
            {
                code : 505,
                error : 'HTTP Version Not Supported'
            }
        ]
    };
};

_websitesEditorController.prototype.autoProvisionClient = function() {
    //ensure we get the name from the form value
    this.website.name = this.caller.website.name;

    if (!this.website.name) {
        return;
    }

    //generate a default client
    const client = {
        'client_id': `interface-${this.website.name}-client`,
        'client_secret': `${window.generateGuid().split('-').reverse().join('')}${window.generateGuid().split('-').reverse().join('')}${window.generateGuid().split('-').reverse().join('')}`,
        'scope': 'openid roles offline_access',
        'grants' : [
            'client_credentials',
            'authorization_code',
            'refresh_token'
        ],
        'redirect_uris': [
            `${window.hosts.interface}/${this.website.name}/_auth`
        ],
        'features' : {
            'registration' : {
                'enabled' : false
            }
        }
    };

    //save the client and set the value
    return window.axiosProxy
        .post(`${window.hosts.kernel}/security/clients`, JSON.stringify(client), {
            headers : {
                'Content-Type' : 'application/json',
            }
        })
        .then((response) => {
            //set the client and save the website
            this.website.client_id = client.client_id;
            return this.fetchClients().then(() => {
                return this.saveAll();
            });
        }).catch((err) => {
            console.log(err);
        });
};

_websitesEditorController.prototype.initEditor = function(elem, type, value) {
    //set our editor up
    this.editor = window.ace.edit(document.getElementById(elem), {
        mode : 'ace/mode/' + type,
        selectionStyle : 'text'
    });
    this.editor.commands.addCommand({
        name : 'save',
        bindKey : {
            win: 'Ctrl-S',
            mac: 'Cmd-S'
        },
        exec : () => {
            this.saveAll();
        }
    });
    this.editor.setTheme('ace/theme/twilight');
    this.editor.setValue(value);
};

_websitesEditorController.prototype.saveResource = function(path, value) {
    return new Promise((resolve, reject) => {
        if (typeof(value) === 'object') {
            value = JSON.stringify(value, null, 4);
        }

        return window.axiosProxy
            .post(`${window.hosts.kernel}/websites/${this.website.name}/resource?path=${path}`, {
                resource : value
            })
            .then((response) => {
                return resolve();
            });
    });
};

_websitesEditorController.prototype.saveWebsite = function() {
    return new Promise((resolve, reject) => {
        //ensure we refresh our state from the caller
        this.website.name = this.caller.website.name;
        this.website.tagset = this.caller.website.tagset;
        this.website.client_id = this.caller.website.client_id;

        if (typeof(this.website.name) === 'undefined') {
            return reject(new Error('Cannot save website without name'));
        }

        //update our website routes
        this.website.routes = this.routes.reduce((s, a) => {
            s[a.route] = {
                controller  : a.controller,
                view        : a.view,
                secure      : a.secure,
                roles       : a.roles,
            };
            return s;
        }, {});

        //update our tags
        this.website.tags = this.tags;

        //update our error handlers
        this.website.errorHandlers = this.errorhandlers.reduce((s, a) => {
            s[a.name] = {
                controller  : a.controller,
                view        : a.view,
                handles     : a.handles
            };
            return s
        }, {});

        return window.axiosProxy
            .put(`${window.hosts.kernel}/websites/${this.website.name}`, this.website)
            .then((response) => {
                location.href = `/#/websites/editor/${this.website.name}`;

                return resolve();
            });
    });
};

_websitesEditorController.prototype.saveAll = function() {
    //save the website object
    return this.saveWebsite().then(() => {
        if (this.activeResource) {
            //make sure our active resource is set
            if (this.controllerEditorVisible) {
                this.resources[this.activeResource] = this.editor.getValue();
            } else if (this.editorNavItems[0].selected) {
                this.resources[this.activeResource] = this.getConfigFromEditor();
            } else if (this.sourceMode) {
                this.resources[this.activeResource] = this.editor.getValue();
            }
        }

        return Promise.all(Object.keys(this.resources).map((k) => {
            return this.saveResource(k, this.resources[k]);
        }));
    }).then(() => {
        this.showSaveMessage();
    });
};

_websitesEditorController.prototype.showEditor = function() {
    this.activeView = JSON.parse(this.resources[this.activeResource]);
    this.sourceMode = false;
    this.activeDefinition = {};
    this.activeProperties = {};
    this.refreshState();
};

_websitesEditorController.prototype.showSource = function() {
    this.sourceMode = true;
    this.activeProperties = this.caller.activeProperties;
    window.selectedTags.forEach((t) => {
        t.removeSelection();
    });
    window.selectedTags = [];
    this.tagSelected = false;
    setTimeout(() => {
        this.initEditor('viewEditor', 'json', this.resources[this.activeResource]);
        this.refreshState();
    }, 25);
};

_websitesEditorController.prototype.refreshState = function() {
    //filter our tags
    this.filteredTagsets = this._filteredTagsets();

    this.caller.website = this.website;
    this.caller.clients = this.clients;
    this.caller.routes = this.routes;
    this.caller.mainVisible = this.mainVisible && true;
    this.caller.viewEditorVisible = this.viewEditorVisible;
    this.caller.controllerEditorVisible = this.controllerEditorVisible;
    this.caller.tags = this.tags;
    this.caller.newResourceVisible = this.newResourceVisible;
    this.caller.staticfiles = this.staticfiles;
    this.caller.errorhandlers = this.errorhandlers;
    this.caller.sourceMode = this.sourceMode;
    this.caller.tagsets = this.tagsets;
    this.caller.filteredTagsets = this.filteredTagsets;
    this.caller.activeView = this.activeView;
    this.caller.activeProperties = this.activeProperties;
    this.caller.tagSelected = this.tagSelected;
    this.caller.activeDefinition = this.activeDefinition;
    this.caller.propertyGroups = this.propertyGroups;
    this.caller.mainNavItems = this.generateNavItems();
    this.caller.editorNavItems = this.generateEditorNavItems();
    this.caller.activeRoute = this.activeRoute;
    this.caller.$forceUpdate();
};

_websitesEditorController.prototype.loadResource = function(path) {
    if (this.resources[path]) {
        return Promise.resolve(this.resources[path]);
    }

    return new Promise((resolve, reject) => {
        window.axiosProxy
            .get(`${window.hosts.kernel}/websites/${this.website.name}/resource?path=${path}`)
            .then((response) => {
                this.resources[path] = response.data;

                return resolve(this.resources[path]);
            });
    });
};

_websitesEditorController.prototype.editTag = function(tag) {
    if (tag) {
        this.activeRoute = tag;
    }

    this._resetEditorNavState();
    this.editorNavItems[0].selected = true;

    this.editView(this.activeRoute.view);
};

_websitesEditorController.prototype.editRoute = function(route) {
    if (route) {
        this.activeRoute = route;
    }

    this._resetEditorNavState();
    this.editorNavItems[0].selected = true;

    this.editView(this.activeRoute.view);
};

_websitesEditorController.prototype.editView = function(viewPath, skipState) {
    this.activeResource = viewPath;
    this.loadResource(viewPath).then((resource) => {
        if (!skipState) {
            this.mainVisible = false;
            this.viewEditorVisible = true;
            this.sourceMode = false;
            this.controllerEditorVisible = false;
        }
        var rawResource = resource;

        if (typeof(resource) === 'object') {
            rawResource = JSON.stringify(resource, null, 4);
        }

        this.activeView = JSON.parse(rawResource);

        //convert our custom tags into a tagset
        return this.configureCustomTagset();
    }).then(() => {
        this.refreshState();
    });
};

_websitesEditorController.prototype.findProps = function(obj, props) {
    if (!obj) {
        return props;
    }

    if (typeof(obj) === 'string') {
        if (obj.indexOf('$.') !== -1) {
            let parts = obj.split('$.');
            parts.forEach((p) => {
                let name = p.split(' ')[0];
                if (name) {
                    props[name] = '';
                }
            });
        }

        return props;
    }

    if (Array.isArray(obj)) {
        obj.forEach((o) => {
            props = this.findProps(o, props);
        });

        return props;
    }

    if (typeof(obj) === 'object') {
        Object.keys(obj).forEach((k) => {
            props = this.findProps(obj[k], props);
        });

        return props;
    }


    return props;
};

_websitesEditorController.prototype.configureCustomTagset = function() {
    this.tagsets.Custom = {
        name : 'Custom',
        tags : []
    };

    return Promise.all(this.tags.map((t) => {
        return this.loadResource(t.view).then((resource) => {
            this.tagsets.Custom.tags.push({
                tag             : t.name,
                name            : t.name,
                properties      : this.findProps(resource, {})
            });

            this.uniqueTags[t.name] = resource;
        });
    }));
};

_websitesEditorController.prototype.editController = function(path) {
    this.activeResource = path;
    this.controllerEditorVisible = true;
    this.loadResource(path).then((resource) => {
        this.refreshState();
        setTimeout(() => {
            this.initEditor('controllerEditor', 'javascript', resource);
        }, 10);
    });
};

_websitesEditorController.prototype.mainView = function() {
    //save our active resource
    if (this.controllerEditorVisible) {
        this.resources[this.activeResource] = this.editor.getValue();
    } else if (!this.sourceMode && this.viewEditorVisible) {
        this.resources[this.activeResource] = this.getConfigFromEditor();
    } else if (this.sourceMode) {
        this.resources[this.activeResource] = this.editor.getValue();
    }

    this.activeResource = null;
    this.mainVisible = true;
    this.viewEditorVisible = false;
    this.controllerEditorVisible = false;
    this.refreshState();
};

_websitesEditorController.prototype.removeRoute = function(num) {
    this.resetPopupFlags();
    this.caller.deleteRouteConfirmVisible = true;
    this.caller.confirmRouteDeleteAction = () => {
        this.resetPopupFlags();
        return this._removeRoute(num);
    };
    this.caller.$forceUpdate();
    return;
};

_websitesEditorController.prototype._removeRoute = function(num) {
    if (this.routes.length <= 1) {
        return;
    }

    var i = 0;
    this.routes = this.routes.reduce((s, a) => {
        if (i !== num) {
            s.push(a);
        }
        i++;
        return s;
    }, []);
    this.refreshState();
};

_websitesEditorController.prototype.removeTag = function(num) {
    this.resetPopupFlags();
    this.caller.deleteTagConfirmVisible = true;
    this.caller.confirmTagDeleteAction = () => {
        this.resetPopupFlags();
        return this._removeTag(num);
    };
    this.caller.$forceUpdate();
    return;
};

_websitesEditorController.prototype._removeTag = function(num) {
    var i = 0;
    this.tags = this.tags.reduce((s, a) => {
        if (i !== num) {
            s.push(a);
        }
        i++;
        return s;
    }, []);
    this.refreshState();
};

_websitesEditorController.prototype.fetchProperties = function(name) {
    if (this.loadedProperties[name]) {
        return Promise.resolve();
    }

    return window.axiosProxy.get(`${window.hosts.kernel}/properties/${name}`).then((response) => {
        this.loadedProperties[name] = true;
        this.propertyGroups[name] = response.data;
        this.refreshState();
    });
};

_websitesEditorController.prototype.fetchTagset = function(name) {
    if (this.loadedTagsets[name]) {
        return Promise.resolve();
    }

    return window.axiosProxy.get(`${window.hosts.kernel}/tags/${name}`).then((response) => {
        this.loadedTagsets[name] = true;

        response.data.forEach((group) => {
            group.tags.forEach((t) => {
                this.uniqueTags[t.tag] = t;
            });

            if (!this.tagsets[group.name]) {
                this.tagsets[group.name] = group;
            } else {
                //add the elements
                this.tagsets[group.name].tags = this.tagsets[group.name].tags.concat(group.tags);
            }
        });

        this.refreshState();
    });
};

_websitesEditorController.prototype.fetchTagsets = function() {
    return window.axiosProxy.get(`${window.hosts.kernel}/tags`).then((response) => {
        return Promise.all(
            response.data.map((tagset) => {
                return this.fetchTagset(tagset.name);
            })
        );
    }).then(() => {
        this.refreshState();
    });
};

_websitesEditorController.prototype.fetchWebsite = function(caller, name) {
    this.caller = caller;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/websites/${name}`)
        .then((response) => {
            this.website = response.data;

            //update our routes
            this.routes = Object.keys(response.data.routes).map((r) => {
                return {
                    route       : r,
                    roles       : response.data.routes[r].roles,
                    secure      : response.data.routes[r].secure,
                    controller  : response.data.routes[r].controller,
                    view        : response.data.routes[r].view,
                };
            });

            //get our custom tags
            this.tags = response.data.tags || [];

            //get our error handlers
            this.errorhandlers = Object.keys(response.data.errorHandlers || {}).map((eh) => {
                return {
                    name        : eh,
                    controller  : response.data.errorHandlers[eh].controller,
                    view        : response.data.errorHandlers[eh].view,
                    handles     : response.data.errorHandlers[eh].handles
                };
            });

            this.refreshState();
        });
};

_websitesEditorController.prototype.fetchClients = function(caller) {
    this.caller = this.caller || caller;
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/clients`)
        .then((response) => {
            this.clients = response.data;
            this.refreshState();
            return Promise.resolve();
        });
};

_websitesEditorController.prototype.showSaveMessage = function() {
    this.caller.showAlert = true;
    this.caller.$forceUpdate();

    setTimeout(() => {
        this.caller.showAlert = false;
        this.caller.$forceUpdate();
    }, 1500);
};

_websitesEditorController.prototype.newRoute = function() {
    var name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    this.routes.push({
        route       : `/${name}`,
        view        : `./view/${name}.json`,
        controller  : `./controllers/${name}.js`,
    });

    //add our blank resources
    this.resources[`./view/${name}.json`] = JSON.stringify({
        'tag' : 'html',
        'children' : [
            {
                'tag' : 'head',
                'children' : []
            },
            {
                'tag' : 'body',
                'children' : []
            }
        ]
    }, null, 4);
    this.resources[`./controllers/${name}.js`] = [
        'module.exports = {',
        '   events : {',
        '       load : function(event) {},',
        '   }',
        '}'
    ].join('\n');
};

_websitesEditorController.prototype.newTag = function() {
    var name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    this.tags.push({
        name        : name,
        view        : `./view/${name}.json`,
        controller  : `./controllers/${name}.js`
    });

    this.resources[`./view/${name}.json`] = JSON.stringify({
        'tag' : 'div',
        'children' : [

        ]
    }, null, 4);
    this.resources[`./controllers/${name}.js`] = [
        'module.exports = {',
        '   events : {',
        '       load : function(event) {},',
        '   }',
        '}'
    ].join('\n');
};

_websitesEditorController.prototype.newStaticFile = function() {
    this.newResourceVisible = true;
    this.refreshState();
};

_websitesEditorController.prototype.closeUploader = function() {
    this.newResourceVisible = false;
    this.refreshState();
};

_websitesEditorController.prototype.uploadResource = function() {
    var formData = new FormData();
    var imagefile = document.querySelector('#file');

    return window.getBase64(imagefile.files[0]).then((file) => {
        return window.axiosProxy.post(`${window.hosts.kernel}/websites/${this.website.name}/staticfiles`, {
            file : file,
            name : imagefile.files[0].name
        }, {
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then(() => {
            this.newResourceVisible = false;
            return this.fetchStaticFiles(this.caller, this.website.name);
        });
    });
};

_websitesEditorController.prototype.fetchStaticFiles = function(caller, name) {
    this.caller = caller;
    return window.axiosProxy.get(`${window.hosts.kernel}/websites/${name}/staticfiles`).then((response) => {
        this.staticfiles = response.data;
        this.refreshState();
    });
};

_websitesEditorController.prototype.removeResource = function(filename) {
    this.resetPopupFlags();
    this.caller.deleteStaticConfirmVisible = true;
    this.caller.confirmStaticDeleteAction = () => {
        this.resetPopupFlags();
        return this._removeResource(filename);
    };
    this.caller.$forceUpdate();
    return;
};

_websitesEditorController.prototype._removeResource = function(filename) {
    return window.axiosProxy.delete(`${window.hosts.kernel}/websites/${this.website.name}/staticfiles/${filename}`).then(() => {
        return this.fetchStaticFiles(this.caller, this.website.name);
    });
};

_websitesEditorController.prototype.setDroppableConfig = function(event) {
    const groupName = event.target.attributes['data-group'].value;
    const tagName = event.target.attributes['data-tag'].value;

    let config = {};
    window._websitesEditorControllerInstance.tagsets[groupName].tags.forEach((t) => {
        if (t.name === tagName) {
            config = t;
        }
    });

    event.dataTransfer.setData('text', JSON.stringify(config));
};

_websitesEditorController.prototype.clearProperties = function() {
    this.tagSelected = false;
    this.refreshState();
};

_websitesEditorController.prototype.isExpression = function(val) {
    return typeof(val) !== 'undefined' && val !== null && !Array.isArray(val) && val.indexOf && val.indexOf('$.') !== -1;
};

_websitesEditorController.prototype.setAsExpression = function(prop) {
    this.activeProperties[prop] = '$.';
    this.refreshState();
};

_websitesEditorController.prototype.unsetAsExpression = function(prop) {
    this.activeProperties[prop] = '';
    this.refreshState();
};

_websitesEditorController.prototype.ensureArray = function(prop) {
    if (!Array.isArray(this.caller.activeProperties[prop])) {
        if (!(typeof(this.caller.activeProperties[prop]) === 'undefined' || this.caller.activeProperties[prop] === null)) {
            this.caller.activeProperties[prop] = [this.caller.activeProperties[prop]];
        } else {
            this.caller.activeProperties[prop] = [];
        }
    }

    return this.caller.activeProperties[prop];
};

_websitesEditorController.prototype.addToArray = function(prop) {
    this.activeProperties = this.caller.activeProperties;

    if (Array.isArray(this.activeProperties[prop])) {
        this.activeProperties[prop].push('');
    } else {
        if (!(typeof(this.activeProperties[prop]) === 'undefined' || this.activeProperties[prop] === null)) {
            this.activeProperties[prop] = [this.activeProperties[prop]];
        } else {
            this.activeProperties[prop] = [''];
        }
    }

    this.refreshState();
};

_websitesEditorController.prototype.setProperties = function(properties) {
    //find the tags definition
    this.activeDefinition = this.uniqueTags[properties.tag];
    this.activeProperties = properties;
    this.tagSelected = true;

    if (this.activeDefinition && this.activeDefinition.includedPropertyGroups) {
        this.activeDefinition.includedPropertyGroups.forEach((group) => {
            if (this.propertyGroups[group]) {
                Object.assign(this.activeDefinition.properties, this.propertyGroups[group]);
            }
        });
    }

    if (this.activeDefinition && this.activeDefinition.events) {
        if (this.activeDefinition.events.click) {
            this.activeProperties.onclick = this.activeProperties.onclick || {};
        }
    }

    this.activeProperties.if = this.activeProperties.if || [];

    //generate our misc properties group if required
    let includedProps = [];
    this.activeDefinition.propertyGroups = this.activeDefinition.propertyGroups || [];

    Object.keys(this.activeDefinition.propertyGroups).forEach((groupName) => {
        includedProps = includedProps.concat(this.activeDefinition.propertyGroups[groupName].properties);
    });

    let remaining = [];
    Object.keys(this.activeDefinition.properties).forEach((prop) => {
        if (includedProps.indexOf(prop) === -1) {
            remaining.push(prop);
        }
    });

    if (remaining.length > 0) {
        this.activeDefinition.propertyGroups.push({
            name : 'Other Properties',
            properties : remaining
        });
    }

    this.refreshState();
};

_websitesEditorController.prototype.getConfigFromEditor = function() {
    return JSON.stringify(this.activeView, null, 4);
};

_websitesEditorController.prototype.keyDownHandler = function(event) {
    if (event && event.ctrlKey && event.keyCode === 83) {
        window._websitesEditorControllerInstance.saveAll();

        event.preventDefault();
        event.stopPropagation();
    }
};

/*
 *  Start of error handler functions
 */

_websitesEditorController.prototype.newErrorHandler = function() {
    var name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    this.errorhandlers.push({
        name        : name,
        view        : `./view/${name}.json`,
        controller  : `./controllers/${name}.js`,
        handles     : []
    });

    //add our blank resources
    this.resources[`./view/${name}.json`] = JSON.stringify({
        'tag' : 'html',
        'children' : [
            {
                'tag' : 'head',
                'children' : []
            },
            {
                'tag' : 'body',
                'children' : []
            }
        ]
    }, null, 4);
    this.resources[`./controllers/${name}.js`] = [
        'module.exports = {',
        '   events : {',
        '       load : function(event) {},',
        '   }',
        '}'
    ].join('\n');

    this.refreshState();
};

_websitesEditorController.prototype.removeErrorHandler = function(name) {
    this.resetPopupFlags();
    this.caller.deleteErrorHandlerConfirmVisible = true;
    this.caller.confirmErrorHandlerDeleteAction = () => {
        this.resetPopupFlags();
        return this._removeErrorHandler(name);
    };
    this.caller.$forceUpdate();
    return;
};

_websitesEditorController.prototype._removeErrorHandler = function(name) {
    this.errorhandlers = this.errorhandlers.reduce((s, a) => {
        if (a.name !== name) {
            s.push(a);
        }
        return s;
    }, []);
    this.refreshState();
};

_websitesEditorController.prototype.editErrorHandler = function(handler) {
    if (handler) {
        this.activeRoute = handler;
    }

    this._resetEditorNavState();
    this.editorNavItems[0].selected = true;

    this.editView(this.activeRoute.view);
};

_websitesEditorController.prototype.addHandlerCode = function(name, code) {
    this.errorhandlers.forEach((handler) => {
        if (handler.name === name) {
            handler.handles.push(code);
        }
    });

    this.refreshState();
};

_websitesEditorController.prototype.removeHandlerCode = function(name, code) {
    this.errorhandlers.forEach((handler) => {
        if (handler.name === name) {
            const newHandles = [];

            handler.handles.forEach((c) => {
                if (c !== code) {
                    newHandles.push(c);
                }
            });

            handler.handles = newHandles;
        }
    });

    this.refreshState();
};

/*
 *  End of error handler functions
 */

window.WebsiteEditor = {
    template : '#template-websiteEditor',
    data     : () => {
        return window._websitesEditorControllerInstance.getData();
    },
    mounted  : function() {
        window._websitesEditorControllerInstance.wipeData();

        document.removeEventListener('keydown', window._websitesEditorControllerInstance.keyDownHandler);
        document.addEventListener('keydown', window._websitesEditorControllerInstance.keyDownHandler);

        if (this.$route.params.name === '.new') {
            return window._websitesEditorControllerInstance.fetchClients(this).then(() => {
                //fetch our basic tagset
                return window._websitesEditorControllerInstance.fetchTagset('basic');
            }).then(() => {
                //fetch our global properties
                return window._websitesEditorControllerInstance.fetchProperties('global');
            }).then(() => {
                //fetch our user defined tagsets
                return window._websitesEditorControllerInstance.fetchTagsets();
            });
        }

        return window._websitesEditorControllerInstance.fetchWebsite(this, this.$route.params.name).then(() => {
            return window._websitesEditorControllerInstance.fetchClients(this);
        }).then(() => {
            return window._websitesEditorControllerInstance.fetchStaticFiles(this, this.$route.params.name);
        }).then(() => {
            //fetch our basic tagset
            return window._websitesEditorControllerInstance.fetchTagset('basic');
        }).then(() => {
            //fetch our global properties
            return window._websitesEditorControllerInstance.fetchProperties('global');
        }).then(() => {
            //fetch our predefined tagset
            let tagset = window._websitesEditorControllerInstance.website.tagset;

            if (tagset) {
                return window._websitesEditorControllerInstance.fetchTagset(tagset);
            }

            return Promise.resolve();
        }).then(() => {
            //fetch our user defined tagsets
            return window._websitesEditorControllerInstance.fetchTagsets();
        });
    },
    destroyed : function() {
        document.removeEventListener('keydown', window._websitesEditorControllerInstance.keyDownHandler);
        window._websitesEditorControllerInstance.wipeData();
    }
};

window.selectedTags = [];

function resolveValue(path, data) {
    let current = data;
    let parts = path.replace('$.', '').split('.');
    parts.forEach((p) => {
        if (current) {
            current = current[p];
        }
    });

    if (typeof(current) === 'undefined') {
        return path;
    }

    return current;
}

function detectValues(string, data) {
    if (!string || !string.indexOf || string.indexOf('$.') === -1) {
        return string;
    }

    const regex = /(\$\.[\w\.]+)/gm;
    let m;
    let replacements = [];

    while ((m = regex.exec(string)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            var rep = resolveValue(match, data);

            replacements.push({
                val : match,
                rep : resolveValue(match, data)
            });
        });
    }

    replacements.forEach((r) => {
        if (typeof(r.rep) === 'object') {
            string = r.rep;
        } else {
            string = string.replace(r.val, r.rep);
        }
    });

    return string;
}

function renderTag(tag, scope, expandChildren) {
    let parts = [];
    let needsEnd = false;

    let tagName = detectValues(tag.tag, scope);

    parts.push(`<${tagName}`);

    Object.keys(tag).forEach((k) => {
        if (
            ['text', 'tag', 'onclick', 'children', 'repeat', 'submit', 'bind', '_scope', 'if'].indexOf(k) === -1
            && (['link', 'script'].indexOf(tag) === -1 && ['href', 'src'].indexOf(k) === -1)
        ) {
            let value = detectValues(tag[k], scope);

            if (!(typeof(value) === 'undefined' || value === null)) {
                if (value === true) {
                    parts.push(` ${k}="${k}" `);
                }

                if (!(value === false)) {
                    parts.push(` ${k}="${detectValues(tag[k], scope)}" `);
                }
            }
        }
    });

    if (tag.text) {
        needsEnd = true;
        parts.push('>');
        if (Array.isArray(tag.text)) {
            parts = parts.concat(tag.text.map((t) => {
                return detectValues(t, scope);
            }));
        } else {
            parts.push(detectValues(tag.text, scope));
        }
    }

    if (tag.children && expandChildren) {
        if (!needsEnd) {
            needsEnd = true;
            parts.push('>');
        }

        tag.children.forEach((child) => {
            parts.push(renderTag(child, scope));
        });
    }

    if (needsEnd || ['textarea'].indexOf(tagName) !== -1) {
        if (!needsEnd) {
            parts.push('>');
        }

        parts.push(`</${tagName}>`);
    } else {
        parts.push('/>');
    }

    return parts.join('');
}

window._websiteDragData = {};

window.Vue.component('tagsection', {
    template : '#template-tagSection',
    props : [
        'tag'
    ],
    data : function() {
        let ret = {
            droppable   : false,
            selected    : false,
            draggable   : false,
            definition  : () => {
                return window._websitesEditorControllerInstance.uniqueTags[this.$options.propsData.tag.tag] || {};
            }
        };

        ret.renderTag = ((tag) => {
            if (window._websitesEditorControllerInstance.tags.find((t) => {
                return t.name === tag.tag;
            })) {
                return renderTag(window._websitesEditorControllerInstance.uniqueTags[tag.tag], tag, true);
            }

            return renderTag(tag, {}, false);
        }).bind(ret);

        ret.removeSelection = () => {
            ret.selected = false;
        };

        ret.deleteTag = (event) => {
            window.selectedTags.forEach((t) => {
                t.removeSelection();
            });
            window.selectedTags = [];

            event.preventDefault();
            event.stopPropagation();

            //set our value to null
            let newChildren = [];
            this.$options.parent.$options.propsData.tag.children.forEach((child) => {
                if (this.$options.propsData.tag.__ob__.dep.id !== child.__ob__.dep.id) {
                    newChildren.push(child);
                }
            });
            this.$options.parent.$options.propsData.tag.children = newChildren;

            return true;
        };

        ret.setDroppableConfig = (event) => {
            if (this.$options.parent.$options.propsData) {
                const parent = this.$options.parent;
                const thisTag = this.$options.propsData;
                const depId = this.$options.propsData.tag.__ob__.dep.id;

                window._websiteDragData[depId] = {
                    parent  : parent,
                    thisTag : thisTag
                };

                event.dataTransfer.setData('text', depId);
            }

            event.stopPropagation();
        };

        ret.moveUp = (event) => {
            if (this.$options.parent.$options.propsData) {
                window.selectedTags.forEach((t) => {
                    t.removeSelection();
                });
                window.selectedTags = [];

                event.preventDefault();
                event.stopPropagation();

                let newChildren = [];
                let i = null;
                this.$options.parent.$options.propsData.tag.children.forEach((child, index) => {
                    if (this.$options.propsData.tag.__ob__.dep.id === child.__ob__.dep.id) {
                        i = index;
                    }
                });

                if (i > 0) {
                    //get the previous item
                    let previous = this.$options.parent.$options.propsData.tag.children[i-1];
                    let current = this.$options.parent.$options.propsData.tag.children[i];
                    let newChildren = [];

                    this.$options.parent.$options.propsData.tag.children.forEach((child, index) => {
                        if (index === i) {
                            newChildren.push(previous);
                        } else if (index === i - 1) {
                            newChildren.push(current);
                        } else {
                            newChildren.push(child);
                        }
                    });

                    this.$options.parent.$options.propsData.tag.children = newChildren;
                }
            }
        };

        ret.moveDown = (event) => {
            if (this.$options.parent.$options.propsData) {
                window.selectedTags.forEach((t) => {
                    t.removeSelection();
                });
                window.selectedTags = [];

                event.preventDefault();
                event.stopPropagation();

                let newChildren = [];
                let i = null;
                this.$options.parent.$options.propsData.tag.children.forEach((child, index) => {
                    if (this.$options.propsData.tag.__ob__.dep.id === child.__ob__.dep.id) {
                        i = index;
                    }
                });

                if (i < this.$options.parent.$options.propsData.tag.children.length - 1) {
                    //get the previous item
                    let previous = this.$options.parent.$options.propsData.tag.children[i+1];
                    let current = this.$options.parent.$options.propsData.tag.children[i];
                    let newChildren = [];

                    this.$options.parent.$options.propsData.tag.children.forEach((child, index) => {
                        if (index === i) {
                            newChildren.push(previous);
                        } else if (index === i + 1) {
                            newChildren.push(current);
                        } else {
                            newChildren.push(child);
                        }
                    });

                    this.$options.parent.$options.propsData.tag.children = newChildren;
                }
            }
        };

        ret.onClick = (event) => {
            if (ret.draggable) {
                event.preventDefault();
                event.stopPropagation();
                return true;
            }

            let shouldSelect = window.selectedTags.indexOf(this) === -1;

            window.selectedTags.forEach((t) => {
                t.removeSelection();
            });
            window.selectedTags = [];

            event.preventDefault();
            event.stopPropagation();

            if (shouldSelect) {
                ret.selected = true;
                window.selectedTags.push(this);

                window._websitesEditorControllerInstance.setProperties(this.$options.propsData.tag);
            } else {
                window._websitesEditorControllerInstance.clearProperties();
            }

            return true;
        };

        ret.onDragOver = function(event) {
            event.preventDefault();
        };

        ret.onDragEnter = function(event) {
            event.preventDefault();
            ret.droppable = true;
        };

        ret.onDragLeave = function(event) {
            ret.droppable = false;
        };

        ret.onDrop = (event) => {
            event.stopPropagation();
            ret.droppable = false;

            let config = JSON.parse(event.dataTransfer.getData('text'));

            if (typeof(config) === 'number') {
                let depId = config + 1 - 1;
                config = window._websiteDragData[config];
                let newChildren = [];
                config.parent.$options.propsData.tag.children.forEach((child) => {
                    if (depId != child.__ob__.dep.id) {
                        newChildren.push(child);
                    }
                });
                config.parent.$options.propsData.tag.children = newChildren;
                this.$options.propsData.tag.children = this.$options.propsData.tag.children || [];
                this.$options.propsData.tag.children.push(config.thisTag.tag);
            } else {
                //construct our object
                let newTag = {
                    tag         : config.tag,
                    children    : null,
                };

                if (config.view) {
                    newTag = config.view;
                }

                if (typeof(config.properties) !== 'undefined' && config.properties !== null) {
                    Object.keys(config.properties).forEach((prop) => {
                        newTag[prop] = null;
                    });
                }

                this.$options.propsData.tag.children = this.$options.propsData.tag.children || [];
                this.$options.propsData.tag.children.push(newTag);
            }
        };

        return ret;
    },
    mounted : function() {

    }
});

window._websitesEditorControllerInstance = new _websitesEditorController(window.WebsiteEditor);