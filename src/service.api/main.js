const
    express 		= require('express'),
    path 			= require('path'),
    tokenHandler 	= require('../support.lib/tokenHandler'),
    hotreload 		= require('../support.lib/hotReload')(),
    bodyParser 		= require('body-parser'),
    rateLimit       = require('express-rate-limit');

let app = null;
let server = null;
let restarting = false;
const tHandler = tokenHandler();
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MILLISECONDS  || 200,
    max: process.env.RATE_LIMIT_MAX_REQUESTS_IN_WINDOW    || 50
});

if (!process.env.DIR) {
    throw new Error('Require dir to load configuration from.');
}

if (!process.env.PORT) {
    process.env.PORT = 5000;
}

const startup = () => {
    app = express();    

    app.use(limiter);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : false }));
    app.use(tHandler.tokenCheck.bind(tHandler));

    const apiService = require('./lib/apiService')(app);

    //load our APIs
    apiService.init(process.env.DIR).then(() => {
        console.log('Hotreload complete');
        server = app.listen(process.env.PORT);
        restarting = false;
    });
};

const reload = () => {
    if (!restarting) {
        restarting = true;
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