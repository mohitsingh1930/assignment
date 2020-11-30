const express = require('express');

const morgan = require('morgan');
const db = require('./helpers/db');

// routers
const indexRouter = require('./routes/index');
const transactionRouter = require('./routes/transaction');
const usersRouter = require('./routes/user');

globalThis.mysqlConnect = new db(mysqlConnection);


const app = express();

app.enable('trust proxy');


//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


app.locals = {
	minAmountToMaintain: 0
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/transactions', transactionRouter)


app.all('*', (req, res, next) => {
  res.sendStatus(404);
});


module.exports = app;
