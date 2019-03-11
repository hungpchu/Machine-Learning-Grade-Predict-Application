// entry point to your applicaiton
// import alert from 'alert-node'

var file1 = "Hung";


var alert = require('alert-node');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var formidable = require('formidable');

//2 routes modules index and user 
var index = require('./routes/index');
var users = require('./routes/users');


var accounts = require('./routes/accounts');
var models = require('./routes/models');
var multipp = require('./routes/multipp');
var grades = require('./routes/grades');
// var picture = require('./routes/picture');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//use the index module for any routes starting with “/”
app.use('/', index);

app.use('/users', users);

app.use('/api/accounts', accounts);

app.use('/api/grades', grades);
app.use('/api/models', models);
app.use('/api/multipp', multipp);
// app.use('/public/images',picture);

app.get('/',function(res,req){

  res.send = "Hello";

});

// app.get('/', function (req, res){
//   console.log(" dirname = ", __dirname);
//   res.sendFile(__dirname + '/index.html');
// });

app.post('/', function (req, res){
  var form = new formidable.IncomingForm();

  form.parse(req);


// form.on('field', function(name, value) {
//   console.log('Text cua HUng = ' + value );
//   username = value;
//   console.log('username ben trong field = ' + username );
// });

  form.on('fileBegin', function (name, file){
    console.log("file trong begin = ");
    console.log(file);

    console.log("file.size trong undefined ngoai = ",file.size );

    if (file.name == ''){

      // import alert from 'alert-node'

      // alert('File Empty.Please choose file from browse file button first. ');
      console.log("filename trong file.size 0 = ", file.name);
      console.log("File empty");
      // res.send('File Empty.Please choose file from browse file button first. Now please click go back ');

      // JSAlert.alert("This is an alert.");
      return;
    }

   

    // console.log("name = ", name);
      file.path = __dirname + '/public/images/' + file.name;
      // file.path = __dirname + file.name;
      console.log("choose file HUng");
      console.log("file1 = ", file1);
      console.log("filename = ", file.name);
     
  });

//   var studentName = sessionStorage.getItem('hung');
// console.log(" studName = ", studentName);

//   var fs = require('fs');
// fs.rename('/public/images/' + file.name,'/public/images/' + studentName, function(err) {
//     if ( err ) console.log('ERROR: ' + err);
// });

  form.on('file', function (name, file){

    // console.log("file.size trong undefined ngoai = ",file.size );

    if (file.size == 0){

      // import alert from 'alert-node'

      alert('File Empty.Please choose file from browse file button first. ');
     
      console.log("File empty");

      res.sendFile(  __dirname + '/public/student3.html');
      // res.send('File Empty.Please choose file from browse file button first. Now please click go back ');

      // JSAlert.alert("This is an alert.");
      return;
    }else{

      alert('Thank for uploading. Please wait a few second for uploading the image');

      setTimeout(function() {
        // res.end(' World\n');
        // res.status(200);
        //res.json('success');
        res.sendFile(  __dirname + '/public/student3.html');
    }, 4000);
     
    }

      console.log('Uploaded ' + file.name);
  });

  // res.send('Thank for uploading');
 
  // res.render('index', { title: 'HungCHU2' });
});




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


// if (file.size == 0){


//   alert('File Empty.Please choose file from browse file button first. ');
 
//   console.log("File empty");

//   res.sendFile(  __dirname + '/public/student2.html');
//   return;
// }else{

//   alert('Thank for uploading. Please wait a few second for uploading the image');

//   setTimeout(function() {

//     res.sendFile(  __dirname + '/public/student2.html');
// }, 4000);
 
// }