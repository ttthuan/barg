

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
router.get('/customers/:phone/:name/:addressold/:typeofcar/:timereq/:statusforreq', function (req, res) {
    var phone1 = req.params.phone;
    var name1 = req.params.name;
    var addressold1 = req.params.addressold;
    var typeofcar1 = req.params.typeofcar;
    var timereq1 = req.params.timereq;
    var statusforreq1 = req.params.statusforreq;
    var ref = firebase.app().database().ref("customers");
    ref.once("value")
        .then(function (snap) {
            var datontai = false;
            snap.forEach((customer) => {
                if (customer.key == phone1) {
                    datontai = true;
                    return;
                }
            });
            if (datontai == false) {
                var customersRef = ref.child(phone1);
                customersRef.set(
                    {
                        histories: "null",
                        name: name1,
                        request: {
                            address: addressold1,
                            addressold: addressold1,
                            statusforreq: statusforreq1,
                            timereq: timereq1,
                            typeofcar:typeofcar1
                        },
                        
                    })
            }
            if (datontai == true) {
                var customersRef = ref.child(phone1);
                customersRef.update({
                    request: {
                        address: addressold1,
                        addressold: addressold1,
                        statusforreq: statusforreq1,
                        timereq: timereq1,
                        typeofcar:typeofcar1
                    }
                });
            }
        });
});
module.exports = router;