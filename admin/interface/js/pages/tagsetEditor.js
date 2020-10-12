const _tagsetEditor = function() {
	this.clearState();
};

_tagsetEditor.prototype.clearState = function() {
	this.editor 					= null;
	this.navitems = [
		{
			name 		: "Interface",
			event 		: this.editView.bind(this),
			selected 	: true
		},
		{
			name 		: "Controller",
			event 		: this.editController.bind(this),
			selected 	: false
		}
	];
	this.tagset 					= {};
	this.showSavedAlert 			= false;
	this.viewEditorVisible 			= false;
	this.controllerEditorVisible 	= false;
	this.activeTag					= {};
	this.activeGroupNum				= null;
	this.activeTagNum 				= null;
};

_tagsetEditor.prototype.initBlankTagset = function() {
	return new Promise((resolve, reject) => {
		this.tagset = {
			name : 'untitled',
			groups 	: [
				{
					name : 'Group 1',
					tags : []
				}
			]
		};
		this.refreshState();
		return resolve();
	});
}

_tagsetEditor.prototype.refreshState = function() {
	this.caller.navitems 				= this.navitems;
	this.caller.tagset 					= this.tagset;
	this.caller.showSavedAlert 			= this.showSavedAlert;
	this.caller.viewEditorVisible 		= this.viewEditorVisible;
	this.caller.controllerEditorVisible = this.controllerEditorVisible;
	this.caller.activeTag 				= this.activeTag;
	this.caller.activeGroupNum 			= this.activeGroupNum;
	this.caller.activeTagNum 			= this.activeTagNum;
	this.caller.$forceUpdate();
};

_tagsetEditor.prototype.getData = function() {
	return {
		navitems 				: this.navitems,
		tagset 					: this.tagset,
		showSavedAlert 			: this.showSavedAlert,
		viewEditorVisible 		: this.viewEditorVisible,
		controllerEditorVisible : this.controllerEditorVisible,
		activeTag 				: this.activeTag,
		activeGroupNum 			: this.activeGroupNum,
		activeTagNum 			: this.activeTagNum
	};
};

_tagsetEditor.prototype.setCaller = function(caller) {
	this.caller = caller;
};

_tagsetEditor.prototype.getTagset = function(name) {
	return window.axios.get(`${window.hosts.kernel}/tags/${name}`, {
		headers : {
			Authorization : `Bearer ${window.getToken()}`
		}
	}).then((response) => {
		this.tagset.name = name;
		this.tagset.groups = response.data;
		this.refreshState();
	});
};

_tagsetEditor.prototype.save = function() {
	//ensure our tag has been updated
	if (this.activeGroupNum !== null && this.activeTagNum !== null) {
		if (this.viewEditorVisible) {
			this.activeTag.view = this.editor.getValue();
		} else if (this.controllerEditorVisible) {
			this.activeTag.controller = this.editor.getValue();
		}

		this.tagset.groups[this.activeGroupNum].tags[this.activeTagNum] = this.activeTag;
	}

	return window.axios.put(`${window.hosts.kernel}/tags/${this.tagset.name}`, JSON.stringify(this.tagset.groups, null, 4), {
		headers : {
			Authorization : `Bearer ${window.getToken()}`,
			"content-type" : "application/json"
		}
	}).then((response) => {
		this.showSavedAlert = true;
		this.refreshState();

		setTimeout(() => {
			this.showSavedAlert = false;
			this.refreshState();
		}, 2000);
	});
};

_tagsetEditor.prototype.addTag = function(groupNum) {
	this.tagset.groups[groupNum].tags.push({
		name 		: `Tag ${this.tagset.groups[groupNum].tags.length + 1}`,
		tag  		: "div",
		view 		: JSON.stringify({
			tag 		: "div",
			children 	: []
		}, null, 4),
		controller 	: 'module.exports = {\n\tevents : {}\n};'
	});

	this.refreshState();
};

_tagsetEditor.prototype.closeEditor = function() {
	if (this.activeGroupNum !== null && this.activeTagNum !== null) {
		if (this.viewEditorVisible) {
			this.activeTag.view = this.editor.getValue();
		} else if (this.controllerEditorVisible) {
			this.activeTag.controller = this.editor.getValue();
		}

		this.tagset.groups[this.activeGroupNum].tags[this.activeTagNum] = this.activeTag;
	}

	this.viewEditorVisible = false;
	this.controllerEditorVisible = false;
	this.activeGroupNum = null;
	this.activeTagNum = null;

	this.refreshState();
};

_tagsetEditor.prototype.initEditor = function(elem, type, value) {
	this.editor = window.ace.edit(document.getElementById(elem), {
		mode : "ace/mode/" + type,
		selectionStyle : "text"
	});
	this.editor.commands.addCommand({
		name : "save",
		bindKey : {
			win: "Ctrl-S",
			mac: "Cmd-S"
		},
		exec : () => {
			this.save();
		}
	});
	this.editor.setTheme("ace/theme/twilight");
	this.editor.setValue(value);
	this.editor.getSession().setMode("ace/mode/" + type);
};

_tagsetEditor.prototype.editView = function() {
	this.viewEditorVisible = true;
	this.controllerEditorVisible = false;
	this.navitems[1].selected = false;
	this.navitems[0].selected = true;

	this.refreshState();

	setTimeout(() => {
		this.initEditor("viewEditor", "json", this.activeTag.view);
	}, 10);
};

_tagsetEditor.prototype.editController = function() {
	this.viewEditorVisible = false;
	this.controllerEditorVisible = true;
	this.navitems[0].selected = false;
	this.navitems[1].selected = true;

	this.refreshState();

	setTimeout(() => {
		this.initEditor("controllerEditor", "javascript", this.activeTag.controller);
	}, 10);
};

_tagsetEditor.prototype.modifyTag = function(groupNum, itemNum) {
	this.activeGroupNum = groupNum;
	this.activeTagNum = itemNum;
	this.activeTag = this.tagset.groups[groupNum].tags[itemNum];

	this.editView();
};

_tagsetEditor.prototype.deleteTag = function(groupNum, itemNum) {
	this.tagset.groups[groupNum].tags.splice(itemNum, 1);

	this.refreshState();
};

_tagsetEditor.prototype.addGroup = function() {
	this.tagset.groups.push({
		name : `Group ${this.tagset.groups.length + 1}`,
		tags : []
	});

	this.refreshState();
};

_tagsetEditor.prototype.deleteGroup = function(groupNum) {
	this.tagset.groups.splice(groupNum, 1);

	this.refreshState();
};

_tagsetEditor.prototype.keyDownHandler = function(event) {
	if (event && event.ctrlKey && event.keyCode === 83) {
		window._tagsetEditorInstance.save();

		event.preventDefault();
		event.stopPropagation();
	}
};

window.TagsetEditor = {
	template : "#template-tagsetEditor",
	data 	 : () => {
		return window._tagsetEditorInstance.getData();
	},
	mounted  : function() {
		window._tagsetEditorInstance.clearState();
		window._tagsetEditorInstance.setCaller(this);

		document.removeEventListener("keydown", window._tagsetEditorInstance.keyDownHandler);
		document.addEventListener("keydown", window._tagsetEditorInstance.keyDownHandler);

		if (this.$route.params.name === ".new") {
			return window._tagsetEditorInstance.initBlankTagset();
		} else {
			return window._tagsetEditorInstance.getTagset(this.$route.params.name);
		}
	},
	destroyed : function() {
		document.removeEventListener("keydown", window._tagsetEditorInstance.keyDownHandler);
		window._tagsetEditorInstance.clearState();
	}
};

window._tagsetEditorInstance = new _tagsetEditor(window.TagsetEditor);
