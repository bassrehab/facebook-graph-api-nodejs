var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('redis');
var redisClient = redis.createClient();

var index = require('./routes/index');
var users = require('./routes/users');
var authorize = require('./routes/authorize');
var dashboard = require('./routes/dashboard');
var viewpage = require('./routes/view-page');
var createpost = require('./routes/create-post');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('redis', redisClient);
app.locals.moment = require('moment');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// sessions
app.use(session({   secret: 'keyboard cat',
                    cookie: { maxAge: 60000 },
                    resave: true,
                    saveUninitialized: true
}));


// routes
app.use('/', index);
app.use('/users', users);
app.use('/authorize', authorize);
app.use('/dashboard', dashboard);
app.use('/view/page', viewpage);
app.use('/create/post', createpost);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
