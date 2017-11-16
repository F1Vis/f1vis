"use strict";

/*
 * This file contains the main control flow.
 */

console.log("Let's load and preprocess all data properly.");

preprocessor.load(function(data) {
  console.log("Results are in!");
  console.log(data);

  // Create a very basic dataset for a chart
  var dataset = [
    { label: "SPD", count: 25 },
    { label: "CDU", count: 30 },
    { label: "Die Grünen", count: 40 },
    { label: "Die Linken", count: 15 },
    { label: "Die Rechten", count: 20 },
    { label: "Die Partei", count: 5 },
  ];
  // Pass the dataset to the chart function
  createTestPieChart("#testchartbox", dataset);

});
