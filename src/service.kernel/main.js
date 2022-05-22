const
    express 				= require('express'),
    cors 					= require('cors'),
    bodyParser 				= require('body-parser'),
    path 					= require('path'),
    fileUpload				= require('express-fileupload'),
    setup 					= require('./lib/setup')(),
    argParser 				= require('./lib/argParser')(),
    serviceRunner 			= require('./lib/serviceRunner')(),
    apiController 			= require('./controllers/apiController'),
    integrationsController 	= require('./controllers/integrationsController'),
    dataController 			= require('./controllers/dataController'),
    rulesController 		= require('./controllers/rulesController'),
    tokenHandler 			= require('../support.lib/tokenHandler'),
    websitesController 		= require('./controllers/websitesController'),
    securityController 		= require('./controllers/securityController'),
    indexController 		= require('./controllers/indexController'),
    serviceController 		= require('./controllers/serviceController'),
    queueController 		= require('./controllers/queueController'),
    logsController 			= require('./controllers/logsController'),
    secretsProvider 		= require('./lib/secrets'),
    hotreload 				= require('../support.lib/hotReload')(),
    initialSetup 			= require('./setup')();

const args = argParser.fetch();
let restarting = false;
let sourcesDir = args.sources || process.env.SOURCES_DIR || '.sources';

//setup all of our source folders
const directories = {
    identity 	: path.relative(process.cwd(), path.join(sourcesDir, 'identity')),
    api 		: path.relative(process.cwd(), path.join(sourcesDir, 'api')),
    integration : path.relative(process.cwd(), path.join(sourcesDir, 'integration')),
    website 	: path.relative(process.cwd(), path.join(sourcesDir, 'website')),
    data 		: path.relative(process.cwd(), path.join(sourcesDir, 'data')),
    rules 		: path.relative(process.cwd(), path.join(sourcesDir, 'rules')),
    services	: path.relative(process.cwd(), path.join(sourcesDir, 'services')),
    queues 		: path.relative(process.cwd(), path.join(sourcesDir, 'queues')),
    secrets 	: path.relative(process.cwd(), path.join(sourcesDir, 'secrets')),
    secretStore : path.relative(process.cwd(), path.join(sourcesDir, '.secrets')),
};

//setup our ports
const ports = {
    kernel 		: process.env.KERNEL_PORT 		|| 8001,
    admin 		: process.env.ADMIN_PORT 		|| 8002,
    api 		: process.env.API_PORT			|| 8003,
    integration : process.env.INTEGRATION_PORT 	|| 8004,
    website 	: process.env.INTERFACE_PORT  	|| 8005,
    data 		: process.env.STORAGE_PORT 		|| 8006,
    rules 		: process.env.RULES_PORT 		|| 8007,
    identity 	: process.env.IDENTITY_PORT 	|| 8008,
    queues 		: process.env.QUEUE_PORT 		|| 8009,
};

const reload = function() {
    if (!restarting) {
        restarting = true;
        startServices();
    }
};

const startServices = function() {
    const secret = [1,1,1,1,1,1,1].map(() => { return Math.random().toString(36); }).join('').replace(/[^a-z]+/g, '');

    //load our secrets and scope per app
    secretsProvider(directories.secrets, directories.secretStore).initSecrets(secret).then((secrets) => {
        //start up our services
        serviceRunner.runService('admin', 		'../ui.editor/main.js', 		    ports.admin, 		'../ui.editor', secrets.admin);
        serviceRunner.runService('api', 		'../service.api/main.js', 			ports.api, 			directories.api, secrets.api);
        serviceRunner.runService('integration', '../service.integration/main.js', 	ports.integration, 	directories.integration, secrets.integration);
        serviceRunner.runService('interface', 	'../service.interface/main.js', 	ports.website, 		directories.website, secrets.website);
        serviceRunner.runService('storage', 	'../service.data/main.js', 			ports.data, 		directories.data, secrets.data);
        serviceRunner.runService('rules', 		'../service.rules/main.js', 		ports.rules, 		directories.rules, secrets.rules);
        serviceRunner.runService('identity', 	'../service.identity.idp/main.js', 	ports.identity, 	directories.identity, secrets.identity);
        serviceRunner.runService('messaging', 	'../service.messaging/main.js',		ports.queues, 		directories.queues, secrets.queues);

        restarting = false;
    });
};

const runApp = function() {
    const app = express();

    //swap the details around
    const tHandler = tokenHandler();

    //middleware
    app.use(cors({
        methods : 'GET,HEAD,PUT,PATCH,POST,DELETE'
    }));
    app.use(bodyParser({limit: '50mb'}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : false }));
    app.use(bodyParser.text());
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
    securityController(app, directories.identity, directories.secrets, directories.secretStore);
    apiController(app, directories.api);
    serviceController(app, directories.services);
    queueController(app, directories.queues);
    logsController(app, sourcesDir);
    indexController(app, sourcesDir);

    app.listen(ports.kernel);

    hotreload.watch(directories.secretStore, reload, () => {
  		restarting = false;
    });
};

//determine if we should run the setup?
if (initialSetup.shouldRun(directories.identity)) {
    setup.setupEnvironment(directories).then(() => {
        initialSetup.runSetup(directories.identity).then(() => {
            runApp();
        });
    });
} else {
    setup.setupEnvironment(directories).then(() => {
        runApp();
    });
}

//our sigint handler
process.on('SIGINT', () => {
    serviceRunner.stopService('admin');
    serviceRunner.stopService('api');
    serviceRunner.stopService('integration');
    serviceRunner.stopService('interface');
    serviceRunner.stopService('storage');
    serviceRunner.stopService('rules');
    serviceRunner.stopService('identity');
    serviceRunner.stopService('messaging');

    setTimeout(() => {
        process.exit();
    }, 100);
});