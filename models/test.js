// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var testSchema = mongoose.Schema({

   	name: { type: String }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Test', testSchema);
