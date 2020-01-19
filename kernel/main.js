const 
	express 		= require('express'),
	cors 			= require('cors'),
	bodyParser 		= require('body-parser'),
	serviceRunner 	= require('./lib/serviceRunner')(),
	dataController 	= require('./controllers/dataController');

const app = express();

//middleware
app.use(cors());
app.use(bodyParser.json());

//init our controllers
dataController(app);

app.listen(8001);

//start up our services
serviceRunner.runService('admin', 		'../admin/main.js', 		8002, '../admin');
serviceRunner.runService('api', 		'../api/main.js', 			8003, '.sources/api');
serviceRunner.runService('integration', '../integration/main.js', 	8004, '.sources/integration');
serviceRunner.runService('interface', 	'../interface/main.js', 	8005, '.sources/website');
serviceRunner.runService('storage', 	'../storage/main.js', 		8006, '.sources/data');