var submitHandler = function(elem) {
	this.elem = elem;
	this.init();
};

submitHandler.prototype.pollEvent = function() {
	this.handleSubmit(null);
};

submitHandler.prototype.init = function() {
	this.resetForm();
	this.elem.addEventListener("submit", this.handleSubmit.bind(this));

	const poll = this.elem.attributes["data-poll"];
	if (poll && poll.value) {
		this.timeout = setInterval(this.pollEvent.bind(this), poll.value);
	}
};

submitHandler.prototype.resetForm = function() {
	this.elem.querySelectorAll("input, select, textarea").forEach((field) => {
		if (field.type !== "file") {
			field.value = field.getAttribute("value");
		} else {
			field.value = null;
		}
	});
};

submitHandler.prototype.handleSubmit = function(event) {
	if (event) {
		event.preventDefault();
		event.stopPropagation();
		event.cancelBubble = true;
	}

	const params = {};
	const files = {};
	let doMultipart = false;
	this.elem.querySelectorAll("input, select, textarea").forEach((field) => {
		let name = field.name;
		let value = field.value;

		if (field.type === "file") {
			doMultipart = true;
			let fileArray = [];
			for (let i = 0; i < field.files.length; i++) {
				fileArray.push(field.files[i]);
			}

			if (!files[name]) {
				files[name] = fileArray;
			} else {
				if (!Array.isArray(files[name])) {
					files[name] = [files[name]];
				}

				files[name] = files[name].concat(fileArray);
			}
		} else if ((field.type === "radio" || field.type === "checkbox") && !field.checked) {
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

	if (doMultipart) {
		const formData = new FormData();
    	formData.append('__params', JSON.stringify(params));

    	Object.keys(files).forEach((fileName) => {
    		if (Array.isArray(files[fileName])) {
    			let i = 0;
    			files[fileName].forEach((fileInstance) => {
    				formData.append(`${fileName}$$_$$${i}`, fileInstance);
    			});
    		} else {
    			formData.append(fileName, files[fileName]);
    		}
    	});

		window.axios.post(`${location.pathname}${this.elem.attributes["action"].value}`, formData, {
			headers : {
				"Content-Type": "multipart/form-data"
			},
			withCredentials : true
		}).then((response) => {
			this.handleResponse(response);
		});
	} else {
		window.axios.post(`${location.pathname}${this.elem.attributes["action"].value}`, JSON.stringify(params), {
			headers : {
				"Content-Type": "application/json"
			},
			withCredentials : true
		}).then((response) => {
			this.handleResponse(response);
		});
	}

	return false;
};

submitHandler.prototype.handleResponse = function(response) {
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

var enhanceForms = function() {
	var elems = document.querySelectorAll("form[action^=\"?_event\"]");
	var handlers = [];
	for (var i = 0; i < elems.length; i++) {
		if (!elems[i].attributes["_submitEnhanced"]) {
			elems[i].attributes["_submitEnhanced"] = 1;
			handlers.push(new submitHandler(elems[i]));
		}
	}
};

document.addEventListener("DOMContentLoaded", function() {
	enhanceForms();
});