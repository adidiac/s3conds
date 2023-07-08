var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose=require('mongoose');
var cors=require('cors');

let mongooseUrl="mongodb+srv://student:student@cluster0.iqc7qfo.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongooseUrl, { useNewUrlParser: true, useUnifiedTopology: true})


var usersRouter = require('./routes/users');
var vmsRouter = require('./routes/vms');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/vms', vmsRouter);

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
