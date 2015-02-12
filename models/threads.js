var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ThreadSchema = Schema({
	classId: 	{type: String},
    userId: 	{type: String},
	time: 		{type: Date, default: Date.now},
	content: 	{type: String},
	title: 		{type: String}, 
	viewed: 	{type: [ObjectId]},
	answered: 	{type: Boolean}
});

var Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;
console.log('mongoose connected1');
