window.getToken = function() {
	let token = null;
	document.cookie.split(";").forEach((c) => {
		let p = c.split("=");
		if (p[0].trim() === "token") {
			token = p[1].trim();
		}
	});

	return token;
};

window.hasRole = function(role) {
	const token = window.getToken();

	try {
		const claims = JSON.parse(atob(token.split('.')[1]));
		return claims.roles.indexOf(role) !== -1;
	} catch(e) {
		return false;
	}
};

window.logout = function() {
	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	location.href = "/";
};

window.generateGuid = function() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    	var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    	return v.toString(16);
	});
};

window.templates.fetchTemplates().then(() => {
	const pages = [
		"js/pages/home.js",
		"js/pages/apis.js",
		"js/pages/apiEditor.js",
		"js/pages/apiDetails.js",
		"js/pages/data.js",
		"js/pages/dataTypeDetails.js",
		"js/pages/dataTypeEditor.js",
		"js/pages/integrations.js",
		"js/pages/integrationsEditor.js",
		"js/pages/integrationDetails.js",
		"js/pages/websites.js",
		"js/pages/websitesEditor.js",
		"js/pages/documentation.js",
		"js/pages/rules.js",
		"js/pages/rulesEditor.js",
		"js/pages/ruleDetails.js",
		"js/pages/security.js",
		"js/pages/securityClientEditor.js",
		"js/pages/securityScopeEditor.js",
		"js/pages/securityUserEditor.js",
		"js/pages/packager.js",
		"js/pages/services.js",
		"js/pages/servicesEditor.js",
		"js/pages/nodeModules.js",
		"js/pages/messaging.js",
		"js/pages/queueDetails.js",
		"js/pages/queueEditor.js",
		"js/pages/monitor.js",
		"js/pages/tagsetEditor.js"
	];

	const loadPage = (file) => {
		return new Promise((resolve, reject) => {
			var elem = document.createElement("script");
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
		};

		return doNext();
	};

	loadPages().then(() => {
		const routes = [
			{
				path 		: "/",
				component 	: window.Home
			},
			{
				path 		: "/monitor",
				component 	: window.Monitor
			},
			/* integrations endpoints */
			{
				path 		: "/integrations",
				component 	: window.Integrations
			},
			{
				name 		: "integrationEditor",
				path 		: "/integrations/editor/:name",
				component 	: window.IntegrationsEditor
			},
			{
				name 		: "integrationDetails",
				path 		: "/integrations/details/:name",
				component	: window.IntegrationDetails
			},
			/* api endpoints */
			{
				path 		: "/apis",
				component 	: window.Apis
			},
			{
				name 		: "apiEditor",
				path 		: "/apis/editor/:name",
				component 	: window.apiEditor
			},
			{
				name 		: "apiDetails",
				path 		: "/apis/details/:name",
				component	: window.apiDetails
			},
			/* data type endpoints */
			{
				path 		: "/data",
				component 	: window.Data
			},
			{
				name 		: "dataTypeEditor",
				path 		: "/data/editor/:type",
				component 	: window.DataTypeEditor
			},
			{
				name 		: "dataTypeDetails",
				path 		: "/data/details/:type",
				component 	: window.DataTypeDetails,
			},
			/* website/interface endpoints */
			{
				path 		: "/websites",
				component 	: window.Websites
			},
			{
				name		: "websiteEditor",
				path 		: "/websites/editor/:name",
				component 	: window.WebsiteEditor
			},
			{
				name 		: "tagsetEditor",
				path 		: "/websites/tagsets/editor/:name",
				component 	: window.TagsetEditor
			},
			/* documentation endpoints */
			{
				path 		: "/documentation",
				component	: window.Documentation,
			},
			{
				path 		: "/documentation/*",
				component	: window.Documentation,
			},
			/* ruleset endpoints */
			{
				path 		: "/rulesets",
				component 	: window.Rules
			},
			{
				name 		: "rulesetEditor",
				path 		: "/rulesets/editor/:name",
				component 	: window.RulesEditor
			},
			{
				name 		: "rulesetDetails",
				path 		: "/rulesets/:name",
				component	: window.RuleDetails
			},
			/* security endpoints */
			{
				name 		: "security",
				path 		: "/security",
				component	: window.Security
			},
			{
				name 		: "securityScopeEditor",
				path 		: "/security/scope/:name",
				component 	: window.SecurityScopeEditor
			},
			{
				name 		: "securityClientEditor",
				path 		: "/security/client/:id",
				component 	: window.SecurityClientEditor
			},
			{
				name 		: "securityUserEditor",
				path 		: "/security/user/:name",
				component	: window.SecurityUserEditor
			},
			/* packager endpoints */
			{
				path 		: "/packager",
				component 	: window.Packager
			},
			/* IoC services */
			{
				path 		: "/services",
				component 	: window.Services
			},
			{
				path 		: "/services/editor/:name",
				name 		: "servicesEditor",
				component 	: window.ServicesEditor
			},
			/* Node Modules */
			{
				path 		: "/nodemodules",
				component	: window.NodeModules
			},
			/* Messaging */
			{
				path 		: "/messaging",
				component 	: window.Messaging
			},
			{
				path 		: "/messaging/editor/:name",
				name 		: "queueEditor",
				component 	: window.QueueEditor
			},
			{
				path 		: "/messaging/:name",
				name 		: "queueDetails",
				component 	: window.QueueDetails
			}
		];

		window.Vue.component("modal-error", {
			template : "#template-modal-error",
			props : [
				"title",
				"visible"
			]
		});

		window.Vue.component("alert", {
			template : "#template-alert",
			props : [
				"text",
				"visible"
			]
		});

		window.Vue.component("navigation", {
			template : "#template-navigation",
			props : [
				"title",
				"navitems"
			]
		});

		window.Vue.component("swaggerdef", {
			template : "#template-swagger-def",
			props : [
				"uri"
			],
			mounted  : function() {
				delete(window.swaggerUI);

				setTimeout(() => {
					const ui = SwaggerUIBundle({
						dom_id 					: "#swagger-ui",
						deepLinking 			: true,
						displayRequestDuration 	: true,
						presets 				: [
							SwaggerUIBundle.presets.apis,
							SwaggerUIStandalonePreset
						],
						url 		 			: this._props.uri,
						validatorUrl			: "https://validator.swagger.io/validator",
						onComplete 				: () => {
							window.swaggerUI.preauthorizeApiKey("bearerToken", window.getToken());
						}
					});

					window.swaggerUI = ui;
				}, 250);
			}
		});

    	window.Vue.component("permissions", {
			data : function() {
				const allowed = this.roles.reduce((s, a) => {
					return s || window.hasRole(a);
				}, false);

				return {
					missingRoles : !allowed
				};
			},
			template : "#template-permissions",
			props : [
				"roles"
			]
		});

		window.Vue.component("confirm", {
			methods : {
				_onConfirm : function() {
					if (this._props.onConfirm && typeof(this._props.onConfirm) === "function") {
						this._props.onConfirm();
					}
					this.visible = false;
				},
				_onCancel : function() {
					if (this._props.onCancel && typeof(this._props.onCancel) === "function") {
						this._props.onCancel();
					}
					this.visible = false;
				}
			},
			template : "#template-confirm",
			props : [
				"title",
				"message",
				"onConfirm",
				"onCancel",
				"visible"
			]
		});

		window.Vue.prototype.window = window;

		window.router = new VueRouter({
			routes : routes,
		});

		const app = new Vue({
			router
		}).$mount("#app");
	});
});