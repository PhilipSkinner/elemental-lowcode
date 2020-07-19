const _monitorController = function(page) {
	this._page = page;
	this.system = "interface.errors";
	this.timeout = null;
	this.lastSeen = 0;
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
		navItems 		: this.generateNavItems()
	};
};

_monitorController.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_monitorController.prototype._renderLines = function(lines) {
	const elem = document.querySelectorAll('#monitorContent')[0];
	const numbers = Object.keys(lines).map((n) => { return parseInt(n); }).sort((a,b) => {return a - b})
	const maxLines = 1000;
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
		elem.innerHTML = '';
	} else {
		for (var i = 0; i < toRemove; i++) {
			//remove the item
			elem.childNodes[0].remove();
		}
	}

	for (var i = numbers[totalNew - toAdd]; i <= numbers.slice(-1)[0]; i++) {
		var lm = document.createElement("div");
		lm.innerHTML = `<span class="number">${i}</span><span class="message">${lines[i]}</span>`;
		elem.appendChild(lm);
	}

	elem.scrollTop = elem.scrollHeight;
};

_monitorController.prototype._monitorSystem = function() {
	clearTimeout(this.timeout);

	//fetch the last lines
	window.axios.get(`${window.hosts.kernel}/logs/${this.system}?from=${this.lastSeen}`, {
		headers : {
			Authorization : `Bearer ${window.getToken()}`
		}
	}).then((lines) => {
		const numbers = Object.keys(lines.data.lines).map((n) => { return parseInt(n); }).sort((a,b) => {return a - b});
		if (numbers.length > 0) {
			this.lastSeen = numbers.slice(-1)[0];

			//render the lines
			this._renderLines(lines.data.lines);
		}

		setTimeout(this._monitorSystem.bind(this), 250);
	});
};

_monitorController.prototype.monitorSystem = function(system) {
	clearTimeout(this.timeout);
	this.system = system;
	this.lastSeen = 0;
	this._monitorSystem();
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
		window._monitorControllerInstance._monitorSystem();
	}
};

window._monitorControllerInstance = new _monitorController(window.Monitor);