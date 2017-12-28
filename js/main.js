"use strict";

/*
 * This file contains the main control flow.
 */

var slyelement = {
  obj: {},
  curRaces: {},
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
    slyelement.curRaces = processor.getRacesByYear(selectedYear);
    $("#courseSelection").empty();
    for(var race in slyelement.curRaces) {
        var raceD = slyelement.curRaces[race];
      $("#courseSelection").append("<li data=\"" + raceD.raceInfo.raceId + "\">" + raceD.raceInfo.name  +" " + raceD.raceInfo.date + "</li>");
    }
    $("#courseSelection li").click(function(event) {
       var raceI = event.target.attributes.data.value;
       var rdata = slyelement.curRaces.filter(r => r.raceInfo.raceId == raceI)[0];
       $("#lineGraphBox").empty();
       createLineGraph("#lineGraphBox", rdata);
    });
    slyelement.obj.reload();    
  });

  $(window).resize(function(e) {
    slyelement.obj.reload();
  });

});
