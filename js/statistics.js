"use strict";

function attachRaceStatistics(enhancedLapData, raceData){
  var statisticsContainer = "#race-statistics";
  var avgSymbol = "&#216;";
  var textArr = [];
  var statisticsPerRow = 3;

  // empty statistics Container before adding new Statistics
  $(statisticsContainer).empty();

  console.log(raceData);
  console.log(enhancedLapData);

  textArr.push(avgSymbol + " Pitstop time: " + getAvgPitStopTime(raceData));
  textArr.push(avgSymbol + " Lap time: " + getAvgLapTime(raceData));
  textArr.push(avgSymbol + " Pitstops per Driver: " + getAvgPitStopsPerDriver(raceData));
  textArr.push("Fastest Lap: " + getFastestLapWithDriverCode(raceData));
  textArr.push("Fastest Pitstop: " + getFastestPitStopTimeWithDriverCode(raceData));
  // TODO: Addd more statistics

  textArr.forEach((elem, i) =>{
    if(i % statisticsPerRow == 0){
        $(statisticsContainer).append($('<div></div>')
            .addClass("row")
        );
    }

    $(statisticsContainer + " .row").last().append($('<div></div>')
        .addClass("col")
        .html(elem)
    );
  });
}

function getFastestLapWithDriverCode(raceData){
  if(raceData.lapTimes.size > 0){
    var minLapTime = Number.POSITIVE_INFINITY;
    var driverCode = "";
    raceData.lapTimes.forEach((lap) => {
      lap.forEach((driverInLap) => {
        if( driverInLap.milliseconds < minLapTime ){
          minLapTime = Math.min(minLapTime, driverInLap.milliseconds);
          driverCode = getDriverCodeById(raceData, driverInLap.driverId);
        }
      });
    });

    var returnStr = ((minLapTime % 60000) / 1000).toFixed(2) + " " + driverCode;
    if(Math.floor(minLapTime / 60000) > 0){
      returnStr = Math.floor(minLapTime / 60000) + ":" + returnStr;
    }
    return returnStr;
  }
}

function getFastestPitStopTimeWithDriverCode(raceData){
  if(raceData.pitStops.length > 0){
    var minPitStopTime = Number.POSITIVE_INFINITY;
    var driverCode = "";
    raceData.pitStops.forEach((current) => {
      if( current.milliseconds < minPitStopTime ){
        minPitStopTime = Math.min(minPitStopTime, current.milliseconds);
        driverCode = getDriverCodeById(raceData, current.driverId);
      }
    });
    return ((minPitStopTime % 60000) / 1000).toFixed(2) + " " + driverCode;
  }
}


function getAvgPitStopsPerDriver(raceData){
  if(raceData.pitStops.length > 0){
    return (raceData.pitStops.length / raceData.drivers.length).toFixed(2);
  }
}

function getAvgPitStopTime(raceData){
  if(raceData.pitStops.length > 0){
    var sumAllPitStops = 0;
    raceData.pitStops.map((current) => sumAllPitStops += current.milliseconds);
    var avgPitStopTimes = sumAllPitStops / raceData.pitStops.length;
    return ((avgPitStopTimes % 60000) / 1000).toFixed(2);
  }
}

function getAvgLapTime(raceData){
  if(raceData.lapTimes.size > 0){
    var sumAllLapTimes = 0;
    var amountLapsAllDriver = 0;
    raceData.lapTimes.forEach((lap, lapInd) => {
      lap.forEach((driverInLap, driverInLapInd) => {
        sumAllLapTimes += driverInLap.milliseconds;
        amountLapsAllDriver++;
      });
    });
    var avgRoundTimes = sumAllLapTimes / amountLapsAllDriver;

    var returnStr = ((avgRoundTimes % 60000) / 1000).toFixed(2);
    if(Math.floor(avgRoundTimes / 60000) > 0){
      returnStr = Math.floor(avgRoundTimes / 60000) + ":" + returnStr;
    }
    return returnStr;
  }
}
