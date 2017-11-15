"use strict";
console.log("Main script running.");

console.log("Let's load and preprocess all data properly.");

// data/circuits.csv
d3.csv('data/circuits.csv', function(data) {
  console.log(data[0]);
});

// data/constructorResults.csv
// data/constructors.csv
// data/constructorStandings.csv
// data/drivers.csv
// data/driverStandings.csv
// data/lapTimes.csv
// data/pitStops.csv
// data/qualifying.csv
// data/races.csv
// data/results.csv
// data/seasons.csv
// data/status.csv

console.log("All done. Ready.");