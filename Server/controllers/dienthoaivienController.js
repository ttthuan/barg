var express = require('express');
var router = express.Router();
// init firebae
var firebase = require('../configs/FirebaseConfig');


// api dành cho điện thoại viện
router.get('/customers/:phone/:name/:addressold/:typeofcar/:timereq/:statusforreq', function (req, res) {
    var phone1 = req.params.phone;
    var name1 = req.params.name;
    var addressold1 = req.params.addressold;
    var typeofcar1 = req.params.typeofcar;
    var timereq1 = req.params.timereq;
    var statusforreq1 = req.params.statusforreq;
    console.log("debug " + name1);
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
                            typeofcar: typeofcar1,
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
                        typeofcar: typeofcar1,
                    }
                });
            }
        });
    res.json("sucess");
});

module.exports = router;