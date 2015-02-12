var express = require('express');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var router = express.Router();


var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 

var mongodbUri = 'mongodb://master:Super7K@ds041821.mongolab.com:41821/db';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


var users = require('../models/users');
var classes = require('../models/classes');
var threads = require('../models/threads');
var posts = require('../models/posts')


/* GET home page. */
router.get('/', function(req, res, next) {

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
router.get('/class/:fullname/:className', function(req, res, next) {

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
router.get('/class/:fullname/:className/:id', function(req, res, next) {

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
									posts: allPosts });

		});
	});
});

/* GET class thread */

module.exports = router;
