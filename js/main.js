"use strict";

/* Globally define the places where the preprocessed data is stored for READ ONLY ACCESS. */

var f1data = {
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
    // TODO: process data
    f1data.circuits = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/constructorResults.csv
function fetchConstructorResults(callback) {
  d3.csv('data/constructorResults.csv', function(data) {
    // TODO: process data
    f1data.constructorResults = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/constructors.csv
function fetchConstructors(callback) {
  d3.csv('data/constructors.csv', function(data) {
    // TODO: process data
    f1data.constructors = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/constructorStandings.csv
function fetchConstructorStandings(callback) {
  d3.csv('data/constructorStandings.csv', function(data) {
    // TODO: process data
    f1data.constructorStandings = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/drivers.csv
function fetchDrivers(callback) {
  d3.csv('data/drivers.csv', function(data) {
    // TODO: process data
    f1data.drivers = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/driverStandings.csv
function fetchDriverStandings(callback) {
  d3.csv('data/driverStandings.csv', function(data) {
    // TODO: process data
    f1data.driverStandings = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/lapTimes.csv
function fetchLapTimes(callback) {
  d3.csv('data/lapTimes.csv', function(data) {
    // TODO: process data
    f1data.lapTimes = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/pitStops.csv
function fetchPitStops(callback) {
  d3.csv('data/pitStops.csv', function(data) {
    // TODO: process data
    f1data.pitStops = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/qualifying.csv
function fetchQualifying(callback) {
  d3.csv('data/qualifying.csv', function(data) {
    // TODO: process data
    f1data.qualifying = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/races.csv
function fetchRaces(callback) {
  d3.csv('data/races.csv', function(data) {
    // TODO: process data
    f1data.races = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/results.csv
function fetchResults(callback) {
  d3.csv('data/results.csv', function(data) {
    // TODO: process data
    f1data.results = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/seasons.csv
function fetchSeasons(callback) {
  d3.csv('data/seasons.csv', function(data) {
    // TODO: process data
    f1data.seasons = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/status.csv
function fetchStatus(callback) {
  d3.csv('data/status.csv', function(data) {
    // TODO: process data
    f1data.status = data;
    callback(null); // Tell the queue we're done.
  });
}

/* This is where the actual control flow is defined */
console.log("Let's load and preprocess all data properly.");

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
    if(error) throw error;
  });

