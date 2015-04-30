var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var q = require('q');

schema = mongoose.Schema({
	username: { type: String, require: true },
	email: { type: String, unique: true, require: true },
	password: { type: String, require: true },
});

schema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(12, function(err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, function(err, hash) {
			user.password = hash;
			return next();
		});
	});
});

schema.methods.comparePassword = function(pass) {
	var deferred = q.defer();
	bcrypt.compare(pass, this.password, function(err, isMatch) {
		if (err) {
			deferred.reject(err);
		}
		else {
			deferred.resolve(isMatch);
		}
	});
	return deferred.promise;
};


module.exports = mongoose.model('User', schema);