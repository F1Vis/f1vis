"use strict";

/*
 * This file contains the main control flow.
 */

var slyelement = {
  obj: {},
  el: '.frame',
  options: {
   horizontal: 1,
	itemNav: 'basic',
	smart: 1,
	activateOn: 'click',
	mouseDragging: 1,
	touchDragging: 1,
	releaseSwing: 1,
	startAt: 3,
	scrollBar: $('.strecken-selector').parent().find('.scrollbar'),
	scrollBy: 1,
	pagesBar: $('.strecken-selector').parent().find('.pages'),
	activatePageOn: 'click',
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
   

  // Some sample code for a year selector - TODO: Improve a lot and move somewhere else
  var yearSelector = $("#seasonByYearSelector");

  var seasons = processor.getSeasonsWithLapData();

  for(var season in seasons){ yearSelector.append("<option>" + seasons[season].year + "</option>"); }
  
  // Someone chose a year
  yearSelector.change(function(event) {
    var selectedYear = $(event.target).val();
    var races = processor.getRacesByYear(selectedYear);
    $("#courseSelection").empty();
    for(var race in races) {      
      $("#courseSelection").append("<li>" + races[race].raceInfo.name  +" " + races[race].raceInfo.date + "</li>");
    }
    slyelement.obj.reload();
    var raceData = races[0];
    createLineGraph("#lineGraphBox", processor.getRace(974));
  });

  $(window).resize(function(e) {
    slyelement.obj.reload();
  });

});
