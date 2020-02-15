const
	express 				= require('express'),
	cors 					= require('cors'),
	bodyParser 				= require('body-parser'),
	serviceRunner 			= require('./lib/serviceRunner')(),
	integrationsController 	= require('./controllers/integrationsController'),
	dataController 			= require('./controllers/dataController'),
	rulesController 		= require('./controllers/rulesController'),
	tokenHandler 			= require('../shared/tokenHandler'),
	certProvider 			= require('../shared/certProvider')(),
	websitesController 		= require('./controllers/websitesController');

const app = express();

let keys = {
	public 	: certProvider.fetchPulicSigningKey(),
	private : certProvider.fetchPrivateSigningKey(),
};

const tHandler = tokenHandler(keys.public);

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(tHandler.tokenCheck.bind(tHandler));

//init our controllers
dataController(app);
integrationsController(app);
websitesController(app);
rulesController(app);

app.listen(8001);

const secret = [1,1,1,1,1,1,1].map(() => { return Math.random().toString(36); }).join('').replace(/[^a-z]+/g, '');

//start up our services
serviceRunner.runService('admin', 		'../admin/main.js', 		8002, '../admin', {
	SECRET 	: secret,
	SIG 	: keys.public
});
serviceRunner.runService('api', 		'../api/main.js', 			8003, '.sources/api', {
	SIG 	: keys.public
});
serviceRunner.runService('integration', '../integration/main.js', 	8004, '.sources/integration', {
	SIG 	: keys.public
});
serviceRunner.runService('interface', 	'../interface/main.js', 	8005, '.sources/website', {
	SIG 	: keys.public
});
serviceRunner.runService('storage', 	'../storage/main.js', 		8006, '.sources/data', {
	SIG 	: keys.public
});
serviceRunner.runService('rules', 		'../rules/main.js', 		8007, '.sources/rules', {
	SIG 	: keys.public
});
serviceRunner.runService('identity', 	'../identity/main.js', 		8008, '.sources/identity', {
	SECRET 	: secret,
	SIG		: keys.private
});