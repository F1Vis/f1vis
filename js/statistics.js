"use strict";

function attachRaceStatistics(enhancedLapData, raceData){
  var statisticsContainer = "#race-statistics";
  var avgSymbol = "&#216;";
  var textArr = [];
  var statisticsPerRow = 3;

  //console.log(raceData);
  //console.log(enhancedLapData);

  textArr.push(avgSymbol + " Pitstop time: " + getAvgPitStopTime(raceData) + " sec");
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

function getAvgPitStopTime(raceData){
  if(raceData.pitStops.length > 0){
    var sumAllPitStops = 0;
    raceData.pitStops.map((current) => sumAllPitStops += current.milliseconds);
    var avgPitStopTimes = sumAllPitStops / raceData.pitStops.length;
    return ((avgPitStopTimes % 60000) / 1000).toFixed(2);
  }
}
