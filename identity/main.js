const
	Provider 		     = require("oidc-provider"),
	clientProvider 	 = require("./lib/configProvider")(),
	path 			       = require("path"),
	set 			       = require("lodash/set"),
	express 		     = require("express"),
	bodyParser 		   = require("body-parser"),
	routes 			     = require("./lib/routes"),
	idm 			       = require('./lib/idm'),
  hostnameResolver = require("../shared/hostnameResolver")(),
  passwordGrant    = require('./lib/passwordGrant')(),
  hotreload        = require("../shared/hotReload")();

const { PORT = 3000, ISSUER = `${hostnameResolver.resolveIdentity()}` } = process.env;
let server = null;
let restarting = false;

const startup = () => {
  const app = express();
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(bodyParser.json());

  clientProvider.fetchConfig(process.env.DIR, process.env.SECRET).then((config) => {
    const provider = new Provider(ISSUER, config);

    provider.registerGrantType("password", passwordGrant, ["client_id", "client_secret", "username", "password", "scope"], []);

    //register our routes
    routes(app, provider);

    //register our idm
    idm(app);

    app.use(provider.callback);
    server = app.listen(PORT, () => {
      console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
      restarting = false;
    });
  });
};

const reload = () => {
  if (!restarting) {
    restarting = true;
    if (server) {
      console.log("Closing...");
      server.close(startup);
    } else {
      startup();
    }
  }
};

hotreload.watch(process.env.DIR + '**/*.json', reload);