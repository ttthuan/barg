var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

// init server
var app = express();
app.use(morgan('dev'));
var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
    console.log('Server is running..');
});

var api = require('./controllers/APIController');

app.get('/', function (req, res) {
    var hello = 'Welcome to ATMService!';
    res.send(hello);
});

app.use('/api', api);