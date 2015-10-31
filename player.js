"use strict";

var show = location.search.slice(1);
var parts = new Set();
var lines, part, partclass, position = null;
var linebox, slider; // DOM

function sanitizeCharacter(str) {
    return str.replace(/[^A-Za-z0-9]/g,"").toLowerCase();
}

function seekTo(num) {
    position  = num - 2;
    nextLine();
    setTimeout(nextLine,0);
}

function nextLine(e) {
    $(".line.text-primary").removeClass("text-primary");
    position++;
    slider.slider("setValue", position);
    $("#lines").stop().scrollTo(":nth-child(" + position + ")",{
	duration: 400
    })
    $(".line").eq(position).addClass("text-primary");

    var nextPlayer = $(".playback.next");
    nextPlayer.get(0).play();
    nextPlayer.get(0).muted = (lines[position][0] == part);
    var num = ("0000" + (position+1)).slice(-4);
    var oldPlayer = $(".playback:not(.next)").off("ended").addClass("next").get(0);
    oldPlayer.src = `shows/${show}/${num}.aac`;
    nextPlayer.removeClass("next");
    nextPlayer.one("ended", nextLine);
}

$(function() {
    linebox = $("#lines");
    
    $.getJSON(`shows/${show}/lines.json`, function(data, statux, xhr) {
	lines = data;
	lines.forEach( function(i, index) {
	    parts.add(i[0]);
	    var item = $("<li>").addClass("list-group-item line index-" + index +
					  " chr-" + sanitizeCharacter(i[0]));
	    item.data("index",index).data("chr",i[0]);
	    item.append($("<strong>").text(i[0] + ": "));
	    item.append($("<span>").text(i[1]));
	    linebox.append(item);
	});
	for (var i of parts) {
	    $("#character").append($("<option>").text(i).attr("value",i));
	}
	$("#loading-option").text("Select your part:");
	
	slider = $("#progress").slider({
	    min: 0,
	    max: lines.length,
	    value: 0,
	    enabled: false
	}).on("slideStop", function(e){
	    if ($(this).val() != position) {
		seekTo($(this).val());
	    }
	}).change(function(e){
	    $("#lines").stop().scrollTo(":nth-child(" + $(this).val() + ")",{
		duration: 300
	    })
	});
    });
    
    $("#character").change(function(){
	$("."+partclass).removeClass("text-muted");
	part = $(this).val();
	partclass = "chr-" + sanitizeCharacter(part);
	$("."+partclass).addClass("text-muted");
	if ($(".hidden-part").removeClass("hidden-part").length) {
	    $("."+partclass).addClass("hidden-part");
	}
	$("#start").attr("disabled",false);
    });
    
    $("#start").click(function(){
	if (position === null) {
	    position = -1;
	    var nextPlayer = $(".playback.next");
	    nextPlayer.get(0).src = `shows/${show}/0000.aac`;
	    nextLine();
	    $("#controls-container button").attr("disabled",false);
	    slider.slider("enable");
	    $("#start").text("Play");
	} else {
	    $(".playback:not(.next)").get(0).play();
	}
    });
    $("#pause").click(function(){
	$(".playback:not(.next)").get(0).pause();
    });
    
    $("#skip").click(nextLine);
    $("#skip-to-end").click(function(){
	var player = $(".playback:not(.next)").get(0);
	player.currentTime += 5;
    });
    $("#skip-to-next").click(function(){
	var seek = position + 2;
	while (lines[seek][0] != part) {
	    seek++;
	}
	seekTo(seek - 1);
    });

    $("#show").click(function(){
	$("."+partclass).removeClass("hidden-part");
    });
    $("#hide").click(function(){
	$("."+partclass).addClass("hidden-part");
    });

    var VOLUME_FRAC = 100;
    $("#volume").slider({
	min: 0,
	max: VOLUME_FRAC,
	value: VOLUME_FRAC,
	formatter: function(val) {
	    return "Volume: " + val;
	}
    }).on("slide slideStop", function() {
	var val = $(this).val() / VOLUME_FRAC;
	$(".playback").each(function(i, el){
	    el.volume = val;
	});
    });
});
