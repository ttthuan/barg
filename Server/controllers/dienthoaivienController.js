var express = require('express');
var router = express.Router();
// init firebae
var firebase = require('../configs/FirebaseConfig');


// api khách hàng đặt xe
router.get('/customers/:phone/:name/:addressold/:typeofcar/:timereq/:statusforreq', function (req, res) {
    var phone = req.params.phone;
    var name1 = req.params.name;
    var addressold1 = req.params.addressold;
    var typeofcar1 = req.params.typeofcar;
    var timereq1 = req.params.timereq;
    var statusforreq1 = req.params.statusforreq;
    console.log("debug " + name1);

    var isLocated = false;
    var lat, lng;
    var pointRef = firebase.database().ref('points');
    pointRef.once('value', function(points){
        points.forEach(function(point) {
            if(point.key == addressold1){
                isLocated = true;
                lat = point.child('locations').val().lat;
                lng = point.child('locations').val().lng;
                return;
            }
        });

        if(isLocated == true){
            statusforreq1 = 2; // đã được định vị
        }

        var ref = firebase.app().database().ref("customers");
        ref.once("value")
            .then(function (snap) {
                var datontai = false;
                snap.forEach((customer) => {
                    if (customer.key == phone) {
                        datontai = true;
                        return;
                    }
                });
                if (datontai == false) {
                    var customersRef = ref.child(phone);
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
                else if (datontai == true) {
                    var customersRef = ref.child(phone);
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


            /////////////////////////
            if(isLocated == true){
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
            }

        });


    res.json("sucess");
});

module.exports = router;