exports.newPost = function(req, res) {
	var classId = req.params.classId;
	var threadId = req.params.threadId;
	var userId = req.params.userId;
	var content = req.params.content;

	var newPost = '{' +
				  '"classId" : ' + classId + ','
				  '"threadId" : ' + classId + ','
				  '"userId" : ' + userId + ','
				  '"content" : ' + content +
				  '}';
	res.json(newPost);
}