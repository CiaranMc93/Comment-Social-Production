//server.js
// get all the tools we need ===================================================
var express    = require('express');
var app 	   = express();
var bodyParser = require('body-parser');
//var mongoose   = require('mongoose');
var HttpStatus = require('http-status-codes');
var router 	   = express.Router();              // get an instance of the express Router


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//our app can use these static files
app.use(express.static('node_modules'));
app.use(express.static('views'));

	//set up the port we want to run on
	var port     = process.env.PORT || 8080;

	// Localhost Route ==============================
    app.get('/', function(req, res) {
    	//redirect to our REST API route
        res.redirect('/api/');
    });

	// ROUTES FOR OUR API
	// =============================================================================

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
	    res.render('index.ejs');
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.post('/', function(req, res) {
		//send the data back as it is already json
		res.json(req.body);
		res.end();
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
	// =============================================================================
	//mongoose.connect(''); // connect to our database

// launch ======================================================================
//make sure that if the tests use this file, they do not try and launch the server again
if(!module.parent)
{
	app.listen(port, function () {
	console.log('The Magic happens on port 8080!');
	});
}

module.exports = app;