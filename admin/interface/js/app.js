templates.fetchTemplates().then(() => {
	const pages = [
		'/js/pages/data.js',
		'/js/pages/dataTypeDetails.js',
		'/js/pages/dataTypeEditor.js',
		'/js/pages/integrations.js',
		'/js/pages/integrationsEditor.js',
		'/js/pages/websites.js',
		'/js/pages/websitesEditor.js',
		'/js/pages/documentation.js',
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
		const Home = { template : '#template-home'};
		const Apis = { template : '<p>APIs</p>' };

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
				name 		: 'integrationEditor',
				path 		: '/integrations/editor/:name',
				component 	: IntegrationsEditor
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
				name 		: 'dataTypeEditor',
				path 		: '/data/editor/:type',
				component 	: DataTypeEditor
			},
			{
				name 		: 'dataTypeDetails',
				path 		: '/data/details/:type',
				component 	: DataTypeDetails,
			},
			{
				path 		: '/websites',
				component 	: Websites
			},
			{
				name		: 'websiteEditor',
				path 		: '/websites/editor/:name',
				component 	: WebsiteEditor
			},
			{
				path 		: '/documentation',
				component	: Documentation,
			},
			{
				path 		: '/documentation/:page',
				component	: Documentation,
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