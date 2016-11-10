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

	it('Should respond with form data sent in', function(done) {
	chai.request(server)
		//get the correct route to test
	    .post('/api/')
	    .set('content-type', 'application/x-www-form-urlencoded')
	    .send({'username':'Ciacavus', 'name':'Ciaran'})
	    .end(function(err, res){
	    	//test assertions about the code.
		    res.should.have.status(200);
		    res.body.should.be.a('object');
		    //check the data we get back from the server
		    res.body.should.have.property('username');
		    res.body.username.should.equal('Ciacavus');
		    res.body.should.have.property('name');
		    res.body.name.should.equal('Ciaran');
		    done();
	    });
	});
});