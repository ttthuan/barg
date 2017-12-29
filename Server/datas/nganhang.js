var data = require("./data");
var qPromise = require("q");

exports.GetBanks = function() {
    var defer = qPromise.defer();
    var queryString = "select * from nganhang";
    data.Load(queryString).then(raws => {
    	console.log("GetBanks success");
    	defer.resolve(raws);
    }).catch(erro => {
    	console.log("GetBanks fail");
    	defer.reject(erro);
    });
    return defer.promise;
}