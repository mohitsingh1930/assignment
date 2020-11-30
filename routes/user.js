const router = require('express').Router()



router.post('/create', (req, res) => {

	let {name, email, phoneNumber} = req.body;

	let missingField = name ?? email ?? phoneNumber ?? 1;

	if(missingField)
		res.status(400).json({error: "some fields are missing"})

	mysqlConnect.query(`insert into users (name, email, phoneNumber) values('${name}', '${email}', '${phoneNumber}')`)
	.then(rows => {

		console.log(rows);
		res.status(201).json({message: "user created"});

	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: "Internal Server Error"});
	})


})


router.get('/balance', (req, res) => {

	let {userId} = req.query;

	if(!userId)
		return res.status(400).json({error: "some fields are missing"});

	mysqlConnect.query(`select currentBalance from users where id=${userId}`)
	.then(result => {

		console.log(result)
		if(result.length===0) return res.status(404).json({error: "user not found", amount: null});

		res.status(200).json({message: "user found", amount: result[0].currentBalance});

	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: "Internal Server Error"});
	})

})



module.exports = router;