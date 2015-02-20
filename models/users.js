var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = Schema({
	firstname: 	{type: String, required: true},
	lastname: 	{type: String, required: true},
	password: 	{type: String, required: true},
	email: 		{type: String, required: true, unique: true},
	classes: 	{type: [ObjectId]}
});

UserSchema.pre('save', function(next) {
	var user = this;

	// hash pw if new or modified
	if(!user.isModified('password')) {
		return next();
	}

	// generate the salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) {
			return next(err);
		}

		// hash the pw using salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) {
				return next(err);
			}

			// replace plaintext pw with hash
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

var User = mongoose.model('User', UserSchema);
//mongoose.connect('mongodb://localhost/db');
module.exports = User;
