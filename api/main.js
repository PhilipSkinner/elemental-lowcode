const 
	express 		= require('express'),
	tokenHandler 	= require('../shared/tokenHandler'),
	bodyParser 		= require('body-parser');

const app = express();
const apiService = require('./lib/apiService')(app);
const tHandler = tokenHandler(process.env.SIG);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(tHandler.tokenCheck.bind(tHandler));

if (!process.env.DIR) {
	process.env.DIR = './example';
}

if (!process.env.PORT) {
	process.env.PORT = 5000;
}

//load our APIs
apiService.init(process.env.DIR).then(() => {
	app.listen(process.env.PORT);
});