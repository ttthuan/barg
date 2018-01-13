var express = require('express');

// init firebae
var firebase = require('../configs/FirebaseConfig');
var router = express.Router();

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

module.exports = router;