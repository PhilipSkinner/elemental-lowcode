var submitHandler = function(elem) {
	this.elem = elem;
	this.init();
};

submitHandler.prototype.init = function() {
	this.resetForm();
	this.elem.addEventListener("submit", this.handleSubmit.bind(this));
};

submitHandler.prototype.resetForm = function() {
	this.elem.querySelectorAll("input, select, textarea").forEach((field) => {
		console.log(field.getAttribute("value"));
		field.value = field.getAttribute("value");
	});
};

submitHandler.prototype.handleSubmit = function(event) {	
	event.preventDefault();
	event.stopPropagation();
	event.cancelBubble = true;

	const params = {};
	this.elem.querySelectorAll("input, select, textarea").forEach((field) => {
		let name = field.name;
		let value = field.value;

		if (!params[name]) {
			params[name] = value;
		} else {
			if (!Array.isArray(params[name])) {
				params[name] = [params[name]];
			}

			params[name].push(value);
		}
	});

	window.axios.post(`${location.pathname}${this.elem.attributes['action'].value}`, JSON.stringify(params), {
		headers : {
			'Content-Type': 'application/json'
		},
		withCredentials : true
	}).then((response) => {
		document.open();
        document.write(response.data);
        document.close();
	});

	return false;
};

var enhanceForms = function() {
	var elems = document.querySelectorAll('form[action^="?_event"]');
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