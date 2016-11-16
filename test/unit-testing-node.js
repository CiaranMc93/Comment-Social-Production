var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect();
var server = require('../server.js');
var should = chai.should();
var UserPost       = require('../models/userPost.js');
var mongoose = require('mongoose');
var configDB   = require('../config/database.js');
//make sure promise deprecation warning is removed
mongoose.Promise = global.Promise;

chai.use(chaiHttp);

//testing the routes
describe('Routes', function() {

	//name of the test
	it('Check /api/', function(done) {
	chai.request(server)
		//get the correct route to test
	    .get('/api/helloworld')
	    .end(function(err, res){
	    	//test assertions about the code.
	      res.should.have.status(200);
	      done();
	    });
	});

	//error route
	it('Check 404 Error', function(done) {
	chai.request(server)
		//get the correct route to test
	    .get('/api/testing123')
	    .end(function(err, res){
	    	//test assertions about the code.
	      res.should.have.status(404);
	      done();
	    });
	});
});

//testing the route functionality
describe('Validate Route for Hello World Task', function() {

	it('Check Hello World Success', function(done) {
	chai.request(server)
		//get the correct route to test
	    .get('/api/helloworld')
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    done();
	    });
	});
});

//testing the route functionality
describe('Validate POST Route for Second and Third Task', function() {

	it('API Post Respond with Data Sent In', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/response')
	    .set('Accept', 'application/x-www-form-urlencoded')
	    .send({'username':'Ciacavus'})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //check the data we get back from the server
		    res.body.should.have.property('username');
		    res.body.username.should.equal('Ciacavus');
		    done();
	    });
	});

	it('API Post Respond with Incorrect JSON', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/response')
	    .send("randomtextrandomtext")
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    res.body.should.have.property('randomtextrandomtext');
		    res.body.randomtextrandomtext.should.equal('');
		    done();
	    });
	});
});

//validating the 4th task
describe('Validate Data Sending and Database Functionality', function() {

	it('Check Empty Submission', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/submit')
	    .send({'text':''})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    res.body.should.have.property('error');
		    res.body.error.should.equal('emptyText');
		    done();
	    });
	});

	it('Check Date Time Function', function(done) {
		//access the function
        var dateTime = getDateTime();

        if(dateTime.length > 10)
        {
        	done();
        }
        else
        {
        	throw "Date Time Function did not return correct data."
        }
    });
       

	it('Create Test Submission', function(done) {

		// create the user
        var newPost = new UserPost();

        //add in the relevant details to be inserted
        newPost.text = "testPost";

        //get the date and time
        //format == YYYY:MM:DD:HH:MM:SS
        var dateTime = getDateTime();

        newPost.dateTime = dateTime;

        //save the user
        newPost.save(function(err) {
            if (err)
            {
                console.log("Post Create error");
            } else
            {
            	done();
            	
            }

        });
	});

	it('Remove New Test Post', function(done) {

		//remove the user so the test can pass
	    UserPost.find({'text' : "testPost"}).remove(function(err){
    		if (err)
            {
                throw "error";
            } else
            {
            	done();
            }
		});
	});
});

//testing the 5th task
describe('Check Login/Signup and User Posting', function() {

	it('Check Empty Username', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/login')
	    .send({'username':''})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    res.body.should.have.property('user');
		    res.body.user.should.equal('notCreated');
		    done();
	    });
	});

	it('Check User Does Not Exist', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/login')
	    .send({'username':'errorTestUser'})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    res.body.should.have.property('user');
		    res.body.user.should.equal('User Does not Exist');
		    done();
	    });
	});

	it('Check User Signup Form is Empty', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/signup')
	    .send({'username':''})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    res.body.should.have.property('user');
		    res.body.user.should.equal('User Form is Empty');
		    done();
	    });
	});

	it('Create Test User', function(done) {

		// create the user
        var newUser = new UserPost();

        //add in the relevant details to be inserted
        newUser.username = "testUser";

        //save the user
        newUser.save(function(err) {
            if (err)
            {
                console.log("User Create error");
            } else
            {
            	done();
            }

        });
	});

	it('Check User Already Signed Up', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/signup')
	    .send({'username':'testUser'})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    res.body.should.have.property('user');
		    res.body.user.should.equal('User Exists Already');
		    done();
	    });
	});

	it('Get All Posts Check', function(done) {
		chai.request(server)
		//get the correct route to test
	    .get('/api/posts/getAllPosts')
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    //check that the returned data is an object
		    res.body.should.be.instanceof(Object);
		    done();
	    });
	});

	it('Insert Test Submission for Test User', function(done) {

		//get data entered
	    var text = "testText";

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
	        {username: "testUser"},
	        //add a submission to the submission array {$push: {array of submissions : current submission}}
	        {$push: {submission: submission}},
	        {safe: true, upsert: true},
	        function(err, model) {
	            if(err)
	                throw err;

	            //test complete
	            done();
	        }
	    );
	});

	it('Check if a User Made a Post', function(done) {

		//get all posts that have the username
        UserPost.find({'username' : 'testUser'}, function(err, posts) {
            var postMap = {};

            //get each post that has the username as the stored user
            posts.forEach(function(post) {

            	//check the first object in the array as the test will only have 1 object
                if(post.submission[0].text == "testText")
                {
              	  done();
                }
                else
                {
              	  throw "There is no post by user: testUser";
                }
            });
        });
	});

	it('Remove New Test User', function(done) {

		//remove the user so the test can pass
	    UserPost.find({'username' : "testUser"}).remove(function(err){
    		if (err)
            {
                throw "error";
            } else
            {
            	done();
            	//exit the process for continuous integration build
            	process.exit();
            }
		});
	});
});


//get date time function
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