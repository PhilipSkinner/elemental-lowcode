templates.fetchTemplates().then(() => {
	const pages = [
		'/js/pages/data.js',
		'/js/pages/dataTypeEditor.js'
	];

	const loadPage = (file) => {
		console.log("Loading", file);
		return new Promise((resolve, reject) => {
			var elem = document.createElement('script');
			elem.src = file;
			elem.onload = () => {
				resolve();
			};
			document.body.appendChild(elem);
		});		
	};

	//load our pages
	const loadPages = () => {
		pages.reverse();

		const doNext = () => {
			if (pages.length === 0) {
				return Promise.resolve();
			}

			return loadPage(pages.pop()).then(doNext);
		}

		return doNext();
	};

	loadPages().then(() => {
		console.log("pages loaded");
		const Home = { template : '<p>Home</p>'};
		const Integrations = { template : '<p>Integrations</p>' };
		const Apis = { template : '<p>APIs</p>' };
		const Websites = { template : '<p>Websites</p>' };

		const routes = [
			{
				path 		: '/', 
				component 	: Home
			},
			{
				path 		: '/integrations', 
				component 	: Integrations
			},
			{
				path 		: '/apis',
				component 	: Apis
			},
			{
				path 		: '/data',
				component 	: Data
			},
			{
				name 		: 'dataTypeDetails',
				path 		: '/data/:type',
				component 	: DataTypeEditor
			},
			{
				path 		: '/websites',
				component 	: Websites
			}
		];		

		Vue.component('modal-error', {
			template : '#template-modal-error',
			props : [
				'title',
				'visible'
			]
		});

		Vue.component('alert', {
			template : '#template-alert',
			props : [
				'text',
				'visible'
			]			
		});

		const router = new VueRouter({
			routes : routes,			
		});		

		const app = new Vue({
			router
		}).$mount('#app');	
	});
});