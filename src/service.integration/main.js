const
    express 		= require('express'),
    tokenHandler 	= require('../support.lib/tokenHandler'),
    hotreload 		= require('../support.lib/hotReload')();

let app = null;
let server = null;
let restarting = false;
let tHandler = tokenHandler();

if (!process.env.DIR) {
    throw new Error('Require dir to load configuration from.');
}

const startup = () => {
    app = express();
    app.use(tHandler.tokenCheck.bind(tHandler));
    let integrationService = require('./lib/integrationService')(app);

    //now init our integrations
    integrationService.init(process.env.DIR).then(() => {
        //and run our app
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