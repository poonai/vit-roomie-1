var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

var MongoClient=require('mongodb').MongoClient;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine','ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);


app.get('/mendetails', function (req, res) {


	MongoClient.connect('mongodb://ramkishorevit:ramkishore1995@ds159998.mlab.com:59998/roomie101', function(err,db)
	{
		if(err)
        {
	           
	      	res.render('serverdown');

         }		  
 console.log('connected');
		 db.collection('roomie101').find({'gender':'male'}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
           res.render('mendetails', { result: result});

  });
});

});


app.get('/womendetails', function (req, res) {


	MongoClient.connect('mongodb://ramkishorevit:ramkishore1995@ds159998.mlab.com:59998/roomie101', function(err,db)
	{
		if(err)
            {
            res.render('serverdown');

            }
		   console.log('connected');
		 db.collection('roomie101').find({'gender':'female'}).toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
           res.render('womendetails', { result: result});

  });
});

});



app.post('/accept',function(req,res)
{
   console.log(req.body.accept);
   // reomove from db and update the page..
MongoClient.connect('mongodb://ramkishorevit:ramkishore1995@ds159998.mlab.com:59998/roomie101', function(err,db)
	{
		if(err)
            {
                          	
               res.render('serverdown');

            }		   

            console.log('connected');

        	db.collection('roomie101').remove({
        		registerno: req.body.accept
            
});
         
        	console.log('deleted');
        	res.redirect('/deletepage');

});

});





app.post('/post-details', function(req, res) {

	console.log(req.body.name);

	MongoClient.connect('mongodb://ramkishorevit:ramkishore1995@ds159998.mlab.com:59998/roomie101', function(err,db)
	{
		if(err)
           {
           	res.render('serverdown');
           }
		   console.log('connected');

        	db.collection('roomie101').insert({

              name: req.body.name,
              registerno:req.body.registerno,
              gender:req.body.gender,
              cgpa: req.body.cgpa,
              branch: req.body.branch,
              requirements:req.body.requirements,
              phone:req.body.phone,
              status:'false'
        	});
});
         
        	console.log('inserted');
        	res.redirect('/submitdetails');

});




app.get('/submitdetails',function(req,res) {

      res.render('submitdetails');

}
	);



app.get('/deletepage',function(req,res) {

      res.render('deletepage');

}
	);

app.get('/serverdown',function(req,res) {

      res.render('serverdown');

}
	);

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
