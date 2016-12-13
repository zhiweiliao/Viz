

PieChart = function(_parentElement,_data){
    this.parentElement = _parentElement;
    this.data = _data;


    this.displayData = []; // see data wrangling

    this.initVis();

};

PieChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 0, right:0, bottom: 0, left:0};
    vis.width = 300 - vis.margin.left - vis.margin.right,
        vis.height =300-vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.width / 2 + "," + vis.height /1.5+ ")");


// Define a default pie layout
    vis.pie = d3.layout.pie();
// Ordinal color scale (10 default colors)
   // vis.color = d3.scale.category10();
    vis.color = d3.scale.ordinal()
        .range(["#B2BABB", "#FFC300"]);

// Pie chart settings
    vis.outerRadius = vis.width / 3;
    vis.innerRadius = vis.width / 24; // Relevant for donut charts
// Path generator for the pie segments
    vis.arc = d3.svg.arc()
        .innerRadius(vis.innerRadius)
        .outerRadius(vis.outerRadius);
// Append a group for each pie segment


    vis.wrangleData();
}

PieChart.prototype.wrangleData = function(){
    var vis = this;


    vis.displayData = vis.data;

    vis.displayData= vis.data.map(function(d){ return d.value });


    vis.updateVis();

};

PieChart.prototype.updateVis = function() {
    var vis = this;

    vis.g = vis.svg.selectAll(".arc")
        .data(vis.pie(vis.displayData))
        .enter()
        .append("g")
        .attr("class", "arc");
// Use the path generator to draw the arcs
    vis.g.append("path")
        .attr("d", vis.arc)
        .style("fill", function(d, index) { return vis.color(index); });

    vis.g.append("text")
        .attr("transform", function(d) { return "translate(" + vis.arc.centroid(d) + ")"; })
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("class", "head5")
        .text(function(d) { return  d.value });





}