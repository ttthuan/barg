var mysql = require('mysql');
var qPromise = require('q');

var configs = require('../config');

// exports.Load = function(queryString){
// 	var pool = mysql.createPool(configs.POOL_STRING);
// 	var loi;
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			loi = err;
// 		}else{
// 			connection.query(queryString, function(error, results, fields){
// 				if(error){
// 					loi = error;
// 				}else{
// 					console.log(results.length);
// 					loi = results;
// 				}
// 				connection.release();
// 			});
// 		}
// 	});
// 	return loi;
// }

exports.Load = function(queryString){
	var pool = mysql.createPool(configs.POOL_STRING);
	var defer = qPromise.defer();
	pool.getConnection(function(err, connection){
		if(err){
			console.log('connection fail');
			defer.reject(err);
		}else{
			console.log('connection success');
			connection.query(queryString, function(error, results, fields){
				if(error){
					defer.reject(error);
					console.log('query fail');
				}else{
					defer.resolve(results);
					console.log('query success');
				}
				connection.release();
			});
		}
	});
	return defer.promise;
}