"use strict";

function attachRaceStatistics(enhancedLapData, raceData){
  var statisticsContainer = "#race-statistics";
  var avgSymbol = "&#216;";
  var textArr = [];
  var statisticsPerRow = 3;

  var selectionType = {
    minimum : "min",
    maximum : "max"
  };

  // empty statistics Container before adding new Statistics
  $(statisticsContainer).empty();

  //console.log(raceData);
  //console.log(enhancedLapData);

  textArr.push(avgSymbol + " <b>Lap time:</b> " + getAvgLapTime(raceData));
  textArr.push(avgSymbol + " <b>Pitstop time:</b> " + getAvgPitStopTime(raceData));
  textArr.push(avgSymbol + " <b>Pitstops per Driver:</b> " + getAvgPitStopsPerDriver(raceData));
  textArr.push("<b>Fastest Lap:</b> " + getFastestOrSlowestLapWithDriverCode(raceData, selectionType.minimum));
  textArr.push("<b>Fastest Pitstop:</b> " + getFastestOrSlowestPitStopTimeWithDriverCode(raceData, selectionType.minimum));
  textArr.push("<b>Most Pitstops:</b> " + getMostPitstops(raceData));
  textArr.push("<b>Slowest Lap:</b> " + getFastestOrSlowestLapWithDriverCode(raceData, selectionType.maximum));
  textArr.push("<b>Slowest Pitstop:</b> " + getFastestOrSlowestPitStopTimeWithDriverCode(raceData, selectionType.maximum));
  textArr.push("")
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

  function getFastestOrSlowestLapWithDriverCode(raceData, selecType){
    if(raceData.lapTimes.size > 0){
      var lapTime;
      if(selecType == selectionType.minimum){
          lapTime = Number.POSITIVE_INFINITY;
      }else{
          lapTime = 0;
      }
      var driverCode = "";
      raceData.lapTimes.forEach((lap) => {
        lap.forEach((driverInLap) => {
          if(selecType == selectionType.minimum){
            if( driverInLap.milliseconds < lapTime ){
              lapTime = Math.min(lapTime, driverInLap.milliseconds);
              driverCode = getDriverCodeById(raceData, driverInLap.driverId);
            }
          }else{
            if( driverInLap.milliseconds > lapTime ){
              lapTime = Math.max(lapTime, driverInLap.milliseconds);
              driverCode = getDriverCodeById(raceData, driverInLap.driverId);
            }
          }
        });
      });

      var returnStr = ((lapTime % 60000) / 1000).toFixed(2) + " " + driverCode;
      if(((lapTime % 60000) / 1000).toFixed(2) < 10){
        returnStr = "0" + returnStr;
      }
      if(Math.floor(lapTime / 60000) > 0){
        returnStr = Math.floor(lapTime / 60000) + ":" + returnStr;
      }
      return returnStr;
    }
  }

  function getMostPitstops(raceData){
    if(raceData.pitStops.length > 0){
      var maxStops = 0;
      var driverCode = "";
      raceData.pitStops.forEach((current) =>{
        if(current.stop > maxStops){
          maxStops = current.stop;
          driverCode = getDriverCodeById(raceData, current.driverId);
        }
      });
      return maxStops + " " + driverCode;
    }
  }

  function getFastestOrSlowestPitStopTimeWithDriverCode(raceData, selecType){
    if(raceData.pitStops.length > 0){
      var pitStopTime;
      if(selecType == selectionType.minimum){
          pitStopTime = Number.POSITIVE_INFINITY;
      }else{
          pitStopTime = 0;
      }
      var driverCode = "";
      raceData.pitStops.forEach((current) => {
        if(selecType == selectionType.minimum){
          if( current.milliseconds < pitStopTime ){
            pitStopTime = Math.min(pitStopTime, current.milliseconds);
            driverCode = getDriverCodeById(raceData, current.driverId);
          }
        }else{
          if( current.milliseconds > pitStopTime ){
            pitStopTime = Math.max(pitStopTime, current.milliseconds);
            driverCode = getDriverCodeById(raceData, current.driverId);
          }
        }
      });
      var returnStr = ((pitStopTime % 60000) / 1000).toFixed(2) + " " + driverCode;
      if(((pitStopTime % 60000) / 1000).toFixed(2) < 10){
        returnStr = "0" + returnStr;
      }
      if(Math.floor(pitStopTime / 60000) > 0){
        returnStr = Math.floor(pitStopTime / 60000) + ":" + returnStr;
      }
      return returnStr;
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
      if(((avgRoundTimes % 60000) / 1000).toFixed(2) < 10){
        returnStr = "0" + returnStr;
      }
      if(Math.floor(avgRoundTimes / 60000) > 0){
        returnStr = Math.floor(avgRoundTimes / 60000) + ":" + returnStr;
      }
      return returnStr;
    }
  }

}
