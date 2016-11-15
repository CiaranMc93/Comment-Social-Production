// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userPostSchema = mongoose.Schema({

	username : String,
	text : String,
	dateTime : String,

	submission : [{
		text : String,
		dateTime : String
	}]
});


// create the model for users and expose it to our app
module.exports = mongoose.model('UserPost', userPostSchema);