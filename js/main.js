"use strict";

/*
 * This file contains the main control flow.
 */

var slyelement = {
  obj: {},
  curRaces: {},
  curRaceId: 0,
  el: '.frame',
  options: {
   horizontal: 1,
	itemNav: 'basic',
	smart: 1,
	//activateOn: 'click',
	//activatePageOn: 'click',
	mouseDragging: 0,
	touchDragging: 1,
	releaseSwing: 0,
	startAt: 3,
	scrollBar: $('.strecken-selector').parent().find('.scrollbar'),
	scrollBy: 1,
	pagesBar: $('.strecken-selector').parent().find('.pages'),
	speed: 300,
	elasticBounds: 1,
	dragHandle: 1,
	dynamicHandle: 1,
	clickBar: 1,
  }
};


preprocessor.load(function(data) {
    slyelement.obj = new Sly($(slyelement.el), slyelement.options);
    slyelement.obj.init();

  // Create list of available years in descending order
  var yearSelector = $("#seasonByYearSelector");
  var seasons = processor.getSeasonsWithLapData();
  for(var season in seasons){ yearSelector.prepend("<option>" + seasons[season].year + "</option>"); }

  // Someone chose a year
  yearSelector.change(function(event) {
    var selectedYear = $(event.target).val();
    slyelement.curRaces = processor.getRacesByYear(selectedYear);
    // Empty the course selector
    $("#courseSelection").empty();
    // ... and fill it with fresh races to choose from
    for(var race in slyelement.curRaces) {
        var raceD = slyelement.curRaces[race];
          $("#courseSelection").append("<li data=\"" + raceD.raceInfo.raceId + "\">" +
            "<span class=\"coursename\">" + raceD.raceInfo.name  +"</span>"+
            "<div class=\"courseimagecontainer\"></div>" + germanDateString(raceD.raceInfo.date) + "</li>");

	  $("#courseSelection li").click(function(event) {
	    var raceI = event.currentTarget.attributes.data.value;
            // Internal check if element was already selected
            if(slyelement.curRaceId == raceI){ return true; }
            slyelement.curRaceId = raceI;
            // Clear previously selected courses
            $("#courseSelection .selected").removeClass("selected");
            // Mark selected course
            $(event.currentTarget).addClass("selected");
            // Fetch race data
	    var rdata = slyelement.curRaces.filter(r => r.raceInfo.raceId == raceI)[0];
            // Put information about race into race info box
            $("#race-infobox").html(renderRaceInfoBox(rdata)); // See util.js
             // Put information about drivers into driver info box
            $("#driver-infobox").html(renderDriverInfoBox(rdata)); // See util.js
            $('#driver-infobox table').DataTable({paging: false});
           // Hand off to diagram rendering
	    $("#lineGraphBox").empty();
  	    createLineGraph("#lineGraphBox", rdata);
	});
        slyelement.obj.reload();
    }
    // Refresh carousell after building the selector
    slyelement.obj.reload();
    // Register hover event
    $("#courseSelection li").hover(function(event){
      // handlerIn
      $(event.currentTarget).addClass("hover");
    }, function(event) {
      // handlerOut
      $(event.currentTarget).removeClass("hover");
    });

    // TODO: Now add all the images without disturbing the user
    for(var race in slyelement.curRaces) {
        var raceD = slyelement.curRaces[race];
        var url = raceD.raceInfo.url;
        var pathName = url.substring(url.lastIndexOf("/")+1);
        getImageFromWikipedia(raceD,pathName,100,(raceD1,imageURL) => {
          var imageTag = "<img src=\"" + imageURL + "\"class=\"courseimage\"/> ";
          $("#courseSelection li[data="+raceD1.raceInfo.raceId+"] .courseimagecontainer").append(imageTag);
        });
    }
  });

  $(window).resize(function(e) {
    slyelement.obj.reload();
  });

  $( "#toggle-btn" ).click(function() {
    if ( $( "#selector-card .card-body" ).is( ":hidden" ) ) {
      $( "#selector-card .card-body" ).slideDown();
      $('#icon-up-arrow').animate({  borderSpacing: 0 - 90 }, {
         step: function(now,fx) {
           $(this).css('-webkit-transform','rotate('+now+'deg)');
           $(this).css('-moz-transform','rotate('+now+'deg)');
           $(this).css('transform','rotate('+now+'deg)');
         },
         duration: 150
      },'linear');
    } else {
      $( "#selector-card .card-body" ).slideUp();
      $('#icon-up-arrow').animate({  borderSpacing: 180 - 90 }, {
         step: function(now,fx) {
           $(this).css('-webkit-transform','rotate('+now+'deg)');
           $(this).css('-moz-transform','rotate('+now+'deg)');
           $(this).css('transform','rotate('+now+'deg)');
         },
         duration: 150
      },'linear');
    }
  });

  // Select most recent year by default
  $("#seasonByYearSelector").val($("#seasonByYearSelector option").first().val()).change();

  // Enable tooltips
  $('[data-toggle="tooltip"]').tooltip()
});
