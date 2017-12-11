"use strict";

/*
 * This file contains the main control flow.
 */

preprocessor.load(function(data) {

  createLineGraph("#lineGraphBox", processor.getRace(1));

});
