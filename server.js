//server.js
// get all the tools we need ===================================================
var express    = require('express');
var session    = require('express-session');
var app 	   = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var configDB   = require('./config/database.js');
var HttpStatus = require('http-status-codes');
//secure the application
var helmet = require('helmet');
var router 	   = express.Router();              // get an instance of the express Router
// load up the models
var User       = require('./models/user.js');
var UserPost       = require('./models/userPost.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//our app can use these static files
app.use(express.static('node_modules'));
app.use(express.static('views'));
//session management
app.use(session({
    secret: '113547411993',
    resave: true,
    saveUninitialized: true
}));
app.use(helmet());

//session storage variable
var sessionStore;

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

	router.get('/helloworld', function(req, res) {
	    res.render('helloworld.ejs');
	});

	//this route will demonstrate the the third task
	router.get('/response', function(req, res) {
	    res.render('viewJSONResponse.ejs');
	});

	router.get('/submit', function(req, res) {
	    res.render('submitPost.ejs');
	});

    //render the submit posts file
	router.get('/posts', function(req, res) {
	    res.render('submitPost.ejs');
	    res.end();
	});

    //render the reply posts file
    router.get('/posts/reply', function(req, res) {
        //remove username session storage as new person is replying.
        sessionStore.username = undefined;

        res.render('postReply.ejs');
        res.end();
    });

    //get the correct post to reply to
    router.post('/posts/replyTo', function(req, res) {

        //get the session
        sessionStore = req.session;

        if(req.body._id === undefined || req.body._id == '')
        {
            //send error msg
            res.send({"reply" : "ID is Incorrect"});
            res.end();
        }
        else
        { 
            var id = req.body._id;

            //get all posts that have the username
            UserPost.find({'_id' : id}, function(err, posts) {

                var postMap = {};

                //get each post (only going to be one) that has the id equal to what we have passed in
                posts.forEach(function(post) {
                  postMap[0] = post;
                });

                //store our post in the session for retrieval later
                sessionStore.post = postMap[0];
                //send the redirect
                res.send({redirect : '/api/posts/reply'});
                res.end();
            });
        }
    });

    //send the data to the replyto page
    router.get('/posts/replyTo/data', function(req, res) {

        //send the post data
        res.json(sessionStore.post);
        res.end
    });

    //get the data back from the database relating to users
    router.get('/posts/getUserPosts', function(req, res) {

        if(sessionStore === undefined)
        {
            res.json({'user' : 'User Posts not Found'});
        }
        else
        {
            //get all posts that have the username
            UserPost.find({'username' : sessionStore.username}, function(err, posts) {
                var postMap = {};

                //get each post that has the username as the stored user
                posts.forEach(function(post) {
                  postMap[post] = post;
                });

                //send all the data back in JSON
                res.json(postMap);
            });
        }
    });

    //get the data back from the database relating to users
    router.get('/posts/getAllPosts', function(req, res) {

        //get all posts that have the username
        UserPost.find({}, function(err, posts) {
            var postMap = {};

            //get each post that has the username as the stored user
            posts.forEach(function(post) {

                //make sure there are no undefined text posts
                if(post.text === undefined)
                {   

                }
                else
                {
                    postMap[post] = post;
                }
            });

            //send all the data back in JSON
            res.json(postMap);
        });
    });

	//second and third task
	router.post('/response', function(req, res) {
		//send the data back as it is already json
		res.json(req.body);
		res.end();
	});

	//submit route for all posts without a user (4th Task)
	router.post('/submit', function(req, res) {

        //create the session
        sessionStore = req.session;
        //store the username/citynNme in the session
        sessionStore.username = req.body.username;
        sessionStore.cityName = req.body.cityName;

		//submit the post
        submitPost(req,res);

	});

    //when a person is trying to reply the posts will be submitted here
    router.post('/posts/reply/submitReply', function(req, res, next) {

        //check if there was text submitted
        if(req.body.text == '' || req.body.text === undefined)
        {
            res.json({'error':'emptyText'});
        }
        else
        {

            //get data entered
            var username = req.body.username;
            var cityName = req.body.cityName;
            var text = req.body.text;
            var lat = req.body.lat;
            var long = req.body.long;
            var temp = req.body.temp;

            //get the date and time
            //format == YYYY:MM:DD:HH:MM:SS
            var dateTime = getDateTime();

            //array to hold the data to be inserted
            var replies = {
                username : username,
                cityName : cityName,
                text : text,
                dateTime : dateTime,
                lat : lat,
                long : long,
                temp : temp
            };

            //save in the database
            // find by some conditions and update
            UserPost.findOneAndUpdate(
                {_id: sessionStore.post._id},
                //add a submission to the submission array {$push: {array of submissions : current submission}}
                {$push: {replies: replies}},
                {safe: true, upsert: true},
                function(err, model) {
                    if(err)
                        console.log(err);

                    //redirect to the posts page when a new post is submitted
                    res.send({redirect : '/api/posts'});
                    next();
                }
            );
        }
    });

	//default route error handlings
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

    //return the date in a decent format
    return day + "/" + month + "/" + year + " at " + hour + ":" + min;
}

//function to submit posts
function submitPost(req,res)
{

	//check if there was text submitted
    if(req.body.post == '' || req.body.post === undefined)
    {
        res.send({'error' : 'emptyText'});
        res.end();
    }
    else
    {
        //get data entered
        var text = req.body.post;

        // create the post
        var newPost = new UserPost();

        //add in the relevant details to be inserted
        newPost.text = text;

        //get the date and time
        //format == YYYY:MM:DD:HH:MM:SS
        var dateTime = getDateTime();

    	newPost.username = req.body.username;

        //store the dateTime
        newPost.dateTime = dateTime;  

        //store the City Name/temperature/lat/long
        newPost.cityName = req.body.cityName;
        newPost.temp = req.body.temp;
        newPost.lat = req.body.lat;
        newPost.long = req.body.long;

        //save in the database
        newPost.save(function(err) {
            if (err)
                console.log("User Create error");

            //refresh the page with the new data when a new post is submitted
            res.send({redirect : '/api/posts'});
            res.end();
        });
    }
}

module.exports = app;