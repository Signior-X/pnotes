const functions = require('firebase-functions');

// for an express app
const express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var ua = require('express-mobile-redirect');

var router = require('./routes/route');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('adjhhfijdsbpqobflajpjdf'));  //Secret

const isDevMode = process.env.NODE_ENV === 'development';

// 1st change.
if (!isDevMode) {
  app.set('trust proxy', 1);
}

app.use(ua.is_mobile());
app.use(ua.is_tablet());

// Routes
app.use('/', router);


// Moded the actual index page to the pronode folders, as it is not needed

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

exports.app = functions.https.onRequest(app);
