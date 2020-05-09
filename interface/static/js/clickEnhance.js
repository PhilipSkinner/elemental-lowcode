var clickHandler = function(elem) {
	this.elem = elem;
	this.init();
};

clickHandler.prototype.init = function() {
	this.elem.addEventListener("click", this.handleClick.bind(this));
};

clickHandler.prototype.handleClick = function(event) {
	event.preventDefault();
	event.stopPropagation();
	event.cancelBubble = true;

	//load the response
	const href = this.elem.attributes["href"];
	window.axios.get(`${location.pathname}${href.value}`, {
		withCredentials : true
	}).then((response) => {
		this.handleResponse(response);
	});

	return false;
};

clickHandler.prototype.handleResponse = function(response) {
	if (response.request && response.request.responseURL) {
		//need to rewrite the location
		history.pushState({}, '', response.request.responseURL);
	}

	document.open();
    document.write(response.data);
    document.close();
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