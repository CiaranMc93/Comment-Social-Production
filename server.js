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
var Post       = require('./models/post.js');
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

    //default route
    router.get('/', function(req, res) {
        res.render('login.ejs');
    });

	// ROUTES FOR OUR API
	// =============================================================================
	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
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

	router.get('/login', function(req, res) {
	    res.render('login.ejs');
	});

    //render the submit posts file
	router.get('/posts', function(req, res) {
	    res.render('postSubmissions.ejs');
	    res.end();
	});

    //get the data back from the database relating to users
    router.get('/posts/getUserPosts', function(req, res) {

        //get all posts that have the username
        UserPost.find({'username' : sessionStore.username}, function(err, posts) {
            var postMap = {};

            //get each post that has the username as the stored user
            posts.forEach(function(post) {
              postMap[post.submission] = post;
            });

            //send all the data back in JSON
            res.json(postMap);
        });
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

		//get the response from the function
        var response = submitPost(req,res,"post");

        //send the json response
        res.json(response);
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.post('/login', function(req, res, next) {

		//get the session
		sessionStore = req.session;

		//get data entered
		var username = req.body.username;

		//check if the username entered is taken
		UserPost.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err || username == '')
            {
            	//send the data back as it is already json
				res.send({'user':'notCreated'});
            }
            else
            {
                // check to see if theres already a user with that email and login
                if (user) 
                {
                    //store the username when logged in
                    sessionStore.username = username;
                    //send the data back to be displayed
                    res.send({redirect : '/api/posts'});
                    res.end();

                } else {
                    res.json({'user':'User Does not Exist'});
                }
            }
        });
	});

	//Allow users to sign up.
	router.post('/signup', function(req, res, next) {

        //get the session
        sessionStore = req.session;

		//get data entered
		var username = req.body.username;

<<<<<<< HEAD
		//check if the username entered is taken
		UserPost.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err || req.body.username == '')
            {
            	//send the data back as it is already json
				res.send({'user':'User Form is Empty'});
            }
            else
            {
                // check to see if theres already a user with that username
                if (user) 
                {
                    res.send({'user':'User Exists Already'});
                } else {
                    // create the user
                    var newUserPost = new UserPost();

                    //add in the relevant details to be inserted
                    newUserPost.username = username;

                    //get the date and time
                    //format == YYYY:MM:DD:HH:MM:SS
                    var dateTime = getDateTime();

                    newUserPost.submission.dateTime = dateTime;
                    //default text
                    newUserPost.submission.text = "";

                    //save in the database
                    newUserPost.save(function(err) {
                        if (err)
                            console.log("User Create error");

                        //store the username when logged in
                        sessionStore.username = username;
                        //send the data back to be displayed
                        res.send({redirect : '/api/posts'});
                        res.end();
                    });
                }
            }
        });
	});

    //when a person is logged in, the posts will be submitted here
    router.post('/posts/submitPost', function(req, res, next) {

=======
>>>>>>> master
        //check if there was text submitted
        if(req.body.text == '')
        {
            res.json({'error':'emptyText'});
        }
        else
        {
<<<<<<< HEAD
        	//submit as a normal post
        	submitPost(req,res,"userPost");

            //get data entered
            var text = req.body.text;

            //get the date and time
            //format == YYYY:MM:DD:HH:MM:SS
            var dateTime = getDateTime();

            var submission = {
                text: text,
                dateTime: dateTime
            };

            //save in the database
            // find by some conditions and update
            UserPost.findOneAndUpdate(
                {username: sessionStore.username},
                //add a submission to the submission array {$push: {array of submissions : current submission}}
                {$push: {submission: submission}},
                {safe: true, upsert: true},
                function(err, model) {
                    if(err)
                        console.log(err);


                    //refresh the page with the new data when a new post is submitted
                    res.send({redirect : '/api/posts'});
                    next();
                }
            );
        }
    });
=======
            //get data entered
            var text = req.body.text;

            //check if the username entered is taken
            User.find({ 'user.username' :  req.body.username }, function(err, user) {
                console.log(user);
                res.json(user);
            });
        }
	});
>>>>>>> master

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
	mongoose.connect(configDB.url); // connect to our external database
	//mongoose.connect(configDB.urlLocal); // connect to our local database

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

function submitPost(req,res,flag)
{
	//check if there was text submitted
    if(req.body.text == '')
    {
        return{'error':'emptyText'};
    }
    else
    {
        //get data entered
        var text = req.body.text;

        // create the post
        var newPost = new UserPost();

        //add in the relevant details to be inserted
        newPost.text = text;

        //get the date and time
        //format == YYYY:MM:DD:HH:MM:SS
        var dateTime = getDateTime();

        if(flag == 'userPost')
    	{
    		newPost.username = sessionStore.username;
    	}
    	else
    	{
    		newPost.username = 'anon';
    	}

        //store the dateTime
        newPost.dateTime = dateTime;

        //save in the database
        newPost.save(function(err) {
            if (err)
                console.log("User Create error");

            //send the data back to be displayed
            return {'user':'postCreated'};
        });
    }
}

module.exports = app;