"use strict";

/*
 * This file contains the main control flow.
 */

/* Globally define the places where the preprocessed data is stored for READ ONLY ACCESS. */

var f1Data = {
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
};

/* Define the functions responsible for fetching+preprocessing data */

// data/circuits.csv
function fetchCircuits(callback) {
  d3.csv('data/circuits.csv', function(data) {
    // preprocess data
    data.forEach(function(d, i) {
      d["circuitId"] = parseInt(d["circuitId"]);
      d["lat"] = parseFloat(d["lat"]);
      d["lng"] = parseFloat(d["lng"]);
      d["alt"] = parseInt(d["alt"]);
    });
    f1Data.circuits = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/constructorResults.csv
function fetchConstructorResults(callback) {
  d3.csv('data/constructorResults.csv', function(data) {
    // preprocess data
    data.forEach(function(d, i) {
      d["constructorId"] = parseInt(d["constructorId"]);
      d["constructorResultsId"] = parseInt(d["constructorResultsId"]);
      d["points"] = parseInt(d["points"]);
      d["raceId"] = parseInt(d["raceId"]);
      d["status"] = parseInt(d["status"]);
    });
    f1Data.constructorResults = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/constructors.csv
function fetchConstructors(callback) {
  d3.csv('data/constructors.csv', function(data) {
    // preprocess data
    data.forEach(function(d, i) {
      d["constructorId"] = parseInt(d["constructorId"]);
    });
    f1Data.constructors = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/constructorStandings.csv
function fetchConstructorStandings(callback) {
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
    f1Data.constructorStandings = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/drivers.csv
function fetchDrivers(callback) {
  d3.csv('data/drivers.csv', function(data) {
    // preprocess data
    data.forEach(function(d, i) {
      d["dob"] = new Date(d["dob"]);
      d["driverId"] = parseInt(d["driverId"]);
      d["number"] = parseInt(d["number"]);
    });
    f1Data.drivers = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/driverStandings.csv
function fetchDriverStandings(callback) {
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
    f1Data.driverStandings = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/lapTimes.csv
function fetchLapTimes(callback) {
  d3.csv('data/lapTimes.csv', function(data) {
    // preprocess data
    data.forEach(function(d, i) {
      d["driverId"] = parseInt(d["driverId"]);
      d["lap"] = parseInt(d["lap"]);
      d["milliseconds"] = parseInt(d["milliseconds"]);
      d["position"] = parseInt(d["position"]);
      d["raceId"] = parseInt(d["raceId"]);
    });
    f1Data.lapTimes = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/pitStops.csv
function fetchPitStops(callback) {
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
    f1Data.pitStops = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/qualifying.csv
function fetchQualifying(callback) {
  d3.csv('data/qualifying.csv', function(data) {
    // preprocess data
    data.forEach(function(d, i) {
      d["constructorId"] = parseInt(d["constructorId"]);
      d["driverId"] = parseInt(d["driverId"]);
      d["number"] = parseInt(d["number"]);
      d["position"] = parseInt(d["position"]);
      d["q1"] = new Date(d["q1"]);
      d["q2"] = new Date(d["q2"]);
      d["q3"] = new Date(d["q3"]);
      d["qualifyId"] = parseInt(d["qualifyId"]);
      d["raceId"] = parseInt(d["raceId"]);
    });
    f1Data.qualifying = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/races.csv
function fetchRaces(callback) {
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
    f1Data.races = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/results.csv
function fetchResults(callback) {
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
    f1Data.results = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/seasons.csv
function fetchSeasons(callback) {
  d3.csv('data/seasons.csv', function(data) {
    // preprocess data
    data.forEach(function(d, i) {
      d["year"] = parseInt(d["year"]);
    });
    f1Data.seasons = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

// data/status.csv
function fetchStatus(callback) {
  d3.csv('data/status.csv', function(data) {
    // preprocess data
    data.forEach(function(d, i) {
      d["statusId"] = parseInt(d["statusId"]);
    });
    f1Data.status = data; // Store results
    loadingDialog.itemFinished(); // Update loading dialog progress bar
    callback(null); // Tell the queue we're done.
  });
}

/* This is where the actual control flow is defined */
console.log("Let's load and preprocess all data properly.");

// Show loading dialog
loadingDialog.show(13);

// Create a queue, add all the fetch&process functions and await their results
d3.queue()
  .defer(fetchCircuits)
  .defer(fetchConstructorResults)
  .defer(fetchConstructors)
  .defer(fetchConstructorStandings)
  .defer(fetchDrivers)
  .defer(fetchDriverStandings)
  .defer(fetchLapTimes)
  .defer(fetchPitStops)
  .defer(fetchQualifying)
  .defer(fetchRaces)
  .defer(fetchResults)
  .defer(fetchSeasons)
  .defer(fetchStatus)
  .awaitAll(function(error) {
    // All data loaded by the deferred functions, now we're ready for business
    // (call more functions :D)
    console.log("All done. Ready.");
    // Throw errors so we can see them
    if(error) throw error;
    // Hide the loading dialog
    loadingDialog.hide();
  });

