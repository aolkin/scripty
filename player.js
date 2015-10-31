$(function() {

    var show = location.search.slice(1);
    var parts = new Set();
    var lines;
    
    $.getJSON(show + "/lines.json", function(data, statux, xhr) {
	lines = data;
	for (var i of lines) {
	    parts.add(i[0]);
	}
	for (var i of parts.entries()) {
	    console.log(i);
	    $("#character").append($("<option>").text(i).attr("value",i));
	}
    });

});
