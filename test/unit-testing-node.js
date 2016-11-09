var chai = require('chai');
var chaiHttp = require('chai-http');
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

	it('Check /username/ ', function(done) {
	chai.request(server)
		//post to a specific route
	    .post('/api/username/')
	    .set('content-type', 'application/x-www-form-urlencoded')
	    //send in the JSON data
	    .send({'Username': 'Ciaran'})
	    .end(function(err, res){
	    	//check that the status is OK, the format is in JSON and that the body is an object
		    res.should.have.status(200);
		    res.should.be.json;
		    res.body.should.be.a('object');
		    //check to make sure the json object has a property of Username and make sure the name is equal to what we have sent in
		    res.body.should.have.property('Username');
		    res.body.Username.should.equal('Ciaran');
		    //done with the test
	      	done();
	      	//process exit is used so that the continuous integration application can complete the builds
	      	process.exit();
	    });
	});
});