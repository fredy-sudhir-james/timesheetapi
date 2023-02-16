var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var config       = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var taskRouter  = require( './routes/taskRouter' );

const mongoose = require('mongoose');
const url      = config.mongoUrl;
const connect  = mongoose.connect( url );

connect.then ( db => {
	console.log( "Connected successfully to the server" );
}, err => console.log( err) );

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Default routers express generator generated. Retained for now
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Custom tasks router
app.use( '/tasks', taskRouter );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
