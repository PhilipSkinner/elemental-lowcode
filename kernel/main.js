const
	express 				= require("express"),
	cors 					= require("cors"),
	bodyParser 				= require("body-parser"),
	path 					= require("path"),
	fileUpload				= require("express-fileupload"),
	setup 					= require("./lib/setup")(),
	argParser 				= require("./lib/argParser")(),
	serviceRunner 			= require("./lib/serviceRunner")(),
	apiController 			= require("./controllers/apiController"),
	integrationsController 	= require("./controllers/integrationsController"),
	dataController 			= require("./controllers/dataController"),
	rulesController 		= require("./controllers/rulesController"),
	tokenHandler 			= require("../shared/tokenHandler"),
	certProvider 			= require("../shared/certProvider")(),
	websitesController 		= require("./controllers/websitesController"),
	securityController 		= require("./controllers/securityController"),
	indexController 		= require("./controllers/indexController"),
	serviceController 		= require("./controllers/serviceController"),
	queueController 		= require("./controllers/queueController"),
	intialSetup 			= require('./setup')();

const args = argParser.fetch();
let sourcesDir = args.sources || process.env.SOURCES_DIR || ".sources";
//setup all of our source folders
const directories = {
	identity 	: path.join(sourcesDir, "identity"),
	api 		: path.join(sourcesDir, "api"),
	integration : path.join(sourcesDir, "integration"),
	website 	: path.join(sourcesDir, "website"),
	data 		: path.join(sourcesDir, "data"),
	rules 		: path.join(sourcesDir, "rules"),
	services	: path.join(sourcesDir, "services"),
	queues 		: path.join(sourcesDir, "queues"),
};

const runApp = function() {
	const app = express();

	let keys = {
		public 	: certProvider.fetchPulicSigningKey(),
		private : certProvider.fetchPrivateSigningKey(),
	};

	const tHandler = tokenHandler(keys.public);

	//middleware
	app.use(cors({
		methods : 'GET,HEAD,PUT,PATCH,POST,DELETE'
	}));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended : false }));
	app.use(tHandler.tokenCheck.bind(tHandler));
	app.use(fileUpload({
	    createParentPath: true
	}));

	//set our process dir for the identity db
	process.env.DIR = directories.identity;

	//init our controllers
	dataController(app, directories.data);
	integrationsController(app, directories.integration);
	websitesController(app, directories.website);
	rulesController(app, directories.rules);
	securityController(app, directories.identity);
	apiController(app, directories.api);
	serviceController(app, directories.services);
	queueController(app, directories.queues);
	indexController(app, sourcesDir);

	app.listen(8001);

	const secret = [1,1,1,1,1,1,1].map(() => { return Math.random().toString(36); }).join("").replace(/[^a-z]+/g, "");

	//start up our services
	serviceRunner.runService("admin", 		"../admin/main.js", 		8002, "../admin", {
		SECRET 	: secret,
		SIG 	: keys.public
	});
	serviceRunner.runService("api", 		"../api/main.js", 			8003, directories.api, {
		SIG 	: keys.public
	});
	serviceRunner.runService("integration", "../integration/main.js", 	8004, directories.integration, {
		SIG 	: keys.public
	});
	serviceRunner.runService("interface", 	"../interface/main.js", 	8005, directories.website, {
		SIG 	: keys.public
	});
	serviceRunner.runService("storage", 	"../storage/main.js", 		8006, directories.data, {
		SIG 	: keys.public
	});
	serviceRunner.runService("rules", 		"../rules/main.js", 		8007, directories.rules, {
		SIG 	: keys.public
	});
	serviceRunner.runService("identity", 	"../identity/main.js", 		8008, directories.identity, {
		SECRET 		: secret,
		SIG			: keys.private,
		SIG_PUBLIC  : keys.public
	});
	serviceRunner.runService("messaging", 	"../messaging/main.js",		8009, directories.queues, {
		SIG 	: keys.public
	});
};

//determine if we should run the setup?
if (intialSetup.shouldRun(directories.identity)) {
	setup.setupEnvironment(directories).then(() => {
		intialSetup.runSetup(directories.identity).then(() => {
			runApp();
		});
	});
} else {
	setup.setupEnvironment(directories).then(() => {
		runApp();
	});
}