var express = require('express');
var router = express.Router();

/*
var users = require('../users.jason');
var threads = require('../threads.json');
var comments = require('../comments.json');
*/

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Home', view: 'home' });
});

/* GET class page. */
// passes in index.jade, but renders with different title
router.get('/class', function(req, res, next) {
	res.render('index', { title: 'CSE3', view: 'class' });
});

/* GET class thread */

module.exports = router;
