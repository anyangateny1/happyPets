const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mysqlRouter = require('./routes/mysql');
const emailRouter = require('./routes/email');

require('dotenv').config(); // Load environment variables

const app = express();

// MySQL session store
const sessionStore = new MySQLStore({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'happyPets'
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mysql', mysqlRouter); // Use the mysqlRouter
app.use('/email', emailRouter); // Email router

module.exports = app;



