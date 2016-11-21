var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect();
var server = require('../server.js');
var should = chai.should();
var User      = require('../models/user.js');
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
		chai.request(server)
		//get the correct route to test
	    .post('/api/submit')
	    .send({'post':'testPost'})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    res.body.should.have.property('redirect');
		    done();
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


//testing the 5th,6th and 7th Tasks
describe('Check Reply Submissions and Getting all the Posts', function() {

	//hold the post ID
	var postID;

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

	it('Create Test Post', function(done) {
		chai.request(server)
		//get the correct route to test
	    .post('/api/submit')
	    .send({'post':'testPost','username':'testUser','cityName':'Dublin,Ireland'})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    res.body.should.have.property('redirect');
		    done();
	    });
	});

	it('Get All User Posts Check', function(done) {
		chai.request(server)
		//get the correct route to test
	    .get('/api/posts/getUserPosts')
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    //check that the returned data is an object
		    res.body.should.be.instanceof(Object);
		    done();
	    });
	});

	it('Do Not Find the Correct Post', function(done) {

		///find the user post
        UserPost.find({'text' : 'testPost123'}, function(err, post) {

        	if(post == "")
        	{
        		//test passed as no post exists
        		done();
        	}
        	else
        	{
        		throw "Post Should not have been found!";
        	}
        });
	});

	it('Incorrect ID', function(done) {

		///find the user post
        UserPost.find({'text' : 'testPost123'}, function(err, posts) {

        	var postMap = {};

            //get each post (only going to be one) that has the id equal to what we have passed in
            posts.forEach(function(post) {
              postMap[0] = post;
            });

            postID = postMap[0];

            //check the route to make sure it reponds with a redirect
			chai.request(server)
			//get the correct route to test
		    .post('/api/posts/replyTo')
		    .send({'_id': postID})
		    .end(function(err, res){
		    	//test assertions about the code.
			    res.should.have.status(200);
			    res.body.should.be.a('object');
			    //sent in random text, then it put that into json.
			    //check that the text sent in has no value as it is only text
			    res.body.should.have.property('reply');
			    res.body.reply.should.equal('ID is Incorrect');
			    done();
		    });

        });
	});

	it('Get the Correct Post Back', function(done) {

		///find the user post
        UserPost.find({'text' : 'testPost'}, function(err, posts) {

        	var postMap = {};

            //get each post (only going to be one) that has the id equal to what we have passed in
            posts.forEach(function(post) {
              postMap[0] = post;
            });

            postID = postMap[0];

            //check the route to make sure it reponds with a redirect
			chai.request(server)
			//get the correct route to test
		    .post('/api/posts/replyTo')
		    .send({'_id': postID})
		    .end(function(err, res){
		    	//test assertions about the code.
			    res.should.have.status(200);
			    res.body.should.be.a('object');
			    //sent in random text, then it put that into json.
			    //check that the text sent in has no value as it is only text
			    res.body.should.have.property('redirect');
			    res.body.redirect.should.equal('/api/posts/reply');
			    done();
		    });

        });
	});

	it('Get the Correct Post to Reply To', function(done) {

		///find the user post
        UserPost.find({'text' : 'testPost'}, function(err, posts) {

        	var foundPost;

        	var postMap = {};

            //get each post (only going to be one) that has the id equal to what we have passed in
            posts.forEach(function(post) {
              postMap[0] = post;
            });

            foundPost = postMap[0];

            if(foundPost.text == 'testPost')
            {
            	done();
            }
            else
            {
            	throw "Post was not found.";
            }
        });
	}); 

	it('Check that the Post was Stored in the Session', function(done) {

		//check the route to make sure it reponds with a redirect
		chai.request(server)
		//get the correct route to test
	    .get('/api/posts/replyTo/data')
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //sent in random text, then it put that into json.
		    //check that the text sent in has no value as it is only text
		    var toStringID = toString(res.body._id);
		    toStringID.should.equal(toString(postID._id));
		    done();
	    });
	});

	it('Post a Reply to the Post we Created', function(done) {
		chai.request(server)
		//get the correct route to test
	    .post('/api/posts/reply/submitReply')
	    .send({'text':'testReply'})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    //check that the returned data is an object
		    res.body.should.have.property('redirect');
			res.body.redirect.should.equal('/api/posts');
		    done();
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
            	//passed
            	done();
            }
		});
	});

	it('Remove New Test User', function(done) {

		//remove the user so the test can pass
	    User.find({'username' : "testUser"}).remove(function(err){
    		if (err)
            {
                throw "error";
            } else
            {
            	//passed
            	done();
            	//exit the process for continuous integration build
            	//process.exit();
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