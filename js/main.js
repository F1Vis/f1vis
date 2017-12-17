"use strict";

/*
 * This file contains the main control flow.
 */

preprocessor.load(function(data) {
  // Some sample code for a year selector - TODO: Improve a lot and move somewhere else
  var yearSelector = $("#seasonByYearSelector");
  var seasons = processor.getSeasonsWithLapData();
  for(var season in seasons){ yearSelector.append("<option>" + seasons[season].year + "</option>"); }

  createLineGraph("#lineGraphBox", processor.getRace(970));
});
