var express = require('express');
var mongoose = require('mongoose');
//var checkAuth = require('../middleware/checkAuth');

var router = express.Router();

// compare function for sorting classes
function cmp(a, b) {
	var tempA = parseInt(a);
	var tempB = parseInt(b);
	if(tempA != tempB) {
		if(tempA < tempB) {
			return -1;
		}
		else {
			return 1;
		}
	}
	return b < a;
}

// formats date into something similar to '6h ago'
function timeSince(date) {
    var seconds = Math.floor((new Date().getTime() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

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
var allClasses = require('../models/classes');
var threads = require('../models/threads');
var posts = require('../models/posts');

router.get('/', function(req, res) {
	res.redirect('/login');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('main', {	title: 'Login',
				  		  	view: 'login',
				  		  	back: '/login',
							versionStyle: 'style.css',
				  		  	success: true });
});

router.get('/invalid-login', function(req, res, next) {
	res.render('main', { 	title: 'Login',
							view: 'login',
							back: '/login',
							versionStyle: 'style.css',
							success: false });
});

router.get('/invalid-registration', function(req, res, next) {
	res.render('main', {    title: 'Register',
							view: 'register',
							back: '/register',
							versionStyle: 'style.css',
							success: false });
});

router.post('/login', function(req, res, next) {
	var email = req.body.user.email;
	var password = req.body.user.password;

	users.findOne({ email: email }, function(err, user) {
		if(err) {
			return next(err);
		}

		if(user == null) {
			res.redirect('/invalid-login');
		}
		else {

			// check passwords
			user.comparePassword(password, function(err, isMatch) {
				if(err) {
					return next(err);
				}

				// authenticated; login
				if(isMatch) {
					req.session.uid = user._id;
					req.session.email = email;
					req.session.fullname = user.firstname + ' ' + user.lastname;
					req.session.firstname = user.firstname;
					req.session.lastname = user.lastname;
					req.session.versionText = 'Post-Testing';
					req.session.toggleVersion = 1;
					req.session.versionStyle = 'style.css';
					res.redirect('/main');
				} 
				// failed; reject
				else {
					res.redirect('/invalid-login/');
					//res.send('login failed');
				}
			});

		}
	});
});

router.get('/register', function(req, res) {
	res.render('main', { title: 'Register',
						  view: 'register',
						  back: '/login',
						  success: 'true' });
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
			res.redirect('/invalid-registration');
		}
		else {
			res.redirect('/login');
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/login');
});

/* GET home page. */
router.get('/main', /*checkAuth,*/ function(req, res, next) {
	if(!req.session || !req.session.uid) {
		res.redirect('/');
	}
	else {


console.log(req.session.versionText);
console.log(req.session.versionStyle);
console.log(req.session.toggleVersion);

		var fullname;

		// query the db for someone whose username is youngshiau
		var query = users.find( {_id: req.session.uid} ).sort({order: 1});

		// select the following fields from that user
		query.select('classes');
		query.exec(function(err, classes) {
			if(err) {
				return next(err);
			}

			var hasClasses;
			if(classes[0].classes.length > 0) {
				hasClasses = true;
			} else {
				hasClasses = false;
			}

			allClasses.find().sort({order: 1}).find(function(err, allClasses) {
				res.render('main', { 	title: 'Home', 
							view: 'home',
							url: '/main',
							classes: classes[0].classes.sort(cmp),
							hasClasses: hasClasses,
							fullname: req.session.fullname,
							firstname: req.session.firstname,
							lastname: req.session.lastname,
							email: req.session.email,
							otherClasses: allClasses,
							toggleVersion: req.session.toggleVersion,
							versionText: req.session.versionText,
							versionStyle: req.session.versionStyle,
							back: '/main' });
			});
		});
	}
});

router.get('/main/change', function(req, res, next) {
	if(req.session.toggleVersion == 1) {
		req.session.toggleVersion = 0;
		req.session.versionText = 'Pre-Testing';
		req.session.versionStyle = 'style-old.css'
		res.redirect('/main');
	}
	else {
		req.session.toggleVersion = 1;
		req.session.versionText = 'Post-Testing';
		req.session.versionStyle = 'style.css'
		res.redirect('/main');
	}
});

/* GET class threads (all). */
router.get('/class/:className', /*checkAuth,*/ function(req, res, next) {

	var className = req.params['className'];

	var title = "CSE " + className;
	var fullname = req.session.fullname;
	var allThreads;

	allClasses.find( {className: className}, '_id' ).find(function(err, classId) {


		var query = threads.find( { classId: classId[0]._id.toString() } ).lean().sort({title: 1});
		query.select('title content time _id');
		query.exec(function(err, threads) {

			if(err) {
				return console.log(err);
			}
			var hasThreads = false;
			if(threads.length > 0) {
				hasThreads = true;
			}
			allThreads = threads;	

			var threadTimes = {};
			for(var i = 0; i < allThreads.length; i++) {
				var threadId = allThreads[i]._id;
				threadTimes[threadId] = timeSince(allThreads[i].time.getTime());
			}

			res.render('main', { 	title: title, 
							view: 'class', 
							url: '/class/' + className,
							fullname: fullname,
							firstname: req.session.firstname,
							lastname: req.session.lastname,
							email: req.session.email,
							className: className,
							threads: allThreads,
							time: threadTimes,
							hasThreads: hasThreads,
							toggleVersion: req.session.toggleVersion,
							versionText: req.session.versionText,
							versionStyle: req.session.versionStyle,
							back: '/main' });
		});
	});



});

/* GET class thread (single) */
router.get('/class/:className/:id', /*checkAuth,*/ function(req, res, next) {

	var className = req.params['className'];
	var title = "CSE " + className;
	var fullname = req.session.fullname;
	var threadId = req.params['id'];

	var query = threads.find({ _id: threadId });
	query.select('title content time userId _id');
	query.exec(function(err, thread) {
		if(err) {
			return console.log(err);
		}
		thread = thread[0];
		query = posts.find({ threadId: threadId });
		query.exec(function(err, allPosts) {
			if(err) {
				return console.log(err);
			}
			var hasPosts = false;
			if(allPosts.length > 0) {
				hasPosts = true;
			}
			query = users.find();
			query.exec(function(err, tempUsers) {

				// associate user IDs with names
				var allUsers = {};
				for(var i = 0; i < tempUsers.length; i++) {
					var id = tempUsers[i]._id;
					var name = tempUsers[i].firstname + ' ' + tempUsers[i].lastname;
					allUsers[id] = name;
				}

				// associate post IDs with formatted times
				var postTimes = {};
				for(var i = 0; i < allPosts.length; i++) {
					var postId = allPosts[i]._id;
					postTimes[postId] = timeSince(allPosts[i].time.getTime());
				}

				// associate thread ID with thread creator
				var author = allUsers[thread['userId']];
				console.log(author);

				// associate thread ID with formatted time
				var threadTime = timeSince(thread['time'].getTime());

				res.render('main', { 	title: title, 
										view: 'class-thread', 
										url: '/class/' + className + '/' + threadId,
										fullname: fullname,
										firstname: req.session.firstname,
										lastname: req.session.lastname,
										email: req.session.email,
										users: allUsers,
										className: className,
										thread: thread,
										posts: allPosts,
										time: postTimes,
										threadTime: threadTime,
										author: author,
										hasPosts: hasPosts,
										toggleVersion: req.session.toggleVersion,
										versionText: req.session.versionText,
										versionStyle: req.session.versionStyle,
										back: '/class/' + className
									});
			});
		});
	});
});

/* add a class */
router.post('/addClass', function(req, res) {
	var className = req.body.class;
	var uid = req.session.uid;

	users.update(
		{ _id: mongoose.Types.ObjectId(uid) },
		{ $addToSet: { 'classes': className} },
		function(err, result) {
			res.redirect('/main');
		}
	);
});

/* add a thread */
router.post('/addThread', function(req, res, next) {
	var className = req.body.thread.className;
	var userId = req.session.uid;
	var title = req.body.thread.title;
	var content = req.body.thread.content;

	allClasses.find({ className: className}, '_id', function(err, classId) {
		var newThread = new threads({
			classId: classId[0]._id.toString(),
			userId: userId,
			content: content,
			title: title
		});

		newThread.save(function(err) {
			if(err) {
				return next(err);
			}
			res.redirect('/class/' + className);
		});
	});
});

router.post('/addPost', function(req, res) {
	var className = req.body.post.className;
	var threadId = req.body.post.threadId;
	var userId = req.session.uid;
	var content = req.body.post.content;

	threads.findOne({ _id: threadId }, 'classId', function(err, classId) {


		var newPost = new posts({
			classId: classId.classId,
			threadId: threadId,
			userId: userId,
			content: content
		});


		newPost.save(function(err) {
			if(err) {
				console.log(err);
			}
			res.redirect('/class/' + className + '/' + threadId);
		});
	});
});

router.post('/updatePreferences', function(req, res) {
	var url = req.body.page.url;
	var email = req.session.email;

	var newFirstname = req.body.user.firstname;
	var newLastname = req.body.user.lastname;
	var newEmail = req.body.user.email;
	var userPassword = req.body.user.password;

	users.findOne({ email: email }, function(err, user) {
		if(err) {
			return next(err);
		}

		// check passwords
		user.comparePassword(userPassword, function(err, isMatch) {
			if(err) {
				return next(err);
			}

			// authenticated; update info
			if(isMatch) {
				var updatedUser = {
					firstname: newFirstname,
					lastname: newLastname,
					email: newEmail
				};

				users.update( { email: email }, { $set: updatedUser }, function(err, result) {
					req.session.email = newEmail;
					req.session.firstname = newFirstname;
					req.session.lastname = newLastname;
					req.session.fullname = newFirstname + ' ' + newLastname;
					res.redirect(url);
				});
			} 
			// failed; reject
			else {
				res.send('incorrect password');
			}
		});
	});
});

router.post('/deleteClass', function(req, res) {
	var classNumber = req.body.class.classNumber;
	var url = req.body.return.url;
	users.update( { _id: req.session.uid}, { $pull: {classes: classNumber } }, function(err) {
		res.redirect(url);
	});
});

module.exports = router;
