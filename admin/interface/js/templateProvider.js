const templateProvider = function() {
	this.templateFiles = [
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
		"js/templates/messaging.html"
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
	let templates = JSON.parse(JSON.stringify(this.templateFiles));

	const doNext = () => {
		if (templates.length === 0) {
			return Promise.resolve();
		}

		return this.fetchTemplateFile(templates.pop()).then(doNext);
	};

	return doNext();
};

templateProvider.prototype.fetchTemplateFile = function(name) {
	return window.axios
		.get(name)
		.then((response) => {
			this.elem.innerHTML += response.data;
		});
};

window.templates = new templateProvider();