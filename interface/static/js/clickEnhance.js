var clickHandler = function(elem) {
	this.elem = elem;
	this.init();
};

clickHandler.prototype.init = function() {
	this.elem.addEventListener("click", this.handleClick.bind(this));

	const poll = this.elem.attributes["data-poll"];
	if (poll && poll.value) {
		this.timeout = setInterval(this.pollEvent.bind(this), poll.value);
	}
};

clickHandler.prototype.pollEvent = function() {
	this.handleClick(null);
};

clickHandler.prototype.handleClick = function(event) {
	console.log(event);

	if (event) {
		event.preventDefault();
		event.stopPropagation();
		event.cancelBubble = true;
	}

	const params = {};
	const files = {};
	let doMultipart = false;
	document.querySelectorAll("input, select, textarea").forEach((field) => {
		let name = field.name;
		let value = field.value;

		if ((field.type === "radio" || field.type === "checkbox") && !field.checked) {
			// do nothing
		} else {
			if (!params[name]) {
				params[name] = value;
			} else {
				if (!Array.isArray(params[name])) {
					params[name] = [params[name]];
				}

				params[name].push(value);
			}
		}
	});

	var url = `${location.pathname}${this.elem.attributes["href"].value}`;

	Object.keys(params).forEach((k) => {
		if (Array.isArray(params[k])) {
			params[k].forEach((v) => {
				url = `${url}&${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
			});
		} else {
			url = `${url}&${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
		}
	});

	window.axios.get(url, {
		withCredentials : true
	}).then((response) => {
		this.handleResponse(response);
	});

	return false;
};

clickHandler.prototype.handleResponse = function(response) {
	if (response.request && response.request.responseURL && location.href !== response.request.responseURL) {
		//need to rewrite the location
		history.pushState({}, '', response.request.responseURL);
	}

	var newMap = createDOMMap(stringToHTML(response.data));
	var domMap = createDOMMap(document.querySelector("html"));
	diff(newMap[1].children, domMap, document.querySelector("html"));

	enhanceForms();
	enhanceLinks();
};

var enhanceLinks = function() {
	var elems = document.querySelectorAll("a[href^=\"?event\"], area[href^=\"?event\"]");
	var handlers = [];
	for (var i = 0; i < elems.length; i++) {
		if (!elems[i].attributes["_clickEnhanced"]) {
			elems[i].attributes["_clickEnhanced"] = 1;
			handlers.push(new clickHandler(elems[i]));
		}
	}
};

document.addEventListener("DOMContentLoaded", function() {
	enhanceLinks();
});