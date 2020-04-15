const converter = new showdown.Converter();

const loadPage = function(name, obj) {
	window.axios.get(`${name}.md`).then((content) => {
		obj.html = converter.makeHtml(content.data);

		//quickly replace any /documentation links
		obj.html = obj.html.replace(/"\/documentation/g, "\"#/documentation");
	});
}

window.Documentation = {
	template : "#template-documentation",
	data 	 : () => {
		return {
			html : this.html
		};
	},
	mounted  : function() {
		const handlePage = () => {
			var page = "/documentation/index";

			if (this.$route.path) {
				page = this.$route.path;
			}

			if (page === "/documentation") {
				page = "/documentation/index";
			}

			loadPage(page, this);
		};

		handlePage();

		this.$router.afterEach((to, from) => {
			if (to.path.indexOf("/documentation") === 0) {
				handlePage();
			}
		});
	},
};