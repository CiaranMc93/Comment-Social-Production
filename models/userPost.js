// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userPostSchema = mongoose.Schema({

	username : String,
	text : String,
	dateTime : String,
	//check if the post is a reply or not
	isReply : Boolean,

	//capture all the replies for this 
	replies : [{
		username : String,
		text: String,
		dateTime : String,
	}]
});


// create the model for users and expose it to our app
module.exports = mongoose.model('UserPost', userPostSchema);