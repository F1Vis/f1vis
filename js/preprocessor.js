"use strict";

/*
 * In this file, functions for loading and preprocessing the data are defined.
 */

/* 
 * Define the functions responsible for fetching+preprocessing data in a preprocessor object
 */
var preprocessor = {
  // Structure that gets filled with results
  results: {
    circuits: null,
    constructorResults: null,
    constructors: null,
    constructorStandings: null,
    drivers: null,
    driverStandings: null,
    lapTimes: null,
    pitStops: null,
    qualifying: null,
    races: null,
    results: null,
    seasons: null
  },

  // data/circuits.csv
  fetchCircuits: function (callback) {
    d3.csv('data/circuits.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["circuitId"] = parseInt(d["circuitId"]);
        d["lat"] = parseFloat(d["lat"]);
        d["lng"] = parseFloat(d["lng"]);
        d["alt"] = parseInt(d["alt"]);
      });
      preprocessor.results.circuits = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/constructorResults.csv
  fetchConstructorResults: function (callback) {
    d3.csv('data/constructorResults.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["constructorId"] = parseInt(d["constructorId"]);
        d["constructorResultsId"] = parseInt(d["constructorResultsId"]);
        d["points"] = parseInt(d["points"]);
        d["raceId"] = parseInt(d["raceId"]);
        d["status"] = parseInt(d["status"]);
      });
      preprocessor.results.constructorResults = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/constructors.csv
  fetchConstructors: function (callback) {
    d3.csv('data/constructors.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["constructorId"] = parseInt(d["constructorId"]);
      });
      preprocessor.results.constructors = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/constructorStandings.csv
  fetchConstructorStandings: function (callback) {
    d3.csv('data/constructorStandings.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["constructorId"] = parseInt(d["constructorId"]);
        d["constructorStandingsId"] = parseInt(d["constructorStandingsId"]);
        d["points"] = parseInt(d["points"]);
        d["position"] = parseInt(d["position"]);
        d["raceId"] = parseInt(d["raceId"]);
        d["wins"] = parseInt(d["wins"]);
      });
      preprocessor.results.constructorStandings = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/drivers.csv
  fetchDrivers: function (callback) {
    d3.csv('data/drivers.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["dob"] = new Date(d["dob"]);
        d["driverId"] = parseInt(d["driverId"]);
        d["number"] = parseInt(d["number"]);
      });
      preprocessor.results.drivers = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/driverStandings.csv
  fetchDriverStandings: function (callback) {
    d3.csv('data/driverStandings.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["driverId"] = parseInt(d["driverId"]);
        d["driverStandingsId"] = parseInt(d["driverStandingsId"]);
        d["points"] = parseInt(d["points"]);
        d["position"] = parseInt(d["position"]);
        d["raceID"] = parseInt(d["raceId"]);
        d["wins"] = parseInt(d["wins"]);
      });
      preprocessor.results.driverStandings = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/lapTimes.csv
  fetchLapTimes: function (callback) {
    d3.csv('data/lapTimes.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["driverId"] = parseInt(d["driverId"]);
        d["lap"] = parseInt(d["lap"]);
        d["milliseconds"] = parseInt(d["milliseconds"]);
        d["position"] = parseInt(d["position"]);
        d["raceId"] = parseInt(d["raceId"]);
      });
      preprocessor.results.lapTimes = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/pitStops.csv
  fetchPitStops: function (callback) {
    d3.csv('data/pitStops.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["driverId"] = parseInt(d["driverId"]);
        d["duration"] = parseFloat(d["duration"]);
        d["lap"] = parseInt(d["lap"]);
        d["milliseconds"] = parseInt(d["milliseconds"]);
        d["raceId"] = parseInt(d["raceId"]);
        d["stop"] = parseInt(d["stop"]);
      });
      preprocessor.results.pitStops = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/qualifying.csv
  fetchQualifying: function (callback) {
    d3.csv('data/qualifying.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["constructorId"] = parseInt(d["constructorId"]);
        d["driverId"] = parseInt(d["driverId"]);
        d["number"] = parseInt(d["number"]);
        d["position"] = parseInt(d["position"]);
        d["q1"] = new Date(d["q1"]);
        d["q2"] = new Date(d["q2"]); // Is this okay?
        d["q3"] = new Date(d["q3"]);
        d["qualifyId"] = parseInt(d["qualifyId"]);
        d["raceId"] = parseInt(d["raceId"]);
      });
      preprocessor.results.qualifying = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/races.csv
  fetchRaces: function (callback) {
    d3.csv('data/races.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["circuitId"] = parseInt(d["circuitId"]);
        d["date"] = new Date(d["date"]);
        d["raceId"] = parseInt(d["raceId"]);
        d["round"] = parseInt(d["round"]);
        d["time"] = new Date(d["time"]);
        d["year"] = parseInt(d["year"]);
      });
      preprocessor.results.races = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/results.csv
  fetchResults: function (callback) {
    d3.csv('data/results.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["constructorId"] = parseInt(d["constructorId"]);
        d["driverId"] = parseInt(d["driverId"]);
        d["fastestLap"] = parseInt(d["fastestLap"]);
        d["fastestLapSpeed"] = parseFloat(d["fastestLapSpeed"]);
        d["fastestLapTime"] = new Date(d["fastestLapTime"]);
        d["grid"] = parseInt(d["grid"]);
        d["laps"] = parseInt(d["laps"]);
        d["milliseconds"] = parseInt(d["milliseconds"]);
        d["number"] = parseInt(d["number"]);
        d["points"] = parseInt(d["points"]);
        d["position"] = parseInt(d["position"]);
        d["positionOrder"] = parseInt(d["positionOrder"]);
        d["raceId"] = parseInt(d["raceId"]);
        d["rank"] = parseInt(d["rank"]);
        d["resultId"] = parseInt(d["resultId"]);
        d["statusId"] = parseInt(d["statusId"]);
        d["time"] = new Date(d["time"]);
      });
      preprocessor.results.results = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/seasons.csv
  fetchSeasons: function (callback) {
    d3.csv('data/seasons.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["year"] = parseInt(d["year"]);
      });
      preprocessor.results.seasons = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // data/status.csv
  fetchStatus: function (callback) {
    d3.csv('data/status.csv', function(data) {
      // preprocess data
      data.forEach(function(d, i) {
        d["statusId"] = parseInt(d["statusId"]);
      });
      preprocessor.results.status = data; // Store results
      loadingDialog.itemFinished(); // Update loading dialog progress bar
      callback(null); // Tell the queue we're done.
    });
  },

  // Starts the fetch+preprocess step, calls back given function with results.
  load: function(callback) {
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
        // Throw errors so we can see them
        if(error) throw error;
        // Hide the loading dialog
        loadingDialog.hide();
        // Callback with the results
        callback(preprocessor.results);
      });
  },

  // Simple getter method to fetch the raw data
  getResults: function() {
    return preprocessor.results;
  },

};
