$.get('http://localhost/js/dateModified/dateModified.txt', function(data) {
	$("#lastModified").html(data);
});