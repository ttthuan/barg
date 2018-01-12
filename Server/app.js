var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var api = require('./controllers/APIController');
var driverController = require('./controllers/DriverController');

// init server
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.use('/api', api);
app.use('/driver', driverController);

app.get('/', function (req, res) {
    var hello = 'Welcome to BargService!';
    res.send(hello);
});

var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
    console.log('DEBUG: Server is running.. on port ' +port);
});