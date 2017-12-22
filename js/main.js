"use strict";

/*
 * This file contains the main control flow.
 */

preprocessor.load(function(data) {
		var $frame  = $('.strecken-selector');
		var $slidee = $frame.children('ul').eq(0);
		var $wrap   = $frame.parent();
    var options = {
			horizontal: 1,
			itemNav: 'basic',
			smart: 1,
			activateOn: 'click',
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 3,
			scrollBar: $wrap.find('.scrollbar'),
			scrollBy: 1,
			pagesBar: $wrap.find('.pages'),
			activatePageOn: 'click',
			speed: 300,
			elasticBounds: 1,
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,
    };
    $('.frame').sly(options);

  // Some sample code for a year selector - TODO: Improve a lot and move somewhere else
  var yearSelector = $("#seasonByYearSelector");
  var seasons = processor.getSeasonsWithLapData();
  for(var season in seasons){ yearSelector.append("<option>" + seasons[season].year + "</option>"); }

  createLineGraph("#lineGraphBox", processor.getRace(970));
});
