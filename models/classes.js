var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ClassSchema = Schema({
	className: {type: String, unique: true}
});

var Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
