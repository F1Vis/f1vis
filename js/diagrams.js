"use strict";

// https://bl.ocks.org/mbostock/3884955
function createLineGraph(containerId, raceData){

  // Rough input validation
  if(raceData === undefined || raceData.raceInfo === undefined) {
    console.error(["Sorry, that raceData is empty. :-(", raceData]);
    return; // early return to avoid errors
  } else {
    console.log(["raceData", raceData]);
  }

  var enhancedLapData = processor.getEnhancedLapDataPerDriver(raceData);

  attachRaceStatistics(enhancedLapData, raceData);

  // Configuration
  var graphHeight = 720;
  var smallGraphHeight = 200;
  var svgWidth = 1300;
  var linePointSize = 5;
  var rectSize = 16;
  var amountClickedLines = 0;

  //ElemTypes of this graph
  var elemTypes = {
    line: "line",
    linepoint: "linepoint",
    pitstoppoint: "pitstoppoint",
    endpoint: "endpoint"
  };

// -----------------------------------------------------------------------
  // set the dimensions and margins of the graph
  var marginGraph = {top: 30.0, right: 50, bottom: 10, left: 50.0},
      marginSmallGraph = {top: 10, right: marginGraph.right, bottom: 50, left: marginGraph.left},
      graphPosWidth = {posX: marginGraph.left, posY: marginGraph.top, width: svgWidth - (marginGraph.left + marginGraph.right), height : graphHeight, totalHeight: marginGraph.top + graphHeight + marginGraph.bottom},
      smallGraphPosWidth = {posX: marginSmallGraph.left, posY: graphPosWidth.totalHeight + graphPosWidth.posY + marginSmallGraph.top, width: svgWidth - (marginSmallGraph.left + marginSmallGraph.right), height : smallGraphHeight , totalHeight: marginSmallGraph.top + smallGraphHeight + marginSmallGraph.bottom},
	  svgHeight = smallGraphPosWidth.totalHeight + graphPosWidth.totalHeight;

  // set the ranges
  var x = d3.scaleLinear().range([0, graphPosWidth.width]),
      x2 = d3.scaleLinear().range([0, smallGraphPosWidth.width]),
      y = d3.scaleLinear().range([graphPosWidth.height, 0]),
      y2 = d3.scaleLinear().range([smallGraphPosWidth.height, 0]);

  var xAxis = d3.axisBottom(x),
      yAxis = d3.axisLeft(y);

  var xAxisGridlines = d3.axisBottom(x)
        .ticks(raceData.lapTimes.size) // One gridline for each lap
        .tickSize(-graphPosWidth.height)
        .tickFormat("");

  var brush = d3.brushX()
    .extent([[0, 0], [smallGraphPosWidth.width, smallGraphPosWidth.height]])
    .on("brush end", brushed);

  var zoom = d3.zoom()
    .scaleExtent([1, 5])
    .translateExtent([[0, 0], [graphPosWidth.width, graphPosWidth.height]])
    .extent([[0, 0], [graphPosWidth.width, graphPosWidth.height]])
    .on("zoom", zoomed);

  // -----------------------------------------------------------------------

  // defines how the passed in Data, at "svg.append" shall be interpreted
  var lineDataDefinition = d3.line()
    .x(function(d) { return x(d.lap); })
    .y(function(d) { return y(d.position); });
	
  var lineDataDefinitionSmall = d3.line()
    .x(function(d) { return x2(d.lap); })
    .y(function(d) { return y2(d.position); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(containerId).append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

  //----------------------------------------------------------------------
  /*svg.append("rect")
      .attr("class", "zoom")
      .attr("width", graphPosWidth.width)
      .attr("height", graphPosWidth.height)
      .attr("transform", "translate(" + graphPosWidth.posX + "," + graphPosWidth.posY + ")")
      .call(zoom);*/

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
      .attr("width", graphPosWidth.width)
      .attr("height", graphPosWidth.height);

  var focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + graphPosWidth.posX + "," + graphPosWidth.posY + ")");

  var context = svg.append("g")
      .attr("class", "context")
      .attr("height", smallGraphPosWidth.height)
      .attr("transform", "translate(" + smallGraphPosWidth.posX + "," + smallGraphPosWidth.posY + ")");

  // -----------------------------------------------------------------------

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + smallGraphPosWidth.height + ")")
      .call(d3.axisBottom(x2));

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  // -----------------------------------------------------------------------

  // Scale the range of the data
  x.domain([0, raceData.lapTimes.size]);
  y.domain([raceData.drivers.length, 1]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  var enhancedLapData = processor.getEnhancedLapDataPerDriver(raceData);
  //console.log(["enhancedLapData", enhancedLapData]);

	
  // Adds all lines
  enhancedLapData.forEach((driverLapData, driverIndex) => {
    //console.log(driverLapData);
      focus.append("path")
          .data([driverLapData.laps])
          .attr("class", "line pathLines")
          .attr("data-line", driverLapData.driver.driverId) // custom data to specify the line
          .attr("data-opacitychange", 1)
          .attr("data-highlighted", 0)
          .attr("data-elemtype", elemTypes.line)
          .attr("stroke", getColorValue(driverIndex, enhancedLapData.length) )
          .attr("d", lineDataDefinition);

      context.append("path")
          .data([driverLapData.laps])
          .attr("class", "line-context")
          .attr("data-line", driverLapData.driver.driverId) // custom data to specify the line
          .attr("data-opacitychange", 1)
          .attr("data-highlighted", 0)
          .attr("data-elemtype", elemTypes.line)
          .attr("stroke", getColorValue(driverIndex, enhancedLapData.length) )
          .attr("d", lineDataDefinitionSmall);

      driverLapData.laps.forEach((singleLap, singleLapIndex)=> {
        //console.log(["driverLaps.forEach", singleLap, singleLapIndex]);
        if(singleLap.pitStop){
          //Appends a circle for each datapoint
          focus.selectAll(".pitstoppoint")
              .data([singleLap])
              .enter().append("circle") // Uses the enter().append() method
              .attr("class", "pitstopdot") // Assign a class for styling
              .attr("data-line", driverLapData.driver.driverId)
              .attr("data-opacitychange", 1)
              .attr("data-highlighted", 0)
              .attr("data-elemtype", elemTypes.pitstoppoint)
              .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
              .attr("cx", function(d, i) {return x(d.lap) })
              .attr("cy", function(d, i) { return y(d.position) })
              .attr("r", linePointSize * 1.2)
              .on("click", handleClickOnPoint)
              .on("dblclick", handleDoubleClickOnPoint)
              .on("mouseover", handleMouseOverLinePoint)
              .on("mouseout", handleMouseOutLinePoint);

          context.selectAll(".pitstoppoint-context")
              .data([singleLap])
              .enter().append("circle") // Uses the enter().append() method
              .attr("class", "pitstopdot") // Assign a class for styling
              .attr("data-line", driverLapData.driver.driverId)
              .attr("data-opacitychange", 1)
              .attr("data-highlighted", 0)
              .attr("data-elemtype", elemTypes.pitstoppoint)
              .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
              .attr("cx", function(d, i) {return x2(d.lap) })
              .attr("cy", function(d, i) { return y2(d.position) })
              .attr("r", linePointSize * 0.5)
              .attr("d", lineDataDefinitionSmall);
          // Remove data from driverLapData, since we don't need a generic datapoint for this
          //driverLapData.laps[singleLapIndex] = {};
        }
      });

      //Appends a circle for each datapoint
      focus.selectAll(".linepoint")
          .data(driverLapData.laps)
          .enter().append("circle") // Uses the enter().append() method
          .attr("class", "linedot") // Assign a class for styling
          .attr("id", function(d, i) { return "circle-linepoint-" + d.lap + "-" + d.driverId; })
          .attr("data-line", driverLapData.driver.driverId)
          .attr("data-opacitychange", 0)
          .attr("data-highlighted", 0)
          .attr("data-elemtype", elemTypes.linepoint)
          .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
          .attr("cx", function(d, i) {return x(d.lap) })
          .attr("cy", function(d, i) { return y(d.position) })
          .attr("r", linePointSize)
          .style("opacity", 0);

      //Appends a circle for each datapoint
      focus.selectAll(".invisiblelinepoint")
          .data(driverLapData.laps)
          .enter().append("circle") // Uses the enter().append() method
          .attr("class", "linedot") // Assign a class for styling
          .attr("circle-id", function(d, i) { return "circle-linepoint-" + d.lap + "-" + d.driverId; })
          .attr("data-line", driverLapData.driver.driverId)
          .attr("data-opacitychange", 0)
          .attr("data-highlighted", 0)
          .attr("data-elemtype", elemTypes.linepoint)
          .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
          .attr("cx", function(d, i) {return x(d.lap) })
          .attr("cy", function(d, i) { return y(d.position) })
          .attr("r", linePointSize*2.4)
          .on("click", handleClickOnPoint)
          .on("dblclick", handleDoubleClickOnPoint)
          .on("mouseover", handleMouseOverLinePoint)
          .on("mouseout", handleMouseOutLinePoint)
          .style("opacity", 0);

      // in case the driver ended the race too early, get the status why he quit
      /*TODO: Mouseover for Rectangle*/
      var resultOfDriver = raceData.results.filter((result) =>  { return result.driverId == driverLapData.driver.driverId; });
      if(resultOfDriver.length > 0 && getValidEndingStatusIds().indexOf(resultOfDriver[0].statusId) < 0){
        var triangle = d3.symbol()
            .type(d3.symbolTriangle)
            .size(25);
        //get Data for last round
        focus.selectAll(".endpoint")
            .data([driverLapData.laps[driverLapData.laps.length - 1]])
            .enter().append("rect") // Uses the enter().append() method
            .attr("class", "endpointdot") // Assign a class for styling
            .attr("data-line", driverLapData.driver.driverId)
            .attr("data-opacitychange", 1)
            .attr("data-highlighted", 0)
            .attr("data-elemtype", elemTypes.endpoint)
            .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
            .attr("x", function(d, i) { return x(d.lap) - rectSize * 1/2; })
            .attr("y", function(d, i) { return y(d.position) - rectSize * 1/2; })
            .attr("height", rectSize)
            .attr("width", rectSize)
            .on("click", handleClickOnPoint)
            .on("dblclick", handleDoubleClickOnPoint)
            .on("mouseover", handleMouseOverLinePoint)
            .on("mouseout", handleMouseOutLinePoint);

        context.selectAll(".endpoint")
            .data([driverLapData.laps[driverLapData.laps.length - 1]])
            .enter().append("rect") // Uses the enter().append() method
            //.attr("class", "endpoint") // Assign a class for styling
            .attr("class", "zoomable")
            .attr("data-line", driverLapData.driver.driverId)
            .attr("data-opacitychange", 1)
            .attr("data-highlighted", 0)
            .attr("data-elemtype", elemTypes.endpoint)
            .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
            .attr("x", function(d, i) { return x2(d.lap) - rectSize * 1/2; })
            .attr("y", function(d, i) { return y2(d.position) - rectSize * 1/2; })
            .attr("height", rectSize * 0.4)
            .attr("width", rectSize * 0.4)
            .attr("d", lineDataDefinition);

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
  focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + graphPosWidth.height + ")")
    .call(xAxis);

  // Add the Y Axis on both sides
  focus.append("g")
    .call(
      d3.axisLeft(y)
        .ticks(raceData.drivers.length)
        .tickFormat(function(d) {
          return getDriverCodeFromPosAndLap(raceData, 0, d) + " " + d;
        })
    );

  // Add gridlines on x axis to better figure out laps
  focus.append("g")
    .attr("class", "xAxisGridlines")
    .attr("transform", "translate(0," + graphPosWidth.height + ")")
    .style("opacity", 0.06)
    .call(xAxisGridlines);

  //Add driver information on the right side of the graph.
  focus.append("g")
      .call(
        d3.axisRight(y)
          .ticks(raceData.drivers.length)
          .tickFormat(function(d) {
            var driverCode = "";
            if(getDriverCodeFromPosAndLap(raceData, raceData.lapTimes.size, d)){
              driverCode = getDriverCodeFromPosAndLap(raceData, raceData.lapTimes.size, d);
            }else{
              driverCode = getDriverCodeFromPosAndLap(raceData, raceData.lapTimes.size - 1, d);
            }
            return d + " " + driverCode ;
          })
      )
      .attr("transform", "translate( " + (graphPosWidth.width) + ", 0 )");

//----------------------------




  //---------------------------------------------------------------------------

  function handleClickOnPoint(d,i){
      //select elements that are highlightable but are not highlighted
      d3.selectAll("[data-opacitychange='" + 1 +"'][data-highlighted='" + 0 +"']")
        .style("opacity", 0.10);

      // if clicked on already highlighted line, remove highlight
      if(this.getAttribute("data-highlighted") == 1){
        d3.selectAll("[data-line='" +  d.driverId  +"'][data-opacitychange='" + 1 +"']")
          .style("opacity", 0.10);

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

  function handleDoubleClickOnPoint(d,i){
    var lapNr = d.lap;
    console.log(["doubleClick", d.lap]);
  }

  function handleMouseOverLinePoint(d, i) {
    var elemType = d3.select(this).attr("data-elemtype");
    //depending on Pitstop and lap different Texts
    var textArr = [];
    // Add interactivity
    // Use D3 to select element, change color and size
    if(elemType === elemTypes.linepoint){
      var circleId = "circle-linepoint-" + d.lap + "-" + d.driverId;
      var circle = d3.select("#" + circleId);
      circle
        .style("opacity", 1);
      textArr = getLapTextArray(raceData,d);
    }else if(elemType === elemTypes.pitstoppoint){
      d3.select(this)
        .attr("r", linePointSize * 2);
      textArr = getPitStopTextArray(raceData,d);
    }else if(elemType === elemTypes.endpoint){
      var newRectSize = rectSize * 1.5;
      d3.select(this)
        .attr("height", newRectSize)
        .attr("width", newRectSize)
        .attr("x", function(d, i) { return x(d.lap) - newRectSize * 1/2; })
        .attr("y", function(d, i) { return y(d.position) - newRectSize * 1/2; });
      textArr = getEndPointTextArray(raceData,d);
    }

    var tooltipGroup = svg.append("g")
      .attr("id", "t" + d.lap + "-" + d.position + "-" + i); // Unique id so it can be removed later

    tooltipGroup.append("rect")
      .attr("style", "fill:rgb(225,225,225);stroke:black;stroke-width:2;")
      .attr("width", "150")
      .attr("height", (textArr.length + 1) + "em")
      .attr("x", function() { return x(d.lap) + 10; })
      .attr("y", function() { return y(d.position) + 10; });

    //Necessary to add Text for each Line
    textArr.forEach((text, textIndex) =>{
      // Specify where to put label of text
        tooltipGroup.append("text")
        .attr("dy", (textIndex + 1) + "em")
        .attr("x", function() { return x(d.lap) + 15; })
        .attr("y", function() { return y(d.position) + 15; })
        .text(function() {
          return text;  // Value of the text
        });
    });

  }

  function handleMouseOutLinePoint(d, i) {
    var dataType = d3.select(this).attr("data-elemtype");
    //depending on Pitstop and lap different Texts
    var textArr = [];
    // Use D3 to select element, change color back to normal
    if(dataType === elemTypes.linepoint){
      var circleId = "circle-linepoint-" + d.lap + "-" + d.driverId;
      var circle = d3.select("#" + circleId);
      circle
        .attr("r", linePointSize)
        .style("opacity", 0);
      textArr = getLapTextArray(raceData,d);
    }else if(dataType === elemTypes.pitstoppoint){
      d3.select(this)
        .attr("r", linePointSize);
      textArr = getPitStopTextArray(raceData,d);
    }else if(dataType === elemTypes.endpoint){
      d3.select(this)
        .attr("height", rectSize)
        .attr("width", rectSize)
        .attr("x", function(d, i) {return x(d.lap) - rectSize * 1/2 })
        .attr("y", function(d, i) { return y(d.position) - rectSize * 1/2 });
      textArr = getEndPointTextArray(raceData,d);
    }

    textArr.forEach((text, textIndex)=> {
      // Select text by id and then remove
      d3.select("#t" + d.lap + "-" + d.position + "-" + i).remove();  // Remove text location
    });
  }

  function getLapTextArray(raceData, d){
    var driverText = getDriverCodeById(raceData,d.driverId);
    var lapText = "Lap: " + d.lap;
    var posText = "Pos: " + d.position;
    var returnArr = [driverText, lapText, posText];
    if(d.time){
        var timeText = "Time: " + d.time;
        returnArr.push(timeText);
    }
    return returnArr;
  }

  function getPitStopTextArray(raceData, d){
    var lapTextArr = getLapTextArray(raceData,d);
    lapTextArr.push("Stop Nr: " + d.pitStop.stop);
    lapTextArr.push("Duration: " + d.pitStop.duration);
    return lapTextArr;
  }

  function getEndPointTextArray(raceData, d){
    var status = "";
    var endTextArr = getLapTextArray(raceData,d);
    var allStatus = queries.getStatus();
    for(var key in allStatus){
      if(key === undefined) continue;
      if(allStatus[key].statusId === d.finished.statusId){
          status = allStatus[key].status;
      }
    }
    endTextArr.push("Reason: " + status);
    return endTextArr;
  }

  function getDriverCodeFromPosAndLap(raceData, lapNr, pos){
    var driverCode = "";
    if(lapNr == 0){
      var qualifying = raceData.qualifying[pos - 1];
      if(qualifying === undefined) return "XXX"; // TODO: Do a real fix
      driverCode = getDriverCodeById(raceData, qualifying.driverId);
    }else if(lapNr == raceData.lapTimes.size){
      var resultPos = raceData.results[pos -1].position;
      var resultLaps = raceData.results[pos -1].laps;
      //making sure the Driver finished and drove all laps
      if(resultPos && resultLaps == raceData.lapTimes.size){
        driverCode =  getDriverCodeById(raceData,raceData.results[pos -1].driverId);
      }
    }else{
      if(raceData.lapTimes.get(lapNr)[pos-1]){
        driverCode = getDriverCodeById(raceData, raceData.lapTimes.get(lapNr)[pos-1].driverId);
      }
    }
    return driverCode;
  }

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    updateElements();
    // Update the "preview" rectangle
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(graphPosWidth.width / (s[1] - s[0]))
      .translate(-s[0], 0));
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    updateElements();
    //call the brush function
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
  }
  
  function updateElements(){
    // Update the data!
    focus.selectAll(".pathLines").attr("d", lineDataDefinition);
    focus.selectAll(".pitstopdot").attr("cx", function(d, i) {return x(d.lap) });
    focus.selectAll(".endpointdot").attr("x", function(d, i) { return x(d.lap) - rectSize * 1/2; });
    // Update xAxis
    focus.select(".axis--x").call(xAxis);
    // Update gridlines
    focus.select(".xAxisGridlines").call(xAxisGridlines);
  }

}
