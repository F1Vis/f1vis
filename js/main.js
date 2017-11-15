"use strict";
console.log("Main script running.");

// data/circuits.csv
function fetchCircuits(callback) {
  d3.csv('data/circuits.csv', function(data) {
    // TODO: process data
    var circuits = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/constructorResults.csv
function fetchConstructorResults(callback) {
  d3.csv('data/constructorResults.csv', function(data) {
    // TODO: process data
    var constructorResults = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/constructors.csv
function fetchConstructors(callback) {
  d3.csv('data/constructors.csv', function(data) {
    // TODO: process data
    var constructors = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/constructorStandings.csv
function fetchConstructorStandings(callback) {
  d3.csv('data/constructorStandings.csv', function(data) {
    // TODO: process data
    var constructorStandings = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/drivers.csv
function fetchDrivers(callback) {
  d3.csv('data/drivers.csv', function(data) {
    // TODO: process data
    var drivers = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/driverStandings.csv
function fetchDriverStandings(callback) {
  d3.csv('data/driverStandings.csv', function(data) {
    // TODO: process data
    var driverStandings = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/lapTimes.csv
function fetchLapTimes(callback) {
  d3.csv('data/lapTimes.csv', function(data) {
    // TODO: process data
    var lapTimes = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/pitStops.csv
function fetchPitStops(callback) {
  d3.csv('data/pitStops.csv', function(data) {
    // TODO: process data
    var pitStops = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/qualifying.csv
function fetchQualifying(callback) {
  d3.csv('data/qualifying.csv', function(data) {
    // TODO: process data
    var qualifying = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/races.csv
function fetchRaces(callback) {
  d3.csv('data/races.csv', function(data) {
    // TODO: process data
    var races = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/results.csv
function fetchResults(callback) {
  d3.csv('data/results.csv', function(data) {
    // TODO: process data
    var results = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/seasons.csv
function fetchSeasons(callback) {
  d3.csv('data/seasons.csv', function(data) {
    // TODO: process data
    var seasons = data;
    callback(null); // Tell the queue we're done.
  });
}

// data/status.csv
function fetchStatus(callback) {
  d3.csv('data/status.csv', function(data) {
    // TODO: process data
    var status = data;
    callback(null); // Tell the queue we're done.
  });
}

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
  .await(function(error) {
    console.log("All done. Ready.");
    console.log(arguments);
    if(error) throw error;
  });
