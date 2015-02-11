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
var ClassSchema = Schema({
	className: {type: String}
});
var ThreadSchema = Schema({
	classId: 	{type: ObjectId},
    userId: 	{type: ObjectId},
	time: 		{type: Date, default: Date.now},
	content: 	{type: String},
	title: 		{type: String}, 
	viewed: 	{type: [ObjectId]},
	answered: 	{type: Boolean}
});
var PostSchema = Schema({
	classId: 	{type: ObjectId},
	threadId: 	{type: ObjectId},
    userId: 	{type: ObjectId},
	time: 		{type: Date, default: Date.now},
	content: 	{type: String}
});

var User = mongoose.model('User', UserSchema);


mongoose.connect('mongodb://localhost/db');
module.exports = User;
console.log('mongoose connected');
