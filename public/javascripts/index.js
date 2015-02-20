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
	$('#hide-thread').click(hideThread);

	$('#new-post').click(addPost);
	$('#hide-post').click(hidePost);

	$('#pref').click(showPreferences);
	$('#pref-hide').click(hidePreferences);

	$('.delete').click(deleteClass);
	$('#cancel-delete').click(cancelDeleteClass);
});

function addClass(e) {
	$('#classes').show();
}

function hideClass(e) {
	$('#classes').hide();
	return false;
}

function addThread(e) {
	$('#threads').show();
}

function hideThread(e) {
	$('#threads').hide();
	return false;
}

function addPost(e) {
	$('#posts').show();
}

function hidePost(e) {
	$('#posts').hide();
	return false;
}

function showPreferences(e) {
	$('#pref-panel').show();
}

function hidePreferences(e) {
	$('#pref-panel').hide();
	return false;
}

function deleteClass(e) {
	e.preventDefault();
	var classNumber = $(this).attr('data');
	$('#class-to-delete').html('CSE ' + classNumber + '?');
	$('#hidden-class-to-delete').attr('value', classNumber);
	$('#delete-class').show();
	return false;
}

function cancelDeleteClass(e) {
	$('#delete-class').hide();
	return false;
}
