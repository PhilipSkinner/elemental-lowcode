const
	Provider 		= require("oidc-provider"),
	clientProvider 	= require("./lib/configProvider")(),
	path 			= require("path"),
	set 			= require("lodash/set"),
	express 		= require("express"),
	bodyParser 		= require("body-parser"),
	routes 			= require("./lib/routes"),
	idm 			= require('./lib/idm');

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());

let server;

clientProvider.fetchConfig(process.env.DIR, process.env.SECRET).then((config) => {
  const provider = new Provider(ISSUER, config);

  //register our routes
  routes(app, provider);

  //register our idm
  idm(app);

  app.use(provider.callback);
  server = app.listen(PORT, () => {
    console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
  });
});