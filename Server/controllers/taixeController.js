var express = require('express');
var router = express.Router();
// init firebae
var firebase = require('../configs/FirebaseConfig');


//kiem tra dang nhap tai xe
router.get('/login/:username/:password', function (req, res) {
    var _username = req.params.username;
    var _password = req.params.password;
    
    var ref = firebase.app().database().ref("drivers");
    ref.once("value")
    .then(function (snap) {
        snap.forEach((driver) => {
            if (driver.child('username').val() == _username && driver.child('password').val() == _password) {
                console.log("Đăng nhập thành công");
                return
            }
            else {
                res.json("error")
            }
        });
    });
});
// api tai xe xac nhan  (app tai xe gui cho server)
router.get('/confirmcustomer/:customer/:driver', function (req, res) {
    var _customer = req.params.customer;
    var _driver = req.params.driver;

    var ref = firebase.app().database().ref("customers");
    ref.once("value")
        .then(function (snap) {
            snap.forEach((customer) => {
                if (customer.key == _customer) {
                    var driver = ref.child(_customer).child("request").child("drivers").child(_driver);
                    driver.update({
                        statusfordriver: 2
                    });
                    //Update cho tai xe
                    var driverref = firebase.app().database().ref("drivers");
                    driverref.once("value")
                        .then(function (snap) {
                            snap.forEach((driver) => {
                                if (driver.key == _driver) {
                                    var status = driverref.child(_driver);
                                    status.update({
                                        statusfordriver: 4
                                    });
                                    return;
                                }
                            });
                        });
                    return;
                }
            });
        });
    res.json("sucess");
});
module.exports = router;