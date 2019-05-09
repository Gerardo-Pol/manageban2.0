const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', function (error) {
	console.log('LOL', error.message);
});

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser());

app.use(cookieParser());

app.use(
	session({
		key: 'user_sid',
		secret: '123secretstuff',
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 600000
		}
	})
);

app.use(function (req, res, next) {
	if (req.session.user) {
		res.locals.user = req.session.user;
	}
	next();
});

app.use(function (req, res, next) {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie('user_sid');
	}
	next();
});

app.get('/', function (req, res){
    res.render('login')
})

const server = app.listen(PORT, function () {
	console.log('Express is running on port', PORT);
});
