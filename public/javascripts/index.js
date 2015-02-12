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

	$('#new-post').click(addPost);
});

function addPost(e) {
	console.log('adding post');
	var fullName = 'Young Shiau';
	var time = new Date();
	var content = 'New post at time: ' + time;
	var url = '/newpost/' + fullName + '/' + time + '/' + content;

	// should actually populate urls with IDs to do a query in index.js
	$.get(url, function(result) {
		//append li
		console.log(result);
		result = $.parseJSON(result);

		/*
    li.comment
      div.classname
        div.pic.young
        div #{fullname}
        div.posttime #{post.time}
        div.postcontent 
          p #{post.content}
		*/
		var html = 	'<li class="comment">' + 
						'<div class="classname">' + 
							'<div class="pic young"></div>' +
							'<div>' + result.fullname + '</div>' + 
							'<div class="posttime">' + result.time + '</div>' +
							'<div class="postcontent">' +
								'<p>' + result.content + '</p>' + 
							'</div>'
						'</div>' + 
					'</li>';
		$('ul').append(html);
	});
}
