"use strict";

/*
 * This file defines functions that create d3 datasets from the rawData provided by preprocessor.getResults()
 */

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

 /*
   * TODO
   */
  getLapDataByRaceID: function(raceid) {
    var rawData = preprocessor.getResults();
    var raceID = raceid;
    var lapTimes = rawData['lapTimes'].filter((val) => {return val['raceId'] == raceID;});
    var groupedLapTimes = {};
    lapTimes.forEach(function(d,i) {
        var lapNum = d["lap"];
        var driverId = d["driverId"];
        if(groupedLapTimes[lapNum] === undefined) groupedLapTimes[lapNum] = {};
        groupedLapTimes[lapNum][driverId] = d["milliseconds"];
    });
    return groupedLapTimes;
  }

};
