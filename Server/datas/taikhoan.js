var data = require('./data');
var qPromise = require('q');

exports.GetAccounts = function(){
	var defer = qPromise.defer();
	var queryString = 'select * from taikhoan';
	data.Load(queryString).then(raws => {
		console.log('GetDanhSachTaiKhoan success');
		defer.resolve(raws);
	}).catch(err => {
		console.log('GetDanhSachTaiKhoan fail');
		defer.reject(err);
	});
	return defer.promise;
};

exports.GetAccount = function(maTaiKhoan, maPin){
	var defer = qPromise.defer();
	var queryString = `select * from taikhoan where MaTaiKhoan = ${maTaiKhoan} and MaPin = ${maPin}`;
	data.Load(queryString).then(raws => {
		console.log('GetAccount success');
		defer.resolve(raws[0]);
	}).catch(err => {
		console.log('GetAccount fail');
		defer.reject(err);
	});
	return defer.promise;
};

exports.CheckAccountAvariable = function(maTaiKhoan){
	var defer = qPromise.defer();
	var queryString = `select * from taikhoan where MaTaiKhoan = ${maTaiKhoan}`;
	data.Load(queryString).then(raws => {
		console.log('CheckAccountAvariable success');
		defer.resolve(raws[0]);
	}).catch(err => {
		console.log('CheckAccountAvariable fail');
		defer.reject(err);
	});
	return defer.promise;
};


exports.WithDrawCrash = function(maTaiKhoan, balance, amount){
	var defer = qPromise.defer();
	var queryString = `update taikhoan set SoDu = ${balance} where MaTaiKhoan = ${maTaiKhoan}`;
	data.Load(queryString).then(raws => {
		console.log('update taikhoan success');
		//var today = new Date().getTime();

		var queryStringInsertGiaoDich = `INSERT INTO giaodich (MaTaiKhoanNguon, MaTaiKhoanDich, 
			NgayGiaoDich, SoTienGiaoDich, PhiPhatSinh) 
			Values(${maTaiKhoan}, ${maTaiKhoan}, CURDATE(), ${amount}, 0)`;
		console.log(queryStringInsertGiaoDich);

		data.Load(queryStringInsertGiaoDich).then(raws => {
			defer.resolve(raws);
			console.log("insert giaodich success");
		}).catch(err => {
			defer.reject(err);
			console.log("insert giaodich fail");
		})
	}).catch(err => {
		console.log('update taikhoan fail');
		defer.reject(err);
	});
	return defer.promise;
};

exports.TransferMoney = function(idSource, balanceSource, idDest, balanceDest, amount, pay){
	var defer = qPromise.defer();
	var queryString = `update taikhoan set SoDu = ${balanceSource} where MaTaiKhoan = ${idSource}`;
	data.Load(queryString).then(rawSource => {
		console.log('update taikhoan source success');
		queryString = `update taikhoan set SoDu = ${balanceDest} where MaTaiKhoan = ${idDest}`;
		data.Load(queryString).then(rawDest => {

			var queryStringInsertGiaoDich = `INSERT INTO giaodich (MaTaiKhoanNguon, MaTaiKhoanDich, 
			NgayGiaoDich, SoTienGiaoDich, PhiPhatSinh) 
			Values(${idSource}, ${idDest}, CURDATE(), ${amount}, ${pay})`;
			console.log(queryStringInsertGiaoDich);

			data.Load(queryStringInsertGiaoDich).then(raws => {
				defer.resolve(raws);
				console.log("insert giaodich success");
			}).catch(err => {
				defer.reject(err);
				console.log("insert giaodich fail");
			})

		}).catch(errDest=>{
			console.log('update taikhoan dest fail');
			defer.reject(errDest);
		});
	}).catch(errSource => {
		console.log('update taikhoan source fail');
		defer.reject(errSource);
	});
	return defer.promise;
};

exports.GetHistory = function(maTaiKhoan){
	var defer = qPromise.defer();
	var queryString = `select * from giaodich where MaTaiKhoanNguon = ${maTaiKhoan}`;
	data.Load(queryString).then(raws => {
		console.log('GetHistory success');
		defer.resolve(raws);
	}).catch(err => {
		console.log('GetHistory fail');
		defer.reject(err);
	});
	return defer.promise;
};