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
	$('#new-thread').click(addThread);
	$('#new-post').click(addPost);
});

function addClass(e) {
	console.log('adding a new class: ');
}

function addThread(e) {
	console.log('adding a new thread: ');
}

function addPost(e) {
	console.log('adding a new post: ');
}
