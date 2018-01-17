var express = require('express');
var router = express.Router();
var util = require('util');

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

// api tìm tài xế gần nhất
router.post('/finddrivernearest', function (req, res) {
    var phone = req.body.phone;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var driverDatas = [];
    var N = null;
    var distance;
    var listDriver = [];
    var lenDriver = 0;

    var numberNRef = firebase.database().ref('configs/constants/n');
    numberNRef.once('value', function(n){
        //console.log("DEBUG " + "number N " + n.val());
        N = n.val();
    });

    var driverRef = firebase.database().ref('drivers');
    driverRef.once('value', function(drivers){
        //res.json(drivers);
        driverDatas = drivers;

        drivers.forEach(function(driver){
            if(driver.val().statusfordriver == 3){
                lenDriver++;
            }
        });

        var origin = {
            lat: lat,
            lng: lng
        }

        drivers.forEach(function(driver){
            // check trang thai cho driver
            if(driver.val().statusfordriver == 3){ // trang thai dang san sang
                DriectionAPI.GetDirection(origin, driver.val().locations)
                .then(function(response){
                    var status = util.inspect(JSON.stringify(response.data.status));
                    console.log(status);

                    if(status != 'status'){
                        distance = util.inspect(JSON.stringify(response.data.routes[0].legs[0].distance.value));
                    
                        var item = {
                            key: driver.key,
                            distance: distance
                        }

                        listDriver.push(item);

                        console.log(driver.key + ' ' + distance);
                        console.log(listDriver.length + ' ' + lenDriver);

                        if(listDriver.length == lenDriver){
                            listDriver.sort(function(a, b){
                                return parseFloat(a.distance) - parseFloat(b.distance);
                            })
                            console.log("sort");

                            var driversRef = firebase.database().ref('customers/'  + phone + '/request/drivers');
                            var i = 0;
                            var Solan = listDriver.length > N ? N:listDriver.length;
                            var postData = {
                                statusfordriver: 6
                            };

                            var updates = {};

                            for(i = 0; i < Solan; i++){
                                updates['/'+listDriver[i].key] = postData;
                            }
                            driversRef.update(updates);

                            // listDriver.forEach(function(item){
                            //     console.log('sort item ' + item.distance);
                            // });
                        }
                    }
                })
                .catch(function(error){
                    console.log("LOI LAY DISTANCE TREN GOOGLE " + error);
                });
            }
        });

        
    });

    res.json('success');
});

module.exports = router;