var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ClassSchema = Schema({
	className: {type: String}
});

var Class = mongoose.model('Class', ClassSchema);


mongoose.connect('mongodb://localhost/db');
module.exports = Class;
console.log('mongoose connected');
