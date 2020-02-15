window.getToken = function() {	
	let token = null;
	document.cookie.split(';').forEach((c) => {
		let p = c.split('=');
		if (p[0] === 'token') {
			token = p[1];
		}
	});

	return token;
};

window.logout = function() {
	document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	location.href = '/';
};

templates.fetchTemplates().then(() => {
	const pages = [
		'/js/pages/data.js',
		'/js/pages/dataTypeDetails.js',
		'/js/pages/dataTypeEditor.js',
		'/js/pages/integrations.js',
		'/js/pages/integrationsEditor.js',
		'/js/pages/integrationDetails.js',
		'/js/pages/websites.js',
		'/js/pages/websitesEditor.js',
		'/js/pages/documentation.js',
		'/js/pages/rules.js',
		'/js/pages/rulesEditor.js',
		'/js/pages/security.js',
		'/js/pages/securityClientEditor.js',
		'/js/pages/securityScopeEditor.js',
		'/js/pages/securityUserEditor.js',
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
			/* integrations endpoints */
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
				name 		: 'integrationDetails',
				path 		: '/integrations/details/:name',
				component	: IntegrationDetails
			},
			/* api endpoints */
			{
				path 		: '/apis',
				component 	: Apis
			},
			/* data type endpoints */
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
			/* website/interface endpoints */
			{
				path 		: '/websites',
				component 	: Websites
			},
			{
				name		: 'websiteEditor',
				path 		: '/websites/editor/:name',
				component 	: WebsiteEditor
			},
			/* documentation endpoints */
			{
				path 		: '/documentation',
				component	: Documentation,
			},
			{
				path 		: '/documentation/:page',
				component	: Documentation,
			},
			/* ruleset endpoints */
			{
				path 		: '/rulesets',
				component 	: Rules
			},
			{
				name 		: 'rulesetEditor',
				path 		: '/rulesets/editor/:name',
				component 	: RulesEditor
			},
			/* security endpoints */
			{
				name 		: 'security',
				path 		: '/security',
				component	: Security
			},
			{
				name 		: 'securityScopeEditor',
				path 		: '/security/scope/:name',
				component 	: SecurityScopeEditor
			},
			{
				name 		: 'securityClientEditor',
				path 		: '/security/client/:id',
				component 	: SecurityClientEditor
			},
			{
				name 		: 'securityUserEditor',
				path 		: '/security/user/:id',
				component	: SecurityUserEditor
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