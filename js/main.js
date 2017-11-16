"use strict";

/*
 * This file contains the main control flow.
 */

console.log("Let's load and preprocess all data properly.");

preprocessor.load(function(data) {
  console.log("Results are in!");
  console.log(data);
});