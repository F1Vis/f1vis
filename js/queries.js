"use strict";

var queries = {

  /*
   * Count drivers belonging to nationalities
   */
  getDriversByNationality: function() {
    var rawData = preprocessor.getResults();
 
    // Extract interesting data from raw data.
    var nationalities = {};
    rawData.drivers.forEach(function(d, i) {
      var nationality = d["nationality"];
      if(nationalities[nationality] === undefined) {
        nationalities[nationality] = 1;
      } else {
        nationalities[nationality] += 1;
      }
    });

    // Transform into d3 dataset format
    var dataset = [];
    var n;
    for(n in nationalities) {
      dataset.push({
        label: n,
        count: nationalities[n]
      });
    }

    // Return d3 dataset
    return dataset;
  },

};
