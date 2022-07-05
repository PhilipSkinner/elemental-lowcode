const _monitorController = function(page) {
    this._page = page;
    this.system = "interface.errors";
    this.timeout = null;
    this.lastSeen = 0;
    this.disabled = true;
    this.navItems = [
        {
            name : "Home",
            selected : false,
            link : "/#/",
            target : ""
        },
        {
            name : "Monitor",
            selected : true,
            link : "/#/monitor",
            target : ""
        }
    ];
};

/* navigation */
_monitorController.prototype.generateNavItems = function() {
    return this.navItems.map((item) => {
        return item;
    });
};
/* end */

_monitorController.prototype.getData = function() {
    return {
        navItems 		: this.generateNavItems(),
        system          : null,
        systems         : [
            {
                name : 'interface.errors',
                title : 'Website Errors'
            },
            {
                name : 'interface.debug',
                title : 'Website Debug'
            },
            {
                name : 'storage.errors',
                title : 'Data Errors'
            },
            {
                name : 'storage.debug',
                title : 'Data Debug'
            },
            {
                name : 'admin.errors',
                title : 'Admin Errors'
            },
            {
                name : 'admin.debug',
                title : 'Admin Debug'
            },
            {
                name : 'api.errors',
                title : 'API Errors'
            },
            {
                name : 'api.debug',
                title : 'API Debug'
            },
            {
                name : 'identity.errors',
                title : 'Identity Errors'
            },
            {
                name : 'identity.debug',
                title : 'Identity Debug'
            },
            {
                name : 'integration.errors',
                title : 'Integration Errors'
            },
            {
                name : 'integration.debug',
                title : 'Integration Debug'
            },
            {
                name : 'messaging.errors',
                title : 'Messaging Errors'
            },
            {
                name : 'messaging.debug',
                title : 'Messaging Debug'
            },
            {
                name : 'rules.errors',
                title : 'Ruleset Errors'
            },
            {
                name : 'rules.debug',
                title : 'Ruleset Debug'
            },
            {
                name : 'blob.errors',
                title : 'Blob Errors'
            },
            {
                name : 'blob.debug',
                title : 'Blob Debug'
            },
        ]
    };
};

_monitorController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_monitorController.prototype._renderLines = function(lines) {
    const elem = document.querySelectorAll("#monitorContent")[0];
    const numbers = Object.keys(lines).map((n) => { return parseInt(n, 10); }).sort((a,b) => {return a - b;});
    const maxLines = 500;
    let toRemove = 0;
    let toAdd = numbers.length;

    //trim the elements out of this first
    const existingNum = elem.childNodes.length;

    //how many are we adding?
    const totalNew = numbers.length;

    if (existingNum + totalNew > maxLines) {
        //we need to remove some
        toRemove = existingNum + totalNew - maxLines;
        if (toRemove > existingNum) {
            toRemove = existingNum;
        }

        if (existingNum - toRemove + totalNew > maxLines) {
            //reduce the number we add in
            toAdd = maxLines;
        }
    }

    //remove them
    if (toRemove === existingNum) {
        //simply wipe it out
        elem.innerHTML = "";
    } else {
        for (var i = 0; i < toRemove; i++) {
            //remove the item
            elem.childNodes[0].remove();
        }
    }

    for (var i = numbers[totalNew - toAdd]; i <= numbers.slice(-1)[0]; i++) {
        const lm = document.createElement("div");
        let corrected = lines[i].replace(/[\r\n]/g, "");
        corrected = corrected.replace(/\[39m/g, '</span>')
        corrected = corrected.replace(/\[(\d+)m/g, '<span class="sgr-$1">')
        lm.innerHTML = `<span class="number">${i}</span><span class="message"><pre>${corrected}</pre></span>`;
        elem.appendChild(lm);
    }

    elem.scrollTop = elem.scrollHeight;
};

_monitorController.prototype.disableMonitoring = function() {
    clearTimeout(this.timeout);
    this.disabled = true;
};

_monitorController.prototype._monitorSystem = function() {
    clearTimeout(this.timeout);

    if (!this.system) {
        return;
    }

    //fetch the last lines
    window.axiosProxy.get(`${window.hosts.kernel}/logs/${this.system}?from=${this.lastSeen + 1}`).then((lines) => {
        if (lines && lines.data && lines.data.lines) {
            const numbers = Object.keys(lines.data.lines).map((n) => { return parseInt(n, 10); }).sort((a,b) => {return a - b;});
            if (numbers.length > 0) {
                this.lastSeen = numbers.slice(-1)[0];

                //render the lines
                this._renderLines(lines.data.lines);

                //append it to our download cache

                this.downloadCache += Object.keys(lines.data.lines).sort().map((num) => {
                    return lines.data.lines[num].replace(/\[\d+m/g, '');
                }).join("\n");
            }
        }

        if (!this.disabled) {
            this.timeout = setTimeout(this._monitorSystem.bind(this), 1000);
        }
    });
};

_monitorController.prototype.download = function() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.downloadCache));
    element.setAttribute('download', `${this.system}-${(new Date()).toISOString()}.log`);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

_monitorController.prototype.monitorSystem = function(system) {
    clearTimeout(this.timeout);
    this.system = system;
    this.caller.system = system;
    this.caller.$forceUpdate();
    this.lastSeen = -1;
    this.downloadCache = "";

    //wipe it
    const elem = document.querySelectorAll("#monitorContent")[0];
    elem.innerHTML = "";

    if (system) {
        this.disabled = false;
        this._monitorSystem();
    }
};

_monitorController.prototype.refresh = function() {
    this.caller.navItems = this.generateNavItems();
    this.caller.$forceUpdate();
};

window.Monitor = {
    template : "#template-monitor",
    data 	 : () => {
        return window._monitorControllerInstance.getData();
    },
    mounted  : function() {
        window._monitorControllerInstance.setCaller(this);
        window._monitorControllerInstance.monitorSystem();
    },
    destroyed : function() {
        window._monitorControllerInstance.disableMonitoring();
    }
};

window._monitorControllerInstance = new _monitorController(window.Monitor);