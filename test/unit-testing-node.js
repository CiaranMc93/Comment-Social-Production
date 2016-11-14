var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect();
var server = require('../server.js');
var should = chai.should();
var testDB = require("../models/test.js");
// load up the user model
var User       = require('../models/user.js');
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

	it('Create Test Submission', function(done) {

		// create the user
        var newPost = new User();

        //add in the relevant details to be inserted
        newPost.submission.text = "testPost";

        //get the date and time
        //format == YYYY:MM:DD:HH:MM:SS
        var dateTime = getDateTime();

        newPost.submission.dateTime = dateTime;

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
	    User.find({'submission.text' : "testPost"}).remove(function(err){
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

/*//testing the 5th task
describe('Validate Data Sending and Database Functionality', function() {

	it('Check Empty Username', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/login')
	    .send({'username':'','password':'testPassword'})
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

	it('Create Test User', function(done) {

		// create the user
        var newUser = new User();

        //add in the relevant details to be inserted
        newUser.local.username = "testUser";
        newUser.local.password = "testPassword";

        //get the date and time
        //format == YYYY:MM:DD:HH:MM:SS
        var dateTime = getDateTime();

        newUser.info.dateTime = dateTime;

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

	it('Verify New Test User', function(done) {

		//check if the username entered is taken
		User.findOne({ 'local.username' :  'testUser' }, function(err, user) {
			 // check to see if theres already a user with that email
            if (user) 
            {
            	//passed
                done();
            } else {
            	throw "error";
            }
		});
	});

	it('Remove New Test User', function(done) {

		//remove the user so the test can pass
	    User.find({'local.username' : "testUser"}).remove(function(err){
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
*/

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