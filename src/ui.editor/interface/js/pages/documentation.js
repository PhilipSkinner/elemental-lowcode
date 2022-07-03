const _documentationController = function(page) {
    this.page = page;
    this.converter = new showdown.Converter();
    this.html = "";
    this.currentSearch = "";
    this.searching = false;
    this.results = null;
};

_documentationController.prototype.getData = function() {
    return {
        html            : this.html,
        currentSearch   : this.currentSearch,
        searching       : this.searching,
        results         : this.results,
    };
};

_documentationController.prototype.forceRefresh = function() {
    this.caller.html = this.html;
    this.caller.currentSearch = this.currentSearch;
    this.caller.searching = this.searching;
    this.caller.results = this.results;

    this.caller.$forceUpdate();
};

_documentationController.prototype.setCaller = function(caller) {
    this.caller = caller;
};

_documentationController.prototype.doSearch = function() {
    clearTimeout(this.timeout);
    this.currentSearch = this.caller.currentSearch;

    this.timeout = setTimeout(() => {
        if (this.caller.currentSearch === "") {
            this.searching = false;
            this.forceRefresh();
            return;
        }

        this.searching = true;
        this.forceRefresh();

        window.axiosProxy.get(`${window.hosts.kernel}/documentation?query=${encodeURIComponent(this.caller.currentSearch)}`).then((results) => {
            this.results = results.data;
            this.forceRefresh();
        });
    }, 500);
};

_documentationController.prototype.convertMarkdown = function(markdown) {
    const converted = this.converter.makeHtml(markdown);

    //quickly replace any /documentation links
    return converted.replace(/"\/src\/support\.documentation/g, "\"#/documentation");
};

_documentationController.prototype.generateLink = function(file) {
    return file.replace(/\/src\/support\.documentation/g, "#/documentation").replace(".md", "");
};

_documentationController.prototype.loadPage = function(name) {
    this.currentSearch = "";
    this.searching = false;
    this.results = null;

    window.axiosProxy.get(`${name}.md`).then((content) => {
        this.html = this.convertMarkdown(content.data);

        //scroll to the top
        window.scrollTo(0, 0);

        //refresh
        this.forceRefresh();
    });
};

window.Documentation = {
    template : "#template-documentation",
    data     : () => {
        return window._documentationControllerInstance.getData();
    },
    mounted  : function() {
        const handlePage = () => {
            var page = "/documentation/index";

            if (this.$route.path) {
                page = this.$route.path;
            }

            if (page === "/documentation") {
                page = "/documentation/index";
            }

            window._documentationControllerInstance.loadPage(page);
        };

        window._documentationControllerInstance.setCaller(this);
        handlePage();

        this.$router.afterEach((to, from) => {
            if (to.path.indexOf("/documentation") === 0) {
                handlePage();
            }
        });
    },
};

window._documentationControllerInstance = new _documentationController(window.Documentation);