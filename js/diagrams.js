"use strict";

// https://bl.ocks.org/mbostock/3884955
function createLineGraph(containerId, raceData){

  var height = 1000;
  var width = 1000;

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var allLineData = transformRaceDataToLineData(raceData);

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

  // Adds all lines
  allLineData.forEach((singleLineData, i) => {
    svg.append("path")
        .data([singleLineData])
        .attr("class", "line")
        .attr("stroke", getColorValue(i, allLineData.length) )
        .attr("d", lineDataDefinition);
  });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis on both sides
  svg.append("g")
      .call(d3.axisLeft(y));
  svg.append("g")
      .call(d3.axisRight(y))
      .attr("transform", "translate( " + (width) + ", 0 )");
}
