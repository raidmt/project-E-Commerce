var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');

var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();
var fileUpload = require('express-fileupload');
var db = require('./config/connection');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout', // Ensure no extra spaces here
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

db.connect((err) => {
  if (err) console.log("connection error" + err);
  else console.log("Database connected to port 27017");
});

app.use(fileUpload());
app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
process.env.PWD = process.cwd()
app.use(express.static(process.env.PWD + '/public/product-images'));
  

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
