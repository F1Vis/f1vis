"use strict";

/*
 * This file contains utility functions, data structures and
 * stuff not related to what this project actually does.
 */

/* Define global structure for the loading dialog */
var loadingDialog = {
  id: "#loading-dialog",
  progressItems: 1,
  progressItemsDone: 0,
  // Initialize+Show the loading dialog with a number of items to progress
  show: function(progressItems = 1) {
    console.log("show");
    this.progressItems = progressItems;
    this.progressItemsDone = 0;
    this._updateProgressBar();
    $(this.id).modal('show');
  },
  // Function to signal that another item was progressed
  itemFinished: function() {

    this.progressItemsDone++;
    this._updateProgressBar();
  },
  // Hide the dialog
  hide: function() {
    console.log("hide");
    $(this.id).modal('hide');
  },
  // Private function to update the progress bar shown
  _updateProgressBar: function() {
    var percentage = (this.progressItemsDone / this.progressItems) * 100;
    if(percentage < 0 || isNaN(percentage)) percentage = 0;
    if(percentage > 100) percentage = 100;
    $(this.id + " .progress-bar").attr("style", "width: " + percentage + "%;");
  },
};

// transforms the raceData to a format, with which lineDataDefinition can work
function transformRaceDataToLineData(raceData){
  // define the lines
  var lineData = [];
  raceData.drivers.forEach((driver, drivIn)=>{
    lineData.push();
    var lapsOfDriverInLineDataFormat = [];
    lapsOfDriverInLineDataFormat.push({'lap': 0, 'position': getPositionOfQualifying(raceData, driver) });
    raceData.lapTimes.forEach((lap, lapIn) => {
      var drivPos = processor.getPositionOfDriver(driver, lap, raceData.drivers.length + 1 );
      if( drivPos < raceData.drivers.length + 1 ){
        lapsOfDriverInLineDataFormat.push({ 'lap': lapIn, 'position':  processor.getPositionOfDriver(driver, lap, raceData.drivers.length + 1 )});
      }
    });
    lineData.splice(drivIn, 0, lapsOfDriverInLineDataFormat);
  });
  return lineData;
}

function getPositionOfQualifying(raceData, driver){
  var qualData = raceData.qualifying.filter( qualData => qualData.driverId == driver.driverId);
  return qualData[0].position;
}

function getColorValue(index, all){
  var r = 0;
  var g = 0;
  var b = 0;

  var step = 255*3 / all;
  var colorValue = index * step;

  return "hsl(" + colorValue + ", " + 100 + "%, 35% )";
}
