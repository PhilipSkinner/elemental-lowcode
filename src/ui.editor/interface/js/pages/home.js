const _homeController = function(page) {
    this._page = page;
    this.rules = [];
    this.integrations = [];
    this.datatypes = [];
    this.websites = [];
    this.clients = [];
    this.apis = [];
    this.status = null;
    this.chartSeconds = 60;
    this.navItems = [
        {
            name : "Home",
            selected : true,
            link : "/#/",
            target : ""
        },
        {
            name : "Monitor",
            selected : false,
            link : "/#/monitor",
            target : ""
        }
    ];
};

/* navigation */
_homeController.prototype.generateNavItems = function() {
    return this.navItems.map((item) => {
        return item;
    });
};
/* end */

_homeController.prototype.getData = function() {
    return {
        rules 			: this.rules,
        integrations 	: this.integrations,
        datatypes 		: this.datatypes,
        websites 		: this.websites,
        clients 		: this.clients,
        apis 			: this.apis,
        status          : this.status,
        navItems 		: this.generateNavItems(),
    };
};

_homeController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_homeController.prototype.fetchRules = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/rules`)
        .then((response) => {
            this.rules = response.data;
        });
};

_homeController.prototype.fetchIntegrations = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/integrations`)
        .then((response) => {
            this.integrations = response.data;
        });
};

_homeController.prototype.fetchDataTypes = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/data/types`)
        .then((response) => {
            this.datatypes = response.data;
        });
};

_homeController.prototype.fetchWebsites = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/websites`)
        .then((response) => {
            this.websites = response.data;
        });
};

_homeController.prototype.fetchClients = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/security/clients`)
        .then((response) => {
            this.clients = response.data;
        });
};

_homeController.prototype.fetchAPIs = function() {
    return window.axiosProxy
        .get(`${window.hosts.kernel}/apis`)
        .then((response) => {
            this.apis = response.data;
        });
};

_homeController.prototype.fetchStatus = function() {
    clearTimeout(this.timeout);

    return window.axiosProxy
        .get(`${window.hosts.kernel}/status`)
        .then((response) => {
            this.status = response.data.services;

            //we need to record the CPU changes over time
            if (!this.cpu) {
                this.cpu = {
                    combined : []
                };
            }

            //and our RAM changes
            if (!this.ram) {
                this.ram = {
                    combined : []
                };
            }

            let allcpu = 0;
            let allram = 0;
            this.status.forEach((service) => {
                if (!this.cpu[service.name]) {
                    this.cpu[service.name] = [];
                }

                this.cpu[service.name].push(service.cpu);
                allcpu += service.cpu;

                if (!this.ram[service.name]) {
                    this.ram[service.name] = [];
                }

                this.ram[service.name].push(service.memory / 1024 / 1024);
                allram += service.memory / 1024 / 1024;
            });
            this.cpu.combined.push(allcpu);
            this.ram.combined.push(allram);

            this.refresh();

            this.timeout = setTimeout(() => {
                this.fetchStatus();
            }, 1000);
        }).catch((err) => {
            console.log(err);
            this.timeout = setTimeout(() => {
                this.fetchStatus();
            }, 1000);
        });
};

_homeController.prototype.stringToColour = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
};

_homeController.prototype.generateCPUGraphData = function() {
    const labels = [];
    for (let i = 0; i < this.chartSeconds; i++) {
        labels.push("");
    }

    return {
        labels : labels,
        datasets : Object.keys(this.cpu).map((type) => {
            //trim our data
            while (this.cpu[type].length > this.chartSeconds) {
                this.cpu[type].shift();
            }

            return {
                label : type,
                data : this.cpu[type],
                fill : false,
                borderColor: this.stringToColour(type),
                backgroundColor: this.stringToColour(type),
            };
        })
    };
};

_homeController.prototype.generateRAMGraphData = function() {
    const labels = [];
    for (let i = 0; i < this.chartSeconds; i++) {
        labels.push("");
    }

    return {
        labels : labels,
        datasets : Object.keys(this.ram).map((type) => {
            while (this.ram[type].length > this.chartSeconds) {
                this.ram[type].shift();
            }

            return {
                label : type,
                data : this.ram[type],
                fill : false,
                borderColor: this.stringToColour(type),
                backgroundColor: this.stringToColour(type),
            };
        })
    };
};

_homeController.prototype.refresh = function() {
    const cpudata = this.generateCPUGraphData();
    if (!this.cpuchart) {
        const ctx = document.getElementById('cpu-chart');

        if (ctx) {
            this.cpuchart = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: cpudata,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            min : 0
                        }
                    },
                    maintainAspectRatio: false,
                },
            });
        }
    } else {
        this.cpuchart.data.datasets.forEach((d, i) => {
            d = cpudata.datasets[i];
        });
        this.cpuchart.update('none');
    }

    const ramdata = this.generateRAMGraphData();
    if (!this.ramchart) {
        const ctx = document.getElementById('ram-chart');
        if (ctx) {
            this.ramchart = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: ramdata,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            min : 0
                        }
                    },
                    maintainAspectRatio: false,
                }
            });
        }
    } else {
        this.ramchart.data.datasets.forEach((d, i) => {
            d = ramdata.datasets[i];
        });
        this.ramchart.update('none');
    }

    this.caller.rules = this.rules;
    this.caller.integrations = this.integrations;
    this.caller.datatypes = this.datatypes;
    this.caller.websites = this.websites;
    this.caller.clients = this.clients;
    this.caller.apis = this.apis;
    this.caller.status = this.status;
    this.caller.navItems = this.generateNavItems();
    this.caller.$forceUpdate();
};

_homeController.prototype.toHumanTime = function(seconds) {
    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }

    var years = Math.floor(seconds / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    var days = Math.floor((seconds %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((seconds %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((seconds %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = seconds % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second';
};

_homeController.prototype.disableMonitoring = function() {
    this.cpuchart = null;
    this.ramchart = null;
};

window.Home = {
    template : "#template-home",
    data 	 : () => {
        return window._homeControllerInstance.getData();
    },
    mounted  : function() {
        window._homeControllerInstance.setCaller(this);

        window._homeControllerInstance.fetchStatus();

        return Promise.all([
            window._homeControllerInstance.fetchRules(),
            window._homeControllerInstance.fetchIntegrations(),
            window._homeControllerInstance.fetchDataTypes(),
            window._homeControllerInstance.fetchWebsites(),
            window._homeControllerInstance.fetchClients(),
            window._homeControllerInstance.fetchAPIs(),
        ]).then(() => {
            window._homeControllerInstance.refresh();
        });
    },
    destroyed : function() {
        window._homeControllerInstance.disableMonitoring();
    }
};

window._homeControllerInstance = new _homeController(window.Home);