var nganhang = require("../datas/nganhang");
var express = require("express");

var router = express.Router();

router.get("/", function(req, res) {
    nganhang.GetBanks().then(raws => {
    	if(raws.length != 0){
    		console.log("/ success");
    		res.json(raws);
    	}else{
    		console.log("/ fail");
    		res.statusCode = 204;
    		res.json("no contain");
    	}
    }).catch(error => {
    	res.statusCode = 504;
    	res.json("error");
    })
})

module.exports = router;