"use strict";

/*
 * This file contains the main control flow.
 */

console.log("Let's load and preprocess all data properly.");

// Show loading dialog
loadingDialog.show(13);

// Create a queue, add all the fetch&process functions and await their results
d3.queue()
  .defer(preprocessor.fetchCircuits)
  .defer(preprocessor.fetchConstructorResults)
  .defer(preprocessor.fetchConstructors)
  .defer(preprocessor.fetchConstructorStandings)
  .defer(preprocessor.fetchDrivers)
  .defer(preprocessor.fetchDriverStandings)
  .defer(preprocessor.fetchLapTimes)
  .defer(preprocessor.fetchPitStops)
  .defer(preprocessor.fetchQualifying)
  .defer(preprocessor.fetchRaces)
  .defer(preprocessor.fetchResults)
  .defer(preprocessor.fetchSeasons)
  .defer(preprocessor.fetchStatus)
  .awaitAll(function(error) {
    // All data loaded by the deferred functions, now we're ready for business
    // (call more functions :D)
    console.log("All done. Ready.");
    // Throw errors so we can see them
    if(error) throw error;
    // Hide the loading dialog
    loadingDialog.hide();
  });
