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
            var sucess = false;
            snap.forEach((driver) => {
                if (driver.child('username').val() == _username && driver.child('password').val() == _password) {
                    var status = ref.child(driver.key);
                    status.update({
                        statusfordriver: 3
                    });
                    sucess = true;
                    res.statusCode = 200;
                    res.json("Đăng nhập thành công");
                    return;
                }
            });
            if (sucess == false) {
                res.statusCode = 504;
                res.json("Đăng nhập thất bại");
                return;
            }
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
                    //Update trang thai request cua khach hang 
                    var requestref = ref.child(_customer).child("request");
                    requestref.update({
                        statusforreq: 4
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

// api tai xe khong xac nhan  (app tai xe gui cho server)
router.get('/unconfirmcustomer/:customer/:driver', function (req, res) {
    var _customer = req.params.customer;
    var _driver = req.params.driver;
    var _drivers = [];
    //Update thong tin tai xe tu choi
    var refDrivers = firebase.app().database().ref("drivers");
    var driverRef = refDrivers.child(_driver);
    driverRef.update({
        mycustomer: "null"
    });
    //Tự động chọn tài xế mới cho khách hàng
    var ref = firebase.app().database().ref("customers");
    ref.once("value")
        .then(function (snap) {
            snap.forEach((customer) => {
                if (customer.key == _customer) {
                    var driver = ref.child(_customer).child("request").child("drivers").child(_driver);
                    driver.update({
                        statusfordriver: 1
                    });
                    var driversref = ref.child(_customer).child("request").child("drivers");

                    driversref.once("value")
                        .then(function (snap) {
                            snap.forEach((drivers) => {
                                if (drivers.key != _driver && drivers.val().statusfordriver == 6) {
                                    _drivers.push(drivers.key);
                                    //console.log(drivers.key);
                                }
                            });
                            return _drivers;
                        })
                        .then((r) => {
                            if (_drivers.length == 0) {
                                var customerref = firebase.app().database().ref("customers").
                                    child(_customer).child("request");
                                customerref.update({
                                    statusforreq: 3
                                })
                                return;
                            }
                            console.log(_drivers[0]);
                            var driversecond = _drivers[0];
                            // lấy ra thông tin khách hàng
                            var refCustomers = firebase.app().database().ref("customers");
                            var _mycustomer;
                            refCustomers.once("value")
                                .then(function (snap) {
                                    snap.forEach((customer) => {
                                        if (customer.key == _customer) {
                                            // update khách hàng cho tài xế.
                                            var refDrivers = firebase.app().database().ref("drivers");
                                            var driverRef = refDrivers.child(driversecond);
                                            var update = {};
                                            var newMycustomer = {
                                                phone: customer.key,
                                                address: customer.child('request').val().addressold,
                                                name: customer.val().name
                                            };
                                            update['\mycustomer'] = newMycustomer
                                            driverRef.update(update);
                                            return;
                                        }
                                    })
                                })
                        });
                    return;
                }
            });
        });
    res.json("sucess");
});
module.exports = router;