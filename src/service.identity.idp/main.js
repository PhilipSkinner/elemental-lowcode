const
    Provider 		    = require("oidc-provider"),
    cors                = require("cors"),
    clientProvider 	    = require("./lib/configProvider")(),
    path 			    = require("path"),
    set 			    = require("lodash/set"),
    express 		    = require("express"),
    bodyParser 		    = require("body-parser"),
    routes 			    = require("./lib/routes"),
    idm 			    = require("./lib/idm"),
    hostnameResolver    = require("../support.lib/hostnameResolver")(),
    passwordGrant       = require("./lib/passwordGrant")(),
    sass                = require("express-compile-sass"),
    hotreload           = require("../support.lib/hotReload")(),
    rateLimit           = require("express-rate-limit");

const { PORT = 3000, ISSUER = `${hostnameResolver.resolveIdentity()}` } = process.env;
let app = null;
let server = null;
let restarting = false;
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MILLISECONDS  || 200,
    max: process.env.RATE_LIMIT_MAX_REQUESTS_IN_WINDOW    || 50
});

if (!process.env.DIR) {
    throw new Error("Require dir to load configuration from.");
}

const startup = () => {
    return new Promise((resolve, reject) => {
        app = express();

        app.use(limiter);
        app.set("views", path.join(__dirname, "views"));
        app.set("view engine", "ejs");
        app.set("view options", {
            legacyInclude : true
        });
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : false }));
        app.use(cors({
            methods : "GET,HEAD,PUT,PATCH,POST,DELETE"
        }));
        app.use(express.static(path.join(__dirname, "./static"), {}));
        app.use(sass({
            root: __dirname,
            sourceMap: true,
            sourceComments: false,
            watchFiles: true,
            logToConsole: true
        }));

        clientProvider.fetchConfig(process.env.DIR, process.env.SECRET).then((config) => {
            const provider = new Provider(ISSUER, config);

            provider.registerGrantType("password", passwordGrant, ["client_id", "client_secret", "username", "password", "scope"], []);
            provider.proxy = true;

            //register our routes
            routes(app, provider);

            //register our idm
            idm(app);

            app.use(provider.callback);

            console.log(`application trying to listen on port ${PORT}....`);
            server = app.listen(PORT, () => {
                console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
                restarting = false;
            });
            server.on("error", (err) => {
                reject(err);
            });
        }).catch(reject);
    });
};

const reload = () => {
    if (!restarting) {
        return new Promise((resolve, reject) => {
            restarting = true;
            if (server) {
                console.log("Closing...");
                server.close(() => {
                    startup().then(resolve).catch(reject);
                });
            } else {
                startup().then(resolve).catch(reject);
            }
        });
    }
};

reload();

hotreload.watch(process.env.DIR + "**/*.json", reload, () => {
    restarting = false;
});