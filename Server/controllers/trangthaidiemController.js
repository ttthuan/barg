var express = require('express');

// init firebae
var firebase = require('../configs/FirebaseConfig');

var router = express.Router();

//api kiểm tra đăng nhập cho nhân viên quản lý
router.get('/login/:username/:password', function (req, res) {
    var _username = req.params.username;
    var _password = req.params.password;

    var ref = firebase.app().database().ref("employees").child("nhanvienquanly");
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

module.exports = router;