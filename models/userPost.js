/**
 * @summary This file is the database modelling file so that we can define our model and use it in the application to store our data.
 *
 *
 * @since 14/11/2016
 * @author Ciaran McManus
 * @email ciaranmcmanus@live.ie
 */

// load the dependencies we need
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