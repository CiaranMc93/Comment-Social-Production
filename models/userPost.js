// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userPostSchema = mongoose.Schema({

	username : String,
	text : String,
	dateTime : String,
	//location
	cityName : String,
	lat : String,
	long : String,
	temp : String,

	//capture all the replies for this 
	replies : [{
		username : String,
		text: String,
		dateTime : String,
		//location
		cityName : String,
		lat : String,
		long : String,
		temp : String
	}]
});


// create the model for users and expose it to our app
module.exports = mongoose.model('UserPost', userPostSchema);