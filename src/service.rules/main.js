const
    express 		= require('express'),
    bodyParser 		= require('body-parser'),
    tokenHandler 	= require('../support.lib/tokenHandler'),
    hotreload 		= require('../support.lib/hotReload')();

let app = null;
let server = null;
let restarting = false;
const tHandler = tokenHandler();

if (!process.env.DIR) {
    throw new Error('Require dir to load configuration from.');
}

const startup = () => {
    app = express();
    app.use(bodyParser.json());
    app.use(tHandler.tokenCheck.bind(tHandler));
    let service = require('./lib/rulesService')(app);

    service.init(process.env.DIR).then(() => {
        server = app.listen(process.env.PORT, () => {
            console.log('Hotreload complete');
            restarting = false;
        });
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