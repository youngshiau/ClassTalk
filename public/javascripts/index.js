$(document).ready(function() {
	
	$('#settings').click(function() {
		$('#search').removeClass('invert');
		$('#settings').toggleClass('invert');
		$('#search-panel').hide("slide", {"direction": "up"});
		$('#settings-panel').toggle("slide", {"direction": "right"});
	});
	
	$('#search').click(function() {
		$('#settings').removeClass('invert');
		$('#search').toggleClass('invert');
		$('#settings-panel').hide("slide", {"direction": "right"});
		$('#search-panel').toggle("slide", {"direction": "up"});
	});

	$('#new-class').click(addClass);
	$('#hide-class').click(hideClass);

	$('#new-thread').click(addThread);
	$('#hide-thread').click(hideClass);

	$('#new-post').click(addPost);
	$('#hide-post').click(hideClass);

});

function addClass(e) {
	console.log('adding a new class.');
	//$('#classes');
	$('#classes').show();
	console.log('registering hide click');

}

function hideClass(e) {
	console.log('canceling add class');
	$('#classes').hide();
	return false;
}

function addThread(e) {
	console.log('adding a new thread: ');
}

function addPost(e) {
	console.log('adding a new post: ');
}
