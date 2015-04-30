var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var mdb = require('moviedb')('6a312a64a582dbda62ee57c52c3d9281');

var app = express();
var User = require('./api/models/User');
var mongoUri = "mongodb://localhost:27017/watch-list";

mongoose.connect(mongoUri);
mongoose.connection.once('open', function(){
	console.log('Connected to database at ' + mongoUri);
});

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, function(username, password, done) {
	User.findOne({ email: username }).exec().then(function(user) {
		if(!user) {
			return done(null, false);
		}
		user.comparePassword(password).then(function(isMatch) {
			if(!isMatch) {
				return done(null, false);
			}
			return done(null, user);
		});
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(session({
	secret: 'supersecret123pizzeroni'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
	usernameField: "email",
	passwordField: "password"
	},
	function(username, password, done) {
		User.findOne({ email: username }).populate('savedListings').exec(function(error, user) {
			if(error) {
				return done("LocalStrategy error: " + error);
			}
			if(!user) {
				return done(null, false, { message: "Incorrect email" });
			}
			user.comparePassword(password).then(function(matched) {
				if(!matched) {
					return done(null, false, { message: "Incorrect password" });
				}
			return done(null, user);
		});
	})
}));

app.post('/api/auth', passport.authenticate('local'), function(req, res) {
	return res.status(200).end();
});
app.post('/api/register', function(req, res){
	var newUser = new User(req.body);
	newUser.save(function(err, user) {
		if(err) {
			return res.status(500).end();
		}
		return res.json(user);
	});
});
app.post('/api/movielist', function(req, res){
	console.log(req.body);
});

app.put('/api/saveListing', function(req, res) {
	User.findById(req.user._id).exec().then(function(response){
		response.savedListings[response.savedListings.length] = Mongoose.Types.ObjectId(req.body.savedListings);
		response.markModified('savedListings');
		response.save(function(err, resp){
			console.log(err, resp)
			if(err) {
				res.status(500).json(err);
			} else {
				res.status(200).send("posting saved");
			}
		});
		console.log("3333333333333333333", response)
	}, function(err){
		console.log("error handling for DB")
		res.status(500).json(err)
	});
});

var isAuthed = function(req, res, next){
	if (!req.isAuthenticated()) {
		return res.status(403).end();
	}
	return next();
};

app.get('/api/:name/:page', function(request, response){
	mdb.searchMovie({query: request.params.name, page: request.params.page}, function(err, res){
	  return response.json(res);
	});
});

app.get('/api/user', function(req, res){
	console.log(req.user)
	return res.json(req.user)
});

app.get('/api/logout', function(req, res) {
	req.logout();
	console.log('done')
	res.status(200).json(req.user);
});

app.listen(8000, function(){
	console.log('Listening on port 8000');
});