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
    return rawData.drivers[driverId];
  },

  getDriversByRaceId: function(raceId) {
    var rawData = preprocessor.getResults();

    var result = queries.getResultsByRaceId(raceId).map((cur) => queries.getDriverById(cur.driverId));

    return result;
  },

  getResultsByRaceId: function(raceId) {
    var rawData = preprocessor.getResults();

    var tempList = [];
    for(var key in rawData.results){
      if(rawData.results[key].raceId == raceId){
        tempList.push(rawData.results[key]);
      }
    }

    tempList.sort((o1,o2) => o1["positionOrder"] - o2["positionOrder"]);

    return tempList;
  },

  getPitStopsByRaceId: function(raceId) {
    var rawData = preprocessor.getResults();

    var tempList = [];
    for(var key in rawData.pitStops){
      if(rawData.pitStops[key].raceId == raceId){
        tempList.push(rawData.pitStops[key]);
      }
    }

    tempList.sort((o1,o2) => o1["stop"] - o2["stop"]);
    //var tempList = rawData.pitStops.filter(cur => cur.raceId == raceId);

    return tempList;
  },

  getLapDataByRaceId: function(raceId) {
    var rawData = preprocessor.getResults();

    var lapTimes = [];
    for(var key in rawData.lapTimes){
      if(rawData.lapTimes[key].raceId == raceId){
        lapTimes.push(rawData.lapTimes[key]);
      }
    }

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

  getRaceById: function(raceId){
    var rawData = preprocessor.getResults();
    return rawData.races[raceId];
  },

  getRacesByYear: function(year){
    var rawData = preprocessor.getResults();

    var races = [];
    for(var key in rawData.races){
      if(rawData.races[key].year == year){
        races.push(rawData.races[key]);
      }
    }
    races.sort((o1,o2) => o1["round"] - o2["round"]);

    return races;

  },

  getQualifingDataByRaceId: function(raceId) {
    var rawData = preprocessor.getResults();

    var qualifingData = [];
    for(var key in rawData.qualifying){
      if(rawData.qualifying[key].raceId == raceId){
        qualifingData.push(rawData.qualifying[key]);
      }
    }
     //var result = rawData.qualifying.filter((cur) => (cur.raceId == raceId));
     qualifingData.sort((o1,o2) => o1["position"] - o2["position"]);
     return qualifingData;
  }

};
