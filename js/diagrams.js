"use strict";

// https://bl.ocks.org/mbostock/3884955
function createLineGraph(containerId, raceData){

  console.log(raceData);

  var height = 1000;
  var width = 1000;

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
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
      svg.append("path")
          .data([driverLapData.laps])
          .attr("class", "line")
          .attr("stroke", getColorValue(driverIndex, enhancedLapData.length) )
          .attr("d", lineDataDefinition)

      //Appends a circle for each datapoint
      svg.selectAll(".linepoint")
          .data(driverLapData.laps)
          .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("fill", getColorValue(driverIndex, enhancedLapData.length))
          .attr("cx", function(d, i) {return x(d.lap) })
          .attr("cy", function(d, i) { return y(d.position) })
          .attr("r", 3)
          .on("mouseover", handleMouseOverLinePoint)
          .on("mouseout", handleMouseOutLinePoint);

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

  function handleMouseOverLinePoint(d, i) {
    console.log(d);
    console.log(i);
    // Add interactivity
    // Use D3 to select element, change color and size
    d3.select(this).attr({
      fill: "orange",
      r: 3 * 2
    });

    // Specify where to put label of text
    svg.append("text")
    .attr("id", "t" + d.lap + "-" + d.positon + "-" + i)// Create an id for text so we can select it later for removing on mouseout
    .attr("x", function() { return x(d.lap) - 30; })
    .attr("y", function() { return y(d.position) - 15; })
    .text(function() {
      return [d.lap, d.position];  // Value of the text
    });
  }

  function handleMouseOutLinePoint(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).attr({
      fill: "black",
      r: 3
    });

    // Select text by id and then remove
    d3.select("#t" + d.lap + "-" + d.positon + "-" + i).remove();  // Remove text location
  }

}
