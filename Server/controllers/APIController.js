

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

// api dành cho điện thoại viện
router.get('/customers', function (req, res) {
    var ref = firebase.app().database().ref("customers");
    ref.once("value")
        .then(function (snap) {
            var datontai = false;
            snap.forEach((customer) => {
                if (customer.key == "0123456798") {
                    datontai = true;
                    return;
                }
            });
            console.log('oj');
            if (datontai == false) {
                var customersRef = ref.child("0123456798");
                customersRef.set(
                    {
                        histories: "null",
                        name: "totoro",
                        request: {
                            address: "227 nguyễn văn cừ, p10",
                            addressold: "227 nguyễn văn cừ, p10"
                        }
                    })
            }
            console.log(datontai);
            if (datontai == true) {
                console.log("Da vao If");
                var customersRef = ref.child("0123456798");
                customersRef.update({
                    request: {
                        address: "228 nguyễn văn cừ, p10",
                        addressold: "228 nguyễn văn cừ, p10"
                    }
                });
            }
        });
});
module.exports = router;