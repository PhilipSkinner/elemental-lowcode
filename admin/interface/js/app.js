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
		path 		: '/websites',
		component 	: Websites
	}
];

const router = new VueRouter({
	routes : routes
});

const app = new Vue({
	router
}).$mount('#app');