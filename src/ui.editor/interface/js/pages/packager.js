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
    window.axiosProxy.get(`${window.hosts.kernel}`, {
        responseType: "arraybuffer"
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type : "application/tar" }));
   		const link = document.createElement("a");
   		link.href = url;
   		link.setAttribute("download", "export.tar");
   		document.body.appendChild(link);
   		link.click();
    });
};

_packagerController.prototype.import = function() {
    const elem = document.querySelectorAll("input[name=\"importFile\"]")[0];

    return window.getBase64(elem.files[0]).then((file) => {
        return window.axiosProxy.post(`${window.hosts.kernel}`, {
            file : file,
            name : "import.tar"
        }, {
            headers: {
                "Content-Type" : "application/json",
            }
        }).then(() => {
            console.log(response);
        });
    });
};

window.Packager = {
    template : "#template-packager",
    data 	 : () => {
        return window._packagerControllerInstance.getData();
    },
    mounted  : function() {

    }
};

window._packagerControllerInstance = new _packagerController(window.packager);