const
    express 		= require('express'),
    path 			= require('path'),
    tokenHandler 	= require('../support.lib/tokenHandler'),
    hotreload 		= require('../support.lib/hotReload')();
bodyParser 		= require('body-parser');

let app = null;
let server = null;
let restarting = false;
let tHandler = tokenHandler();

if (!process.env.DIR) {
    throw new Error('Require dir to load configuration from.');
}

if (!process.env.PORT) {
    process.env.PORT = 5000;
}

let queueService = null;

const startup = () => {
    app = express();

    queueService = require('./lib/queueService')(app);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : false }));
    app.use(tHandler.tokenCheck.bind(tHandler));

    queueService.init(process.env.DIR).then(() => {
        console.log('Hotreload complete');
        console.log(process.env.PORT);
        server = app.listen(process.env.PORT);
        restarting = false;
    });
};

const reload = () => {
    if (!restarting) {
        restarting = true;
        if (queueService && queueService.terminateInstances) {
            queueService.terminateInstances();
        }

        if (server) {
            console.log('Closing...');
            server.close(startup);
        } else {
            startup();
        }
    }
};

hotreload.watch([
    process.env.DIR,
    path.join(process.env.DIR, '../identity/**/*.json')
], reload, () => {
    restarting = false;
});