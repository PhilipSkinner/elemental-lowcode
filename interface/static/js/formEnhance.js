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
		if (field.type !== "file") {
			field.value = field.getAttribute("value");	
		} else {
			field.value = null;
		}
	});
};

submitHandler.prototype.handleSubmit = function(event) {
	event.preventDefault();
	event.stopPropagation();
	event.cancelBubble = true;

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
			document.open();
	        document.write(response.data);
	        document.close();
		});		
	} else {
		window.axios.post(`${location.pathname}${this.elem.attributes["action"].value}`, JSON.stringify(params), {
			headers : {
				"Content-Type": "application/json"
			},
			withCredentials : true
		}).then((response) => {
			document.open();
	        document.write(response.data);
	        document.close();
		});		
	}

	return false;
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