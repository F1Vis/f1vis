"use strict";

/*
 * This may be restructured in the future - code to create diagrams will live here.
 */

function createTestPieChart(containerId, dataset) {
  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;
  var color = d3.scaleOrdinal(d3.schemeCategory20b);

  var svg = d3.select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

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
