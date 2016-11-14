//server.js
// get all the tools we need ===================================================
var express    = require('express');
var app 	   = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var configDB   = require('./config/database.js');
var HttpStatus = require('http-status-codes');
//secure the application
var helmet = require('helmet');
var router 	   = express.Router();              // get an instance of the express Router
// load up the user model
var User       = require('./models/user.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//our app can use these static files
app.use(express.static('node_modules'));
app.use(express.static('views'));
app.use(helmet());

	//set up the port we want to run on
	var port     = process.env.PORT || 8080;

	// Localhost Route ==============================
    app.get('/', function(req, res) {
    	//redirect to our REST API route
        res.redirect('/api/');
    });

    //default route
    router.get('/', function(req, res) {
        res.render('submit.ejs');
    });

	// ROUTES FOR OUR API
	// =============================================================================
	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/helloworld', function(req, res) {
	    res.render('helloworld.ejs');
	});

	//this route will demonstrate the the second and third task
	router.get('/response', function(req, res) {
	    res.render('respond.ejs');
	});

	router.get('/submit', function(req, res) {
	    res.render('submit.ejs');
	});

	router.get('/login', function(req, res) {
	    res.render('login.ejs');
	});

	//second and third task
	router.post('/response', function(req, res) {
		//send the data back as it is already json
		res.json(req.body);
		res.end();
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.post('/submit', function(req, res) {

        //check if there was text submitted
        if(req.body.text == '')
        {
            res.json({'error':'emptyText'});
        }
        else
        {
            //get data entered
            var text = req.body.text;

            // create the post
            var newPost = new User();

            //add in the relevant details to be inserted
            newPost.submission.text = text;

            //get the date and time
            //format == YYYY:MM:DD:HH:MM:SS
            var dateTime = getDateTime();

            //store the dateTime
            newPost.submission.dateTime = dateTime;

            //save in the database
            newPost.save(function(err) {
                if (err)
                    console.log("User Create error");

                //send the data back to be displayed
                res.json({'user':'postCreated'});
            });
        }
		
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.post('/login', function(req, res) {

		//get data entered
		var username = req.body.username;

		//check if the username entered is taken
		User.findOne({ 'local.username' :  req.body.username }, function(err, user) {
            // if there are any errors, return the error
            if (err || req.body.username == '')
            {
            	//send the data back as it is already json
				res.json({'user':'notCreated'});
            }

            // check to see if theres already a user with that email
            if (user) 
            {
                res.json({'user':'alreadyCreated'});
            } else {
                // create the user
                var newUser = new User();

                //add in the relevant details to be inserted
                newUser.local.username = username;

                //get the date and time
                //format == YYYY:MM:DD:HH:MM:SS
                var dateTime = getDateTime();

                newUser.info.dateTime = dateTime;

                //save in the database
                newUser.save(function(err) {
                    if (err)
                        console.log("User Create error");

                    //send the data back to be displayed
					res.json({'user':'userCreated'});
                });
            }
        });
	});

	//default route error handling
	//The 404 Route (ALWAYS Keep this as the last route)
	router.get('*', function(req, res){
  		res.status(404).render('error.ejs');
	});

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);

	// DATABASE SETUP
	// configuration ===============================================================
	//mongoose.connect(configDB.url); // connect to our external database
	mongoose.connect(configDB.urlLocal); // connect to our local database

// launch ======================================================================
//make sure that if the tests use this file, they do not try and launch the server again
if(!module.parent)
{
	app.listen(port, function () {
	console.log('The Magic happens on port 8080!');
	});
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

module.exports = app;