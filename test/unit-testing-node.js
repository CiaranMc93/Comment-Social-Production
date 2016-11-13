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
	    .get('/api/')
	    .end(function(err, res){
	    	//test assertions about the code.
	      res.should.have.status(200);
	      done();
	    });
	});
});

//test database functionality
describe("Validate Database Functionality", function(){ 

	//create new model
	var t = new testDB();

    it('Save test user', function(done) {

		//insert data
		t.name = "Ciaran";

		//save in the database
        t.save(function(err) {
            if (err)
            {
                throw "error";
            }
            else
            {
            	//test passed
            	done();
            }
        });
    });

    it('Find Specific User', function(done) {

    	//find user
    	testDB.findOne({name: "Ciaran"}, function(err){
    		if (err)
            {
                throw "error";
            }
            else
            {
            	//test passed
            	done();
            }
    	});
    });

    it('Remove test user', function(done) {

    	//find user
    	testDB.find({name: "Ciaran"}).remove(function(err){
    		if (err)
            {
                throw "error";
            }
            else
            {
            	//test passed
            	done();
            }
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
		    //process exit is used so that the continuous integration application can complete the builds
	      	process.exit();
	    });
	});
});