const
	express 		= require('express'),
	cors 			= require('cors'),
	bodyParser 		= require('body-parser');

const app = express();
const backingStore = require('./lib/stores/fsStore')();
const storageEngine = require('./lib/storageEngine')(backingStore, app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use((res, req, next) => {
	console.log("Request on", res.path);
	next();
});

storageEngine.init(process.env.DIR).then(() => {
	app.listen(process.env.PORT);
});

