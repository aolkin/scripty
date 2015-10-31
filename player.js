"use strict";

let show = location.search.slice(1);
let parts = new Set();
let lines, part, partclass, position, activeAudio;
let linebox; // DOM

function sanitizeCharacter(str) {
    return str.replace(/[^A-Za-z0-9]/g,"").toLowerCase();
}

function nextLine(e) {
    if (e) {console.log(e, e.target, e.target.src);}
    if (position > 0) {
	$(".line").eq(position - 1).slideUp();
    }
    $(".line").eq(position).removeClass("text-primary");
    position++;
    $(".line").eq(position).addClass("text-primary");
    $(".line").eq(position + 1).slideDown();

    let nextPlayer = $(".playback.next");
    nextPlayer.get(0).play();
    let num = ("0000" + (position+1)).slice(-4);
    $(".playback:not(.next)").off("ended").addClass("next")
	.get(0).src = `shows/${show}/${num}.aac`;
    nextPlayer.removeClass("next");
    nextPlayer.one("ended", nextLine);
}

$(function() {
    linebox = $("#lines");
    
    $.getJSON(`shows/${show}/lines.json`, function(data, statux, xhr) {
	lines = data;
	lines.forEach( (i, index) => {
	    parts.add(i[0]);
	    let item = $("<li>").addClass("list-group-item line index-" + index +
					  " chr-" + sanitizeCharacter(i[0]));
	    item.append($("<strong>").text(i[0] + ": "));
	    item.append($("<span>").text(i[1]));
	    linebox.append(item);
	});
	for (var i of parts) {
	    $("#character").append($("<option>").text(i).attr("value",i));
	}
    });

    $("#character").change(function(){
	$("."+partclass).removeClass("text-muted");
	part = $(this).val();
	partclass = "chr-" + sanitizeCharacter(part);
	$("."+partclass).addClass("text-muted");
    });
    
    $("#start").click(function(){
	position = -1;
	$(".line").hide();
	$(".index-0").slideDown();
	let nextPlayer = $(".playback.next");
	nextPlayer.get(0).src = `shows/${show}/0000.aac`;
	nextLine();
    });
});
