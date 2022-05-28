const templateProvider = function() {
    this.templateFiles = [
        "js/templates/navigation.html",
        "js/templates/main.html",
        "js/templates/apis.html",
        "js/templates/rules.html",
        "js/templates/documentation.html",
        "js/templates/integrations.html",
        "js/templates/dataTypes.html",
        "js/templates/security.html",
        "js/templates/websites.html",
        "js/templates/packager.html",
        "js/templates/services.html",
        "js/templates/nodeModules.html",
        "js/templates/messaging.html",
        "js/templates/tagsets.html",
        "js/templates/blobStorage.html",
    ];

    this.initWrapper();
};

templateProvider.prototype.initWrapper = function() {
    this.elem = document.createElement("div");
    this.elem.id = "templateWrapper";
    this.elem.style.display = "none";
    document.body.appendChild(this.elem);
};

templateProvider.prototype.fetchTemplates = function() {
    return Promise.all(this.templateFiles.map((file) => {
        return this.fetchTemplateFile(file);
    }));
};

templateProvider.prototype.fetchTemplateFile = function(name) {
    return window.axiosProxy
        .get(name)
        .then((response) => {
            this.elem.innerHTML += response.data;
        });
};

window.templates = new templateProvider();