var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PostSchema = Schema({
	classId: 	{type: String},
	threadId: 	{type: String},
    userId: 	{type: String},
	time: 		{type: Date, default: Date.now},
	content: 	{type: String}
});

var Post = mongoose.model('Post', PostSchema);


module.exports = Post;
console.log('mongoose connected');
