const AMOUNT_CRASH_INCORRECT = -1;
const PIN_INCORRECT = 0;
const MINIMUM_BALANCE = 100000;
const INSUFFICIENT_FUNDS = 1;
const PAY_DIFFEREN_BANK = 11000;
const PAY_INSIDE_BANK = 3300;
const TRANSFER_SUCCESS = 2;
const TRANSFER_FAIL = -2;
const WithDrawSuccess = 3;
const ID_DEST_INCORRECT = -3;

var express = require('express');
var taikhoans = require('../datas/taikhoan');

var router = express.Router();

router.get('/', function(req, res) {
    taikhoans.GetAccounts().then(raws => {
        console.log("/ success");
        res.json(raws);
    }).catch(err => {
        res.statusCode = 504;
        res.json("no contain");
        console.log("/ fail");
    });
});

router.get('/login/:id/:pin', function(req, res) {
    var id = req.params.id;
    var pin = req.params.pin;
    taikhoans.GetAccount(id, pin).then(raws => {
        console.log('/${id}/${pin} success');
        if (raws) {
            res.json(raws);
        } else {
            res.statusCode = 204;
            res.json("no contain");
        }

    }).catch(err => {
        console.log('/${id}/${pin} fail');
        res.statusCode = 504;
        res.json("no contain");
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    taikhoans.CheckAccountAvariable(id).then(raws => {
        console.log('/${id} success');
        if (raws) {
            res.json(raws);
        } else {
            res.statusCode = 204;
            res.json("no contain");
        }
    }).catch(err => {
        console.log('/${id} fail');
        res.statusCode = 504;
        res.json("error");
    });
});

router.post('/withdrawcash', function(req, res) {
    var id = req.body.MaTaiKhoan,
        pin = req.body.MaPin,
        amount = req.body.Money;
    taikhoans.GetAccount(id, pin).then(accountCorrect => {
        console.log('/withdrawcash checkaccount success');
        if (accountCorrect) {
            if (checkAmountCrash(amount)) {
                var balance = accountCorrect.SoDu - amount;
                if (balance < MINIMUM_BALANCE) {
                	res.statusCode = 401;
                    res.json(INSUFFICIENT_FUNDS);
                } else {
                    taikhoans.WithDrawCrash(id, balance, amount).then(raw => {
                        accountCorrect.SoDu = balance;
                        res.json(WithDrawCrash);
                    }).catch(err => {
                        res.statusCode = 504;
                        res.json("erro");
                    })
                }
            } else {
            	res.statusCode = 401;
                res.json(AMOUNT_CRASH_INCORRECT);
            }
        } else {
        	res.statusCode = 401;
            res.json(PIN_INCORRECT);
        }
    }).catch(err => {
        console.log('/withdrawcash checkaccount fail');
        res.statusCode = 504;
        res.json("error");
    });
});

router.post('/transfer', function(req, res) {
    var idSource = req.body.MaTaiKhoanNguon,
        maPin = req.body.MaPin,
        idDest = req.body.MaTaiKhoanDich,
        amount = req.body.Money;
    taikhoans.GetAccount(idSource, maPin).then(accountSource => {
        if (accountSource) {
            taikhoans.CheckAccountAvariable(idDest).then(accountDest => {
                if (accountDest) {
                    if (accountSource.SoDu > amount) {
                        accountSource.SoDu -= amount;
                        accountDest.SoDu += amount;
                        if (accountSource.MaNganHang != accountDest.MaNganHang) {
                            taikhoans.TransferMoney(idSource, accountSource.SoDu - PAY_DIFFEREN_BANK, idDest,
                                accountDest.SoDu, amount, PAY_DIFFEREN_BANK).then(raw => {
                                res.json(TRANSFER_SUCCESS);
                            }).catch(err => {
                            	res.statusCode = 504;
                                res.json("error");
                            });
                        } else {
                            taikhoans.TransferMoney(idSource, accountSource.SoDu - PAY_INSIDE_BANK, idDest,
                                accountDest.SoDu, amount, PAY_INSIDE_BANK).then(raw => {
                                res.json(TRANSFER_SUCCESS);
                            }).catch(err => {
                            	res.statusCode = 504;
                                res.json("error");
                            });
                        }
                    }else{
                    	res.statusCode = 401;
                        res.json(INSUFFICIENT_FUNDS);
                    }
                }else{
                	res.statusCode = 401;
                	res.json(ID_DEST_INCORRECT);
                }
            }).catch(errDest => {
                res.statusCode = 504;
                res.json('error');
            })
        }
    }).catch(errSource => {
        res.statusCode = 504;
        res.json('error');
    })
});

router.get('/history/:id', function(req, res) {
    var id = req.params.id;
    console.log('/history/:id');
    taikhoans.GetHistory(id).then(raws => {
        if (raws && raws.length != 0) {
            res.json(raws);
        } else {
            res.statusCode = 204;
            res.json("error");
        }
    }).catch(err => {
        res.statusCode = 504;
        res.json("error");
    })
});

function checkAmountCrash(amount) {
    console.log("amount crash " + amount);
    if (amount % 50000 != 0) {
        return false;
    }
    return true;
}

module.exports = router;