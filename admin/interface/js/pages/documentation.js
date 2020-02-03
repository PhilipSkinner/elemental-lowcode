const converter = new showdown.Converter();

const loadPage = function(name, obj) {
	name = name.replace(/\-\-/g, '/');

	axios.get('/js/documents/' + name).then((content) => {
		obj.html = converter.makeHtml(content.data);
	});
}

const Documentation = {
	template : '#template-documentation',
	data 	 : () => {
		return {
			html : this.html
		};
	},
	mounted  : function() {
		const handlePage = () => {
			var page = 'index.md';

			if (this.$route.params.page) {
				page = this.$route.params.page;
			}

			loadPage(page, this);
		};

		handlePage();

		this.$router.afterEach((to, from) => {
			if (to.path.indexOf('/documentation') === 0) {
				handlePage();
			}
		});
	},
};