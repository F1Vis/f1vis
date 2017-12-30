"use strict";

/*
 * This file contains utility functions, data structures and
 * stuff not related to what this project actually does.
 */

function germanDateString(inputDate) {
  var dateString = "";
  var d = inputDate.getDate();
  var m = inputDate.getMonth()+1; // Don't ask.
  var y = inputDate.getFullYear();
  if(d < 10) dateString += "0";
  dateString += d.toString();
  dateString += ".";
  if(m < 10) dateString += "0";
  dateString += m.toString();
  dateString += ".";
  dateString += y.toString();
  return dateString;
}

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
    //$(this.id).modal('show');
  },
  // Function to signal that another item was progressed
  itemFinished: function() {

    this.progressItemsDone++;
    this._updateProgressBar();
  },
  // Hide the dialog
  hide: function() {
    console.log("hide");
    //$(this.id).modal('hide');
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
        lapsOfDriverInLineDataFormat.push({ 'lap': lapIn, 'position':  processor.getPositionOfDriver(driver, lap, raceData.drivers.length + 1 ), 'driverId': driver.driverId});
      }
    });
    lineData.splice(drivIn, 0, lapsOfDriverInLineDataFormat);
  });
  return lineData;
}

function transformPitStopDataToPointData(raceData){
  var pointData = [];
  raceData.pitStops.forEach(pitStop => {

 var randomData = raceData['lapTimes'].get(pitStop.lap);
 var position = null; //TODO
for(var i = 0; i<  randomData.length;i++){
    if(randomData[i].driverId == pitStop.driverId){
        position = randomData[i].position;
        break;
    }
}
//console.log(position);
    pointData.push({'position': position, "lap": pitStop.lap});
  });
  return pointData;
}

// eigentlich war für TickData gedacht
function getDriverCodeAndPositionArray(raceData, lapNumber){
  var posDriverCode = [];
  if(lapNumber == 0){
    raceData.qualifying.forEach(qualData => {
      posDriverCode.push(getDriverCodeById(raceData, qualData.driverId) + " " + qualData.position)
    });
  }
  return posDriverCode;
}

function getDriverCodeById(raceData, driverId){
  var driverData = raceData.drivers.filter(driv => driv.driverId == driverId)[0];
  if(driverData === undefined) return "XXX"; // TODO: Do a real fix instead of this quick fix
  return driverData.code;
}

function removeDuplicates(result,obj){
  if (result.indexOf(obj) < 0 ) result.push(obj);
  return result;
}

function getValidEndingStatusIds(){
  var results = [];
  var allStatus = queries.getStatus();
  results.push(1);
  for(var key in allStatus){
    if(key === undefined) continue;
    if(allStatus[key].status.match(/^\+[0-9]+/g)){
        results.push(parseInt(key));
    }
  }
  return results;
}

function getColorValue(index, all){
  var r = 0;
  var g = 0;
  var b = 0;

  var step = 255*3 / all;
  var colorValue = index * step;

  return "hsl(" + colorValue + ", " + 100 + "%, 35% )";
}

/**

data - own user data
pagename - the page where the image will be taken from
imagesize - target image size
callback(data,imageURL) - callback that will be called. Arguments are the provided
                          user data (data) and the final imageURL.

**/
function getImageFromWikipedia(data,pageName,imagesize,callback){
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        data: {
            format: "json",
            action: "query",
            titles: pageName,
            prop:"pageimages",
            pithumbsize:imagesize,
        },
        dataType: 'jsonp',
        success: function (dataResult) {
    		for(var key in dataResult.query.pages){
        	    var d = dataResult.query.pages[key];
                callback(data,d.thumbnail.source);
            }
        }
    });
};

function renderRaceInfoBox(race) {
  var raceInfo = race.raceInfo;
  var circuit = preprocessor.getResults().circuits[raceInfo.circuitId];
  //console.log(raceInfo);
  var content = "";

  content = "<div class=\"row justify-content-center align-self-center\">";
  content += "<div class=\"col\">";
  content += "<h2 data-toggle=\"tooltip\" data-placement=\"top\" title=\"#"+raceInfo.raceId+"\">"+raceInfo.name+" "+raceInfo.date.getFullYear()+"</h1>";
  content += "<h6>"+circuit.name+" ("+circuit.location+", "+circuit.country+")</h5>";
  content += "<h7>"+germanDateString(raceInfo.date)+"</h6>";
  content += "</div>";
  content += "<div class=\"col justify-content-center align-self-center\">"
  content += "<a class=\"btn btn-outline-primary\" target=\"_blank\" href=\""+raceInfo.url+"\" role=\"button\">See Race on Wikipedia</a> ";
  content += "<a class=\"btn btn-outline-primary\" target=\"_blank\" href=\""+circuit.url+"\" role=\"button\">See Circuit on Wikipedia</a> ";
  content += "<a class=\"btn btn-outline-primary\" target=\"_blank\" href=\"https://www.google.com/maps/?q="+circuit.lat+","+circuit.lng+"\" role=\"button\">See Circuit on GoogleMaps</a>";
  content += "</div>";
  content += "</div>";
  return content;
}

function renderDriverInfoBox(race) {
  var raceInfo = race.raceInfo;
  var drivers = race.drivers;
  var statusData = preprocessor.getResults().status
  // Assign results to drivers
  for(var ri in race.results) {
    var driverResult = race.results[ri];
    for(var di in drivers) {
      var driver = drivers[di];
      // :-(
      if(driverResult.driverId == driver.driverId) {
        Object.assign(drivers[di], driverResult);
      }
    }
  }

  var content = "";
  // Table header
  content += "<table id=\"driver-table\" class=\"table table-striped table-bordered\">";
  content += "<thead>";
  content += "<tr>";
  content += "<th scope=\"col\">Position</th>";
  content += "<th scope=\"col\">Rank</th>";
  content += "<th scope=\"col\">Code</th>";
  content += "<th scope=\"col\">Points</th>";
  content += "<th scope=\"col\">Fastest Lap Speed</th>";
  content += "<th scope=\"col\">Status</th>";
  content += "<th scope=\"col\">Forename</th>";
  content += "<th scope=\"col\">Surname</th>";
  content += "<th scope=\"col\">Nationality</th>";
  content += "<th scope=\"col\">Birthday</th>";
  content += "<th scope=\"col\">Wikipedia</th>";
  content += "</tr>";
  content += "</thead>";

  // Table body
  content += "<tbody>";
  for(var di in drivers) {
    var driver = drivers[di];
    // Replace NaN position with something proper
    driver.sortablePosition = driver.position;
    if(isNaN(driver.sortablePosition)) driver.sortablePosition = 999;
    if(isNaN(driver.position)) driver.position = "-/-";
    // Make ranks sortable, treat zero rank as very bad for sorting
    driver.sortableRank = driver.rank;
    if(driver.sortableRank < 1) driver.sortableRank = 999;
    if(isNaN(driver.fastestLapSpeed)) driver.fastestLapSpeed = 0;
    //console.log(driver);
    content += "<tr>";
    content += "<th scope=\"row\" data-sort=\""+driver.sortablePosition+"\">"+driver.position+"</th>";
    content += "<td data-sort=\""+driver.sortableRank+"\">"+driver.rank+"</td>";
    content += "<td>"+driver.code+"</td>";
    content += "<td>"+driver.points+"</td>";
    content += "<td>"+driver.fastestLapSpeed+"</td>";
    content += "<td>"+statusData[driver.statusId].status+"</td>";
    content += "<td>"+driver.forename+"</td>";
    content += "<td>"+driver.surname+"</td>";
    content += "<td>"+driver.nationality+"</td>";
    content += "<td data-sort=\""+driver.dob.toISOString()+"\">"+germanDateString(driver.dob)+"</td>";
    content += "<td><a target=\"_blank\" href=\""+driver.url+"\">Wikipedia</a></td>";
    content += "</tr>";
  }
  content += "</tbody>";
  content += "</table>";

  return content;
}
