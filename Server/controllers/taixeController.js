var express = require('express');

var firebase = require('../configs/FirebaseConfig');
var DriectionAPI = require('../configs/GoogleMap');
var util = require('util');

var router = express.Router();


//kiem tra dang nhap tai xe
router.get('/login/:username/:password', function (req, res) {
    var _username = req.params.username;
    var _password = req.params.password;

    var ref = firebase.app().database().ref("drivers");
    ref.once("value")
        .then(function (snap) {
            var sucess = false;
            snap.forEach((driver) => {
                if (driver.key == _username && driver.child('password').val() == _password) {
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
                res.statusCode = 401;
                res.json("Đăng nhập thất bại");
                return;
            }
        });
});

// api tai xe xac nhan  (app tai xe gui cho server)
router.get('/confirmcustomer/:customer/:driver', function (req, res) {
    var _customer = req.params.customer;
    var _driver = req.params.driver;

    var ref = firebase.app().database().ref("customers").child(_customer);
    ref.once("value")
        .then(function (snap) {
            var driver = ref.child("request").child("drivers").child(_driver);
            driver.update({
                statusfordriver: 2
            });
            //Update trang thai request cua khach hang 
            var requestref = ref.child("request");
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
                            res.json("out");
                            return;
                        }
                    });
                });
            res.json("out");
            return;
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
    var isSend = true;
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
                                    return _drivers;
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

    // thay đổi trạng thái đã định vị cho request
    var requestRef = firebase.database().ref('customers/' + phone + '/request');
    requestRef.update({
        statusforreq: 2
    })

    var numberNRef = firebase.database().ref('configs/constants/n');
    numberNRef.once('value', function(n){
        //console.log("DEBUG " + "number N " + n.val());
        N = n.val();
    });

    var driverRef = firebase.database().ref('drivers');
    driverRef.once('value', function(drivers){
    //res.json(drivers);
    //driverDatas = drivers;

        drivers.forEach(function(driver){
            if(driver.val().statusfordriver == 3){
                lenDriver++;
            }
        });

        var origin = {
            lat: lat,
            lng: lng
        }
        console.log('debug latlng  ----- ' + origin);
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
                        var i = 0;
                        for(i = 0; i < listDriver.length; i++){
                            if(item.distance < listDriver[i].distance){
                                break;
                            }
                        }
                        
                        listDriver.splice(i,0,item);

                        console.log(driver.key + ' ' + distance);
                        console.log(listDriver.length + ' ' + lenDriver);

                        if(listDriver.length == lenDriver){
                            // listDriver.sort(function(a, b){
                            //     return parseFloat(a.distance) - parseFloat(b.distance);
                            // })

                            /// sort

                            // var swapp;
                            // var n = listDriver.length;
                            // var x = listDriver;
                            // do {
                            //     swapp = false;
                            //     for (var i=0; i < n-1; i++)
                            //     {
                            //         if (x[i].distance > x[i+1].distance)
                            //         {
                            //            var temp = x[i];
                            //            x[i] = x[i+1];
                            //            x[i+1] = temp;
                            //            swapp = true;
                            //         }
                            //     }
                            //     n--;
                            // } while (swapp);


                            ////
                            console.log("sort");
                            var i = 0;

                            var Solan = listDriver.length;
                
                            if(listDriver.length > N){
                                Solan = N;
                            }

                            for(i = 0; i < Solan; i++){
                                console.log(listDriver[i].distance);
                            }

                            var driversRef = firebase.database().ref('customers/'  + phone + '/request/drivers');
                            
                            
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
            }
        );
    }
});
    res.json('success');
});
});
//API Bat Dau Cho Khach
router.get('/start/:customer/', function (req, res) {
    var _customer = req.params.customer;

    var ref = firebase.app().database().ref("customers");
    ref.once("value")
        .then(function (snap) {
            snap.forEach((customer) => {
                if (customer.key == _customer) {
                    var driver = ref.child(_customer).child("request");
                    driver.update({
                        statusforreq: 5
                    });
                    return;
                }
            });
        });
    res.json("sucess");
});


//Api Kết thúc chở khách
router.get('/stop/:customer/:driver', function (req, res) {
    var _customer = req.params.customer;
    var _driver = req.params.driver;
    var ref = firebase.app().database().ref("customers");
    ref.once("value")
        .then(function (snap) {
            snap.forEach((customer) => {
                if (customer.key == _customer) {
                    var driver = ref.child(_customer).child("request");
                    driver.update({
                        statusforreq: 6 // đã hoàn thành
                    });
                      // update request cho histories

                      var refHistories = ref.child(_customer).child("histories");
                      // tạo 1 key mới cho history sau đó updaet cai key đó
                      var newPostKey = ref.child("histories").push().key;
                      
                      var historyRef = refHistories.child(newPostKey);
                      historyRef.push(newPostKey);
                      var update = {};
                      var newRequest = {
                          address: customer.child('request').val().address,
                          addressold: customer.child('request').val().addressold,
                          drivers: customer.child('request').val().drivers,
                          statusforreq: customer.child('request').val().statusforreq,
                          timereq: customer.child('request').val().timereq,
                          typeofcar: customer.child('request').val().typeofcar
                      }
                      update[newPostKey] = newRequest;                     
                      (refHistories.update(update)).then((r)=>{
                        var reset = ref.child(_customer);
                        reset.update({
                            request:"null"
                        });
                      });

                    // update trạng thái tài xế
                    var driverref = firebase.app().database().ref("drivers").child(_driver);
                    driverref.update({
                        statusfordriver: 3 // đang sẵn sàng
                    });
                    return;
                }
            });
        });
    res.json("sucess");
});
//Dang xuat
router.get('/logout/:driver/', function (req, res) {
    var _driver = req.params.driver;

    var ref = firebase.app().database().ref("drivers");
    ref.once("value")
        .then(function (snap) {
            snap.forEach((driver) => {
                if (driver.key == _driver) {
                    var refDriver = ref.child(_driver);
                    refDriver.update({
                        statusfordriver: 5
                    });
                    return;
                }
            });
        });
    res.json("sucess");
});
module.exports = router;