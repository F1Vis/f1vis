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
