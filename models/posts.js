var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PostSchema = Schema({
	classId: 	{type: ObjectId},
	threadId: 	{type: ObjectId},
    userId: 	{type: ObjectId},
	time: 		{type: Date, default: Date.now},
	content: 	{type: String}
});

var Post = mongoose.model('Post', PostSchema);


mongoose.connect('mongodb://localhost/db');
module.exports = Post;
console.log('mongoose connected');
