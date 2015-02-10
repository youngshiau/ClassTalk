$(document).ready(function() {
	$('#settings').click(function() {
		$('#search').removeClass('invert');
		$('#settings').toggleClass('invert');
		$('#search-panel').hide("blind", {"direction": "up"});
		$('#settings-panel').toggle("blind", {"direction": "right"});
	});
	
	$('#search').click(function() {
		$('#settings').removeClass('invert');
		$('#search').toggleClass('invert');
		$('#settings-panel').hide("blind", {"direction": "right"});
		$('#search-panel').toggle("blind", {"direction": "up"});
	});
})
