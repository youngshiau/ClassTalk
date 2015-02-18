module.exports = function () {
	console.log('inside middleware.');
	return function (req, res, next) {
	    if(req.session && !req.session.email) {
	        res.send('You are not authorized to view this page.');
	    } else {
	        next();
	    }
	}
}