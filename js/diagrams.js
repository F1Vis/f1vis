"use strict";

// https://bl.ocks.org/mbostock/3884955
function createLineGraph(containerId, raceData){

  // Rough input validation
  if(raceData.raceInfo === undefined) {
    console.error(["Sorry, that raceData is empty. :-(", raceData]);
    return; // early return to avoid errors
  } else {
    console.log(raceData);
  }

  var enhancedLapData = processor.getEnhancedLapDataPerDriver(raceData);


  // Configuration
  var height = 720;
  var width = 1080;
  var linePointSize = 5;
  var rectSize = 10;
  var amountClickedLines = 0;

  // set the dimensions and margins of the graph
  var margin = {top: 50, right: 100, bottom: 50, left: 100},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // defines how the passed in Data, at "svg.append" shall be interpreted
  var lineDataDefinition = d3.line()
    .x(function(d) { return x(d.lap); })
    .y(function(d) { return y(d.position); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(containerId).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain([0, raceData.lapTimes.size]);
  y.domain([raceData.drivers.length, 1]);

  var enhancedLapData = processor.getEnhancedLapDataPerDriver(raceData);
  console.log(enhancedLapData);

  // Adds all lines
  enhancedLapData.forEach((driverLapData, driverIndex) => {
    //console.log(driverLapData);
      svg.append("path")
          .data([driverLapData.laps])
          .attr("class", "line")
          .attr("data-line", driverLapData.driver.driverId)// custom data to Specify the line
          .attr("data-opacitychange", 1)
          .attr("data-highlighted", 0)
          .attr("stroke", getColorValue(driverIndex, enhancedLapData.length) )
          .attr("d", lineDataDefinition);

      //Appends a circle for each datapoint
      svg.selectAll(".linepoint")
          .data(driverLapData.laps)
          .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot linedot") // Assign a class for styling
          .attr("id", function(d, i) { return "circle-linepoint-" + d.lap + "-" + d.driverId; })
          .attr("data-line", driverLapData.driver.driverId)
          .attr("data-opacitychange", 0)
          .attr("data-highlighted", 0)
          .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
          .attr("cx", function(d, i) {return x(d.lap) })
          .attr("cy", function(d, i) { return y(d.position) })
          .attr("r", linePointSize)
          .style("opacity", 0);

      //Appends a circle for each datapoint
      svg.selectAll(".invisiblelinepoint")
          .data(driverLapData.laps)
          .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot linedot") // Assign a class for styling
          .attr("circle-id", function(d, i) { return "circle-linepoint-" + d.lap + "-" + d.driverId; })
          .attr("data-line", driverLapData.driver.driverId)
          .attr("data-opacitychange", 0)
          .attr("data-highlighted", 0)
          .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
          .attr("cx", function(d, i) {return x(d.lap) })
          .attr("cy", function(d, i) { return y(d.position) })
          .attr("r", linePointSize*2.4)
          .on("click", handleClickOnPoint)
          .on("mouseover", handleMouseOverLinePoint)
          .on("mouseout", handleMouseOutLinePoint)
          .style("opacity", 0);

      driverLapData.laps.forEach((singleLap, singleLapIndex)=> {
        if(singleLap.pitStop){
          //Appends a circle for each datapoint
          svg.selectAll(".pitstoppoint")
              .data([singleLap])
              .enter().append("circle") // Uses the enter().append() method
              .attr("class", "dot pitstopdot") // Assign a class for styling
              .attr("data-line", driverLapData.driver.driverId)
              .attr("data-opacitychange", 1)
              .attr("data-highlighted", 0)
              .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
              .attr("cx", function(d, i) {return x(d.lap) })
              .attr("cy", function(d, i) { return y(d.position) })
              .attr("r", linePointSize * 1.2)
              .on("click", handleClickOnPoint)
              .on("mouseover", handleMouseOverLinePoint)
              .on("mouseout", handleMouseOutLinePoint);
        }
      });

      // in case the driver ended the race too early, get the status why he quit
      /*TODO: Mouseover for Rectangle*/
      var resultOfDriver = raceData.results.filter((result) =>  { return result.driverId == driverLapData.driver.driverId; });
      console.log(resultOfDriver);
      if(resultOfDriver.length > 0 && getValidEndingStatusIds().indexOf(resultOfDriver[0].statusId) < 0){
        console.log("not ended properly");
        var triangle = d3.symbol()
            .type(d3.symbolTriangle)
            .size(25);
        //get Data for last round
        svg.selectAll(".endpoint")
            .data([driverLapData.laps[driverLapData.laps.length - 1]])
            .enter().append("rect") // Uses the enter().append() method
            .attr("class", "dot pitstopdot") // Assign a class for styling
            .attr("data-line", driverLapData.driver.driverId)
            .attr("data-opacitychange", 1)
            .attr("data-highlighted", 0)
            .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
            .attr("x", function(d, i) {return x(d.lap) - rectSize * 1/2 })
            .attr("y", function(d, i) { return y(d.position) - rectSize * 1/2 })
            .attr("height", rectSize)
            .attr("width", rectSize);

        /* tried with Cross, didn't work, don't  know why
        svg.selectAll(".endpoint")
            .data([driverLapData.laps[driverLapData.laps.length - 1]])
            .enter().append("symbolCircle") // Uses the enter().append() method
            .attr("size", 300)
            .attr("class", "endpoint") // Assign a class for styling
            .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
            .attr("transform", function(d) { return "translate(" + x(d.lap) + "," + y(d.position) + ")"; });
        */
      }

  });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis on both sides
  svg.append("g")
    .call(
      d3.axisLeft(y)
        .ticks(raceData.drivers.length)
        .tickFormat(function(d) {
          return getDriverCodeFromPosAndLap(raceData, 0, d) + " " + d;
        })
    );

  svg.append("g")
      .call(
        d3.axisRight(y)
          .ticks(raceData.drivers.length)
          .tickFormat(function(d) {
            return d + " " + getDriverCodeFromPosAndLap(raceData, raceData.lapTimes.size, d) ;
          })
      )
      .attr("transform", "translate( " + (width) + ", 0 )");

  function handleClickOnPoint(d,i){

      //select elements that are highlightable but are not highlighted
      d3.selectAll("[data-opacitychange='" + 1 +"'][data-highlighted='" + 0 +"']")
        .style("opacity", 0.3);

      // if clicked on already highlighted line, remove highlight
      if(this.getAttribute("data-highlighted") == 1){
        d3.selectAll("[data-line='" +  d.driverId  +"'][data-opacitychange='" + 1 +"']")
          .style("opacity", 0.3);

          d3.selectAll("[data-line='" +  d.driverId  +"']")
            .attr("data-highlighted", 0);
      }else{
        //select elements that belong to line and are highlightable
        d3.selectAll("[data-line='" +  d.driverId  +"'][data-opacitychange='" + 1 +"']")
          .style("opacity", 1);

        d3.selectAll("[data-line='" +  d.driverId  +"']")
          .attr("data-highlighted", 1);
      }

      // if no element highlighted, then everything normal again
      var highlightedElements = d3.selectAll("[data-opacitychange='" + 1 +"'][data-highlighted='" + 1 +"']");
      if(highlightedElements.size() == 0){
        //select elements that are highlightable but are not highlighted
        d3.selectAll("[data-opacitychange='" + 1 +"'][data-highlighted='" + 0 +"']")
          .style("opacity", 1);
      }
  }

  function handleMouseOverLinePoint(d, i) {
    var circleId = "circle-linepoint-" + d.lap + "-" + d.driverId;
    var circle = d3.select("#" + circleId);

    // Add interactivity
    // Use D3 to select element, change color and size
    if(!d.pitStop){
      circle
        .style("opacity", 1);
    }else{
      circle
        .attr("r", linePointSize * 2);
    }

    //depending on Pitstop and lap different Texts
    var textArr = [];
    if(d.pitStop){
      textArr = getPitStopTextArray(raceData,d);
    }else{
      textArr = getLapTextArray(raceData,d);
    }

    //Necessary to add Text for each Line
    textArr.forEach((text, textIndex) =>{
      // Specify where to put label of text
      svg.append("text")
        .attr("id", "t" + d.lap + "-" + d.position + "-" + i + "-" + textIndex)// Create an id for text so we can select it later for removing on mouseout
        .attr("x", function() { return x(d.lap) - 70; })
        .attr("y", function() { return y(d.position) - 15; })
        .attr("dy", textIndex + "em")
        .text(function() {
          return text;  // Value of the text
        });
    });

  }

  function handleMouseOutLinePoint(d, i) {
    var circleId = "circle-linepoint-" + d.lap + "-" + d.driverId;
    var circle = d3.select("#" + circleId);
    // Use D3 to select element, change color back to normal
    if(!d.pitStop){
      circle
        .attr("r", linePointSize)
        .style("opacity", 0);
    }else{
      circle
        .attr("r", linePointSize);
    }

    //depending on Pitstop and lap different Texts
    var textArr = [];
    if(d.pitStop){
      textArr = getPitStopTextArray(raceData,d);
    }else{
      textArr = getLapTextArray(raceData,d);
    }

    textArr.forEach((text, textIndex)=> {
      // Select text by id and then remove
      d3.select("#t" + d.lap + "-" + d.position + "-" + i + "-" + textIndex).remove();  // Remove text location
    });
  }

  function getLapTextArray(raceData, d){
    var driverText = getDriverCodeById(raceData,d.driverId)
    var lapText = "Lap: " + d.lap;
    var posText = "Pos: " + d.position;
    var timeText = "Time: " + d.time;
    return [driverText, lapText, posText, timeText];
  }

  function getPitStopTextArray(raceData, d){
    var lapTextArr = getLapTextArray(raceData,d);
    lapTextArr.push("Stop Nr: " + d.pitStop.stop);
    lapTextArr.push("Duration: " + d.pitStop.duration);
    return lapTextArr;
  }

  function getDriverCodeFromPosAndLap(raceData, lapNr, pos){
    var driverCode = "";
    if(lapNr == 0){
      driverCode = getDriverCodeById(raceData, raceData.qualifying[pos - 1].driverId);
    }else if(lapNr == raceData.lapTimes.size){
      var resultPos = raceData.results[pos -1].position;
      var resultLaps = raceData.results[pos -1].laps;
      //making sure the Driver finished and drove all laps
      if(resultPos && resultLaps == raceData.lapTimes.size){
        driverCode =  getDriverCodeById(raceData,raceData.results[pos -1].driverId);
      }
    }else{
      //TODO hier Adden
    }
    return driverCode;
  }

}
