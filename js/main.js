"use strict";

/*
 * This file contains the main control flow.
 */

preprocessor.load(function(data) {

  createTestPieChart("#testchartbox", queries.getDriversByNationality());

});
