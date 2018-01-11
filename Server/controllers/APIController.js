var express = require('express');

// init firebae
var firebase = require("firebase");
var config = {
	apiKey: "AIzaSyAARBsG4HnBEqtCGFTDpR-BL7HLmBKD7TQ",
	authDomain: "barg-firebase.firebaseapp.com",
	databaseURL: "https://barg-firebase.firebaseio.com",
	projectId: "barg-firebase",
	storageBucket: "barg-firebase.appspot.com",
	messagingSenderId: "573103357657"
 };

firebase.initializeApp(config);

var router = express.Router();

// lấy danh sách khách hàng.
router.get('/customers', function (req, res) {
    var ref = firebase.app().database().ref("customers");
    ref.once("value")
        .then(function (snap) {
            snap.forEach(function(customer){
                console.log(customer.key);
            });
        });
});

module.exports = router;