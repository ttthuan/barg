var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

var configs = require('./config');
var taikhoanController = require('./controllers/taikhoanController');
var nganhangController = require('./controllers/nganhangController');

app.use('/api/accounts', taikhoanController);
app.use('/api/banks', nganhangController);

app.get('/', function (req, res) {
	res.send("hello client");
})

app.listen(configs.PORT, ()=>{
	console.log("api listening on port: " + configs.PORT);
})