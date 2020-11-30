const router = require('express').Router()

router.post('/create', (req, res) => {

	let {userId, amount, type} = req.body;

	if(!userId || !amount || !type) return res.status(400).json({error: "some fields are missing"})

	let debitPromise = Promise.resolve(1);

	// if(type==='debit')
	debitPromise = 	mysqlConnect.query(`select currentBalance from users where id=${userId}`);

	debitPromise.then(result => {
		console.log(result);

		if(result.length===0) return res.status(404).json({error: "user not found"});

		if(type=="debit" && result[0].currentBalance-amount<req.app.locals.minAmountToMaintain) return res.status(400).json({error: "Not debitable", currentBalance: result[0].currentBalance});

		mysqlConnect.query(`insert into transactions (userId, type, amount) values(${userId}, '${type}', ${amount})`)
		.then(result2 => {
			console.log(result2);

			return mysqlConnect.query(`update users set currentBalance=currentBalance${type==="debit"?"-":"+"}${amount}`);

		})
		.then(result3 => {

			console.log(result3);
			res.status(200).json({"message": "transaction saved successfully", currentBalance: type==="debit"?result[0].currentBalance-amount:result[0].currentBalance+amount})

		})

	})
	.catch(err => {
		console.log(err);
		res.status(500).json({err: "Internal Server Error"});
	})

})

module.exports = router;