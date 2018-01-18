var express = require('express');
var firebase = require('../configs/FirebaseConfig');

var router = express.Router();
// init firebae

// chon tai xe cho khach
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
                                var newMycustomer = {
                                    phone: customer.key,
                                    address: customer.child('request').val().addressold,
                                    name: customer.val().name
                                };

                                update['\mycustomer'] = newMycustomer
                                driverRef.update(update);
                                res.json('fff');
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

// api xác nhận điểm đã được định vị
router.post('/located', function (req, res) {
    var address = req.body.address;
    var lat = req.body.lat;
    var lng = req.body.lng;

    var pointsRef = firebase.database().ref('points');
    var isHasValue = false;

    pointsRef.once('value', function (points) {
        points.forEach(function (point) {
            if (point.val().address == address) {
                isHasValue = true;
                return;
            }
        });

        if (isHasValue == true) {
            // var location = {
            //     lat: lat,
            //     lng: lng
            // };

            // var update = {};
            // update['/locations'] = location;

            // pointsRef.child(address).update(update);
        } else {
            var location = {
                lat: lat,
                lng: lng
            };

            var update = {};
            update['/' + address + '/locations'] = location;

            pointsRef.update(update);
        }
    });
    res.json('success');
});

router.get('/', function (req, res) {
    res.json("test api driver");
});

//api kiểm tra đăng nhập cho định vị viên
router.get('/login/:username/:password', function (req, res) {
    var _username = req.params.username;
    var _password = req.params.password;

    var ref = firebase.app().database().ref("employees").child("nhanviendinhvi");
    ref.once("value")
        .then(function (snap) {
            var sucess = false;
            snap.forEach((employee) => {
                if (employee.key == _username && employee.child('password').val() == _password) {
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
// api đăng xuất cho định vị viên
// update lại các request mà định vị viên này đang dữ
router.get('/logout/:dinhvivien/', function (req, res) {
    var _dinhvivien = req.params.dinhvivien;
    var ref = firebase.app().database().ref("customers");
    ref.once("value")
        .then(function (snap) {
            snap.forEach((customer) => {
                {
                    var refRequestOfCustomer = customer.child("request");
                    if (refRequestOfCustomer.child("handling").val() == _dinhvivien) {
                        var refHanding = ref.child(customer.key).child("request");                     
                        refHanding.update({
                            handling: "null"
                        });
                    }

                    return;
                }
            });
        });
    res.json("sucess");
});
module.exports = router;