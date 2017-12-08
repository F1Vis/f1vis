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
    for(var i in rawData.drivers) {
      var d = rawData.drivers[i];
      var nationality = d["nationality"];
      if(nationalities[nationality] === undefined) {
        nationalities[nationality] = 1;
      } else {
        nationalities[nationality] += 1;
      }
    }

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

  getDriverById: function(driverId) {
    var rawData = preprocessor.getResults();

    var result = null;

    var tempList = rawData.drivers.filter((cur) => (cur.driverId == driverId));
    if(tempList.length > 0){
      result = tempList[0];    
    }

    // Return d3 dataset
    return result;
  },

  getDriversByRaceId: function(raceId) {
    var rawData = preprocessor.getResults();


    var tempList = rawData.results.filter((cur) => (cur.raceId == raceId));

    var result = tempList.map((cur) => queries.getDriverById(cur.driverId));

    // Return d3 dataset
    return result;
  },

  getLapDataByRaceId: function(raceId) {
    var rawData = preprocessor.getResults();
    var lapTimes = rawData['lapTimes'].filter((val) => val['raceId'] == raceId);
    var myMap = new Map();
    lapTimes.forEach(function(d,i) {
        var lapNum = d["lap"];
        var driverId = d["driverId"];
        if(!myMap.has(lapNum)){
            var data = [];
            myMap.set(lapNum,data);
        }
        var dt = myMap.get(lapNum);
        dt.push(d);       
        myMap.set(lapNum,dt);
    });

    myMap.forEach((d,i) => d.sort((o1,o2) => o1["position"] - o2["position"]));

    return myMap;
  },

  getQualifingDataByRaceId: function(raceId) {
     var rawData = preprocessor.getResults();
     var result = rawData.qualifying.filter((cur) => (cur.raceId == raceId));
     result.sort((o1,o2) => o1["position"] - o2["position"]);
     return result;
  }

};
