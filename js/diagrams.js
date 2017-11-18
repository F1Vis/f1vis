"use strict";

/*
 * This may be restructured in the future - code to create diagrams will live here.
 */

function createTestPieChart(containerId, dataset) {
  var width = 100;
  var height = 100;
  // Build the basic container for the chart
  var svg = d3.select(containerId)
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height + "")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

  // Preparations are done, now let's build the pie chart
  var radius = Math.min(width, height) / 2;
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  var pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

  var path = svg.selectAll("path")
    .data(pie(dataset))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function(d, i) {
      return color(d.data.label);
    });

}
