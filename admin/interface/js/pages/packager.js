const _packagerController = function(page) {
	this._page = page;
};

_packagerController.prototype.getData = function() {
	return {
		packager : this.packager
	};
};

_packagerController.prototype.export = function() {
	//generate the package
	window.axios.get(`${window.hosts.kernel}`, {
		responseType: 'arraybuffer',
		headers : {
			Authorization : `Bearer ${window.getToken()}`
		}
	}).then((response) => {
		const url = window.URL.createObjectURL(new Blob([response.data], { type : "application/tar" }));
   		const link = document.createElement('a');
   		link.href = url;
   		link.setAttribute('download', 'export.tar');
   		document.body.appendChild(link);
   		link.click();
	});
};

_packagerController.prototype.import = function() {
	const elem = document.querySelectorAll("input[name='importFile']")[0];
	const reader = new FileReader();

	reader.onload = (e) => {
		const value = e.target.result;
		const formData = new FormData();
		const importFile = new File([value], "import.tar", {
       		type: value.type,
		});
		formData.append('import', importFile);

		window.axios.post(`${window.hosts.kernel}`, formData, {
			headers : {
				Authorization : `Bearer ${window.getToken()}`
			}
		}).then((response) => {
			console.log(response);
		});
	};
	reader.readAsArrayBuffer(elem.files[0]);


};

window.packager = {
	template : "#template-packager",
	data 	 : () => {
		return window._packagerControllerInstance.getData();
	},
	mounted  : function() {

	}
};

window._packagerControllerInstance = new _packagerController(window.packager);