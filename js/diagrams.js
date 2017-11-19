"use strict";

/*
 * This may be restructured in the future - code to create diagrams will live here.
 */

function createTestPieChart(containerId, dataset) {
  var width = 1000;
  var height = 1000;
  // Build the basic container for the chart
  var svg = d3.select(containerId)
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height + "")
    .classed("svg-content-responsive", true)
    .append("g")
    .classed("main-group", true)
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

  var arcs = svg.append("g").classed("pie-chart-arcs", true);
  var labels = svg.append("g").classed("pie-chart-labels", true);
  var lines = svg.append("g").classed("pie-chart-lines", true);

  // Preparations are done, now let's build the pie chart
  var maxRadius = Math.min(width, height) / 2;
  var radius = maxRadius * 0.4;
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var arc = d3.arc()
    .innerRadius(radius*0.4)
    .outerRadius(radius);

  var pie = d3.pie()
    .sort(function(a, b) { return b.count - a.count })
    .value(function(d) { return d.count; });

  arcs.selectAll("path")
    .data(pie(dataset))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function(d, i) {
      return color(d.data.label);
    });

  labels.selectAll("text")
    .data(pie(dataset))
    .enter()
    .append("text")
    .attr("dy", ".35em")
    .text(function(d) {
      console.log(d);
      return d.data.label;
    });

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  lines.selectAll("polyline")
    .data(pie(dataset))
    .enter()
    .append("polyline")
    .transition()
      .duration(1000)
      .attrTween("points", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      })

}
