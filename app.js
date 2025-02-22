var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fileUpload = require('express-fileupload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(fileUpload());

app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));
var enableCORS = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, access-token, Content-Length, X-Requested-With, *');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.all("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, access-token, Content-Length, X-Requested-With, *');
  next();
});
app.use(enableCORS);


app.use('/admin', indexRouter);
app.use('/', usersRouter);

app.get(`/`, async (ereq, eres) => {

  const http = (options) => {
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(body));
      });
    });
  };
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // res.status(config.NOT_FOUND).json({
  //   status: 0,
  //   message: "Invalid route"
  // })//yeha se
  //res.send("<h1>page not found</h1>");

  res.render('404')
  console.log('404 => ');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("RIP", err);  // render the error page
  res.status(err.status || 500);
  res.send("<h1>Error</h1>");
});

app.listen(3000, function (err, result) {
  console.log("Project successfully diployed on port -3000");
});



module.exports = app;
