var express = require('express');
var mongoose = require('mongoose');
//var checkAuth = require('../middleware/checkAuth');

var router = express.Router();

//router.use(checkAuth());

//console.log('middleware used.');


var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 

var mongooseUri = 'mongodb://master:Super7K@ds041821.mongolab.com:41821/db';

mongoose.connect(mongooseUri, options, function(err) {
	if(err) {
		throw err;
	}
	console.log('Successfully connected to remote MongoDB server.');
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


var users = require('../models/users');
var classes = require('../models/classes');
var threads = require('../models/threads');
var posts = require('../models/posts');

var location = [];

router.get('/', function(req, res) {
	if(req.session) {
		res.redirect('/main');
	}
	else {
		res.redirect('/login');
	}
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	location.push('/login');
	res.render('main', { title: 'Login',
				  		  view: 'login',
				  		  back: '/login',
				  		  success: true });
});

router.post('/login', function(req, res) {
	var email = req.body.user.email;
	var password = req.body.user.password;
	console.log(email);
	console.log(password);

	users.findOne({ email: email }, function(err, user) {
		if(err) {
			throw err;
		}

		// check passwords
		console.log('input pw: ' + password);
		console.log('db pw: ' + user.password);
		user.comparePassword(password, function(err, isMatch) {
			if(err) {
				throw err;
			}

			console.log('correct password? ', isMatch);

			// authenticated; login
			if(isMatch) {
				req.session.uid = user._id;
				console.log(req.session.uid);
				req.session.email = email;
				req.session.fullname = user.firstname + ' ' + user.lastname;
				req.session.location = [];
				res.redirect('/main');
			} 
			// failed; reject
			else {
				res.send('login failed');
			}
		});
	});
});

router.get('/register', function(req, res) {
	location.push('/register');
	console.log('register');
	res.render('main', { title: 'Register',
						  view: 'register',
						  back: '/login' });
});

router.post('/register', function(req, res) {
	var firstname = req.body.user.firstname;
	var lastname = req.body.user.lastname;
	var password = req.body.user.password;
	var email = req.body.user.email;

	var newUser = new users({
		firstname: firstname,
		lastname: lastname,
		password: password,
		email: email
	});

	newUser.save(function(err) {
		if(err) {
			// email already exists;
			console.log('email already exists: ' + err);
			res.send('Error: email already exists in system.');
		}

		res.redirect('/login');
	});
});

router.get('/logout', function(req, res) {
	delete req.session;
	res.redirect('/login');
});

/* GET home page. */
router.get('/main', /*checkAuth,*/ function(req, res, next) {
	location.push('/main');

	var allClasses;
	var fullname;

	req.session.location = ['Home'];

	// query the db for someone whose username is youngshiau
	var query = users.find( {_id: req.session.uid} );

	// select the following fields from that user
	query.select('classes');

	query.exec(function(err, classes) {
		if(err) {
			return handleError(err);
		}

		console.log('classes: ' + classes);
		classes = classes.classes;

		if(classes != 'undefined') {
			hasClasses = false;
		}
		else {
			hasClasses = true;
		}

		console.log('hasClasses: ' + hasClasses);

		res.render('main', { 	title: 'Home', 
								view: 'home',
								classes: classes,
								hasClasses: hasClasses,
								fullname: req.session.fullname,
								back: '/main' });

	});



});

/* GET class threads (all). */
router.get('/class/:className', /*checkAuth,*/ function(req, res, next) {

	var className = req.params['className'];

	location.push('/class/' + className);

	var title = "CSE " + className;
	var fullname = req.session.fullname;
	var allThreads;


	var query = threads.find().sort({title: 1});
	query.select('title content time _id');
	query.exec(function(err, threads) {
		if(err) {
			return handleError(err);
		}
		allThreads = threads;	

		res.render('main', { 	title: title, 
						view: 'class', 
						fullname: fullname,
						className: className,
						threads: allThreads,
						back: '/main' });
	});

});

/* GET class thread (single) */
router.get('/class/:className/:id', /*checkAuth,*/ function(req, res, next) {

	var className = req.params['className'];
	var title = "CSE " + className;
	var fullname = req.session.fullname;
	var threadId = req.params['id'];

	location.push('/class/' + className + '/' + threadId);

	var query = threads.find({ _id: threadId });
	query.select('title content time user _id');
	query.exec(function(err, thread) {
		if(err) {
			return handleError(err);
		}
		thread = thread[0];
		query = posts.find({ threadId: threadId });
		query.exec(function(err, allPosts) {
			if(err) {
				return handleError(err);
			}
			res.render('main', { 	title: title, 
									view: 'class-thread', 
									fullname: fullname,
									className: className,
									thread: thread,
									posts: allPosts,
									back: '/class/' + className
								});

		});
	});
});

/* add a class */
router.post('/addClass', function(req, res, next) {

});

module.exports = router;
