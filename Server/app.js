var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');


var dienthoaivienApi = require('./controllers/dienthoaivienController');
var dinhviApi = require('./controllers/dinhviController');
var taixeApi = require('./controllers/taixeController');
var trangthaidiemApi = require('./controllers/trangthaidiemController');

// init server
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.use('/dienthoaivien', dienthoaivienApi);
app.use('/dinhvi', dinhviApi);
app.use('/taixe', taixeApi);
app.use('/trangthaidiem', trangthaidiemApi);

app.get('/', function (req, res) {
    var hello = 'Welcome to BargService!';
    res.send(hello);
});

var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
    console.log('DEBUG: Server is running.. on port ' +port);
});