var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var users = require('../models/users');

/*
var users = require('../users.jason');
var threads = require('../threads.json');
var comments = require('../comments.json');
*/

/* GET home page. */
router.get('/', function(req, res, next) {

	// query the db for someone whose username is youngshiau
	var query = users.findOne({username: 'youngshiau'});

	// select the following fields from that user
	query.select('firstname lastname _id');

	// execute the query and save the data into person
	query.exec(function(err, user) {
		if(err) {
			return handleError(err);
		}
		console.log('here be: ' + user.username);
		res.render('index', { title: 'Home', view: 'home', fullname: user.firstname + ' ' + user.lastname });
	});
});

/* GET class threads (all). */
router.get('/class', function(req, res, next) {
	res.render('index', { title: 'CSE3', view: 'class' });
});

/* GET class thread (single) */
router.get('/class-thread', function(req, res, next) {
	res.render('index', { title: 'CSE3', view: 'class-thread'})
});

/* GET class thread */

module.exports = router;
