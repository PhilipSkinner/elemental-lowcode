const
    express 		= require('express'),
    cors 			= require('cors'),
    bodyParser 		= require('body-parser'),
    tokenHandler 	= require('../support.lib/tokenHandler'),
    hotreload 		= require('../support.lib/hotReload')(),
    rateLimit       = require('express-rate-limit');

let app = null;
let server = null;
let restarting = false;
const tHandler = tokenHandler({
    ignore : [
        /\/\w+\/.definition/i
    ]
});
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MILLISECONDS  || 200,
    max: process.env.RATE_LIMIT_MAX_REQUESTS_IN_WINDOW    || 50
});

if (!process.env.DIR) {
    throw new Error('Require dir to load configuration from.');
}


const startup = () => {
    app = express();    
    app.use(limiter);
    app.use(cors({
        exposedHeaders : [
            'location',
            'etag',
            'content-type'
        ]
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : false }));    
    app.use(tHandler.tokenCheck.bind(tHandler));

    const storageEngine = require('./lib/storageEngine')(app);

    storageEngine.init(process.env.DIR).then(() => {
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

hotreload.watch(process.env.DIR, reload, () => {
    restarting = false;
});