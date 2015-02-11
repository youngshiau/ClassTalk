var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = Schema({
	firstname: 	{type: String},
	lastname: 	{type: String},
	username: 	{type: String},
	password: 	{type: String},
	email: 		{type: String},
	code: 		{type: String},
	confirmed: 	{type: Boolean},
	salt: 		{type: String},
	classes: 	{type: [ObjectId]}
});

var User = mongoose.model('User', UserSchema);


mongoose.connect('mongodb://localhost/db');
module.exports = User;
console.log('mongoose connected');
