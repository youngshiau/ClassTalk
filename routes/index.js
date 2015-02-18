var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();


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

/*
 *----------------------------------------------------------------------------
 * BEGIN USER AUTH TESTING
 *----------------------------------------------------------------------------
 */

// issue: asynchronous, so testUser doesnt exist when we try to check later. should be fine
//		  because user registration will be separate from user login
// create the test user
/*
var testUser = new users({
	firstname: 'Young',
	lastname: 'Shiau',
	password: 'pw',
	email: 'yshiau@ucsd.edu'
});

// save test user to db
testUser.save(function(err) {
	if(err) {
		throw err;
	}
});
*/


function checkAuth(req, res, next) {
	if(!req.session.email) {
		res.send('You are not authorized to view this page.');
	} else {
		next();
	}
}

/*
 *----------------------------------------------------------------------------
 * END USER AUTH TESTING
 *----------------------------------------------------------------------------
 */


/* GET login page. */
router.get('/login', checkAuth, function(req, res, next) {
	res.render('index', { title: 'Login',
				  view: 'login',
				  success: true });
});

router.post('/login', function(req, res) {
	var email = req.body.user.email;
	var password = req.body.user.password;

	users.findOne({ email: email }, function(err, user) {
		if(err) {
			throw err;
		}

		// check passwords
		user.comparePassword(password, function(err, isMatch) {
			if(err) {
				throw err;
			}

			console.log('correct password: ', isMatch);

			// authenticated; login
			if(isMatch) {
				req.session.email = email;
				res.redirect('/');
			} 
			// failed; reject
			else {
				res.send('login failed');
			}
		});
	});
});

router.get('/register', function(req, res) {
	res.render('index', { title: 'Register',
						  view: 'register' });
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
		}

		res.redirect('/login');
	});
});

router.get('/logout', function(req, res) {
	delete req.session.email;
	res.redirect('/login');
});

/* GET home page. */
router.get('/', checkAuth, function(req, res, next) {
	var allClasses;
	var fullname;

	// query the db for someone whose username is youngshiau
	var query = classes.find().sort({className: 1});

	// select the following fields from that user
	query.select('className');

	query.exec(function(err, classes) {
		if(err) {
			return handleError(err);
		}
		allClasses = classes;


		// i dont wanna nest this like this, but it fixes the async thing.
		// should fix this later, at some point. probably when i implement
		// user logins

		// query the db for someone whose username is youngshiau
		query = users.findOne({username: 'youngshiau'});

		// select the following fields from that user
		query.select('firstname lastname _id');

		// execute the query and save the data into user
		query.exec(function(err, user) {
			if(err) {
				return handleError(err);
			}
			fullname = user.firstname + ' ' + user.lastname;

			res.render('index', { 	title: 'Home', 
									view: 'home',
									classes: allClasses,
									fullname: fullname });
		});

	});



});

/* GET class threads (all). */
router.get('/class/:fullname/:className', checkAuth, function(req, res, next) {

	var className = req.params['className'];
	var title = "CSE " + className;
	var fullname = req.params['fullname'];
	var allThreads;


	var query = threads.find().sort({title: 1});
	query.select('title content time _id');
	query.exec(function(err, threads) {
		if(err) {
			return handleError(err);
		}
		allThreads = threads;	

		res.render('index', { 	title: title, 
						view: 'class', 
						fullname: fullname,
						className: className,
						threads: allThreads });
	});

});

/* GET class thread (single) */
router.get('/class/:fullname/:className/:id', checkAuth, function(req, res, next) {

	var className = req.params['className'];
	var title = "CSE " + className;
	var fullname = req.params['fullname'];
	var threadId = req.params['id'];

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
			res.render('index', { 	title: title, 
									view: 'class-thread', 
									fullname: fullname,
									className: className,
									thread: thread,
									posts: allPosts
								});

		});
	});
});

router.get('/newpost/:fullname/:time/:content', checkAuth, function(req, res, next) {
	var fullname = req.params['fullname'];
	var time = req.params['time'];
	var content = req.params['content'];
	// should actually receive IDs and do query.
	var jsonText = '{' + 
					'"fullname" : "' + fullname + '", ' +
					'"time" : "' + time + '", ' +
					'"content" : "' + content + '"' + 
	           '}';

	res.json(jsonText);
});

/* GET class thread */

module.exports = router;
