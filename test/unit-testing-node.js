var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect();
var server = require('../server.js');
var should = chai.should();

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

	//name of the test
	it('Check 404 Status of Unknown Route', function(done) {
	chai.request(server)
		//* represents any path not currently configured
	    .get('*')
	    .end(function(err, res){
	    	//test assertions about the code.
	      res.should.have.status(404);
	      done();
	    });
	});
});

//testing the route functionality
describe('Validate POST Route', function() {

	it('API Post Respond with Data Sent In', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/')
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
	    .post('/api/')
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