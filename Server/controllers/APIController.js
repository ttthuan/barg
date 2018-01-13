var express = require('express');

// init firebae
var firebase = require('../configs/FirebaseConfig');


var router = express.Router();

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


// api chon xe cho khach (app 2 gui len makh va maxe)

router.get('/choosedriver/:customer/:driver', function (req, res) {
    var _customer = req.params.customer;
    var _driver = req.params.driver;

    var ref = firebase.app().database().ref("drivers");
    ref.once("value")
        .then(function (snap) {
            var datontai = false;
            snap.forEach((driver) => {
                if (driver.key == _driver) {
                    datontai = true;
                    return;
                }
            });
            if (datontai == false) {
                res.statusCode = 504;
            }
            if (datontai == true) {
                // lấy ra thông tin khách hàng
                var refCustomers = firebase.app().database().ref("customers");
                var _mycustomer;
                refCustomers.once("value")
                    .then(function (snap) {
                        snap.forEach((customer) => {
                            if (customer.key == _customer) {
                                // update khách hàng cho tài xế.
                                var driverRef = ref.child(_driver);
                                var update = {};
                                var newMycustomer ={
                                    phone: customer.key,
                                    address:  customer.child('request').val().addressold,
                                    name: customer.val().name
                                };

                                update['\mycustomer'] = newMycustomer
                                driverRef.update(update);
                                return;
                            }
                        })
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        });
    res.json("sucess");
});

module.exports = router;