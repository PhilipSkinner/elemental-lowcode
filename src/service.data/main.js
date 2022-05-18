const
    express 		= require('express'),
    cors 			= require('cors'),
    bodyParser 		= require('body-parser'),
    tokenHandler 	= require('../support.lib/tokenHandler'),
    hotreload 		= require('../support.lib/hotReload')();

let app = null;
let server = null;
let restarting = false;
let tHandler = tokenHandler({
    ignore : [
        /\/\w+\/.definition/i
    ]
});

if (!process.env.DIR) {
    throw new Error('Require dir to load configuration from.');
}


const startup = () => {
    app = express();

    const storageEngine = require('./lib/storageEngine')(app);

    app.use(cors({
        exposedHeaders : [
            'location',
            'etag',
            'content-type'
        ]
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : false }));
    app.use((res, req, next) => {
        console.log('Request on', res.path);
        next();
    });
    app.use(tHandler.tokenCheck.bind(tHandler));

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