
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scales
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .4);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var xAxisGroup = svg.append("g")
    .attr("class", "x‐axis axis")
    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = svg.append("g")
    .attr("class", "y‐axis axis");
// Initialize data

var data;
loadData();


// Coffee chain data
// Load CSV file
function loadData() {
    d3.csv("data/configs.csv", function(error, csv) {
        csv.forEach(function(d){
            d.year = +d.year;
            d.percent = +parseFloat(d.percent).toFixed(2)*100;   //parseFloat(d.X).toFixed(digit)
            d.instagram = +d.instagram;
        });

        // Store csv data in global variable
        data = csv;
        console.log(data)
        updateVisualization();
    });
}
d3.select("#ranking-type").on("change", updateVisualization);
// Render visualization
function updateVisualization(){
    var change=d3.select("#ranking-type").property("value");

    data.sort(function(a, b) {return b[change]-a[change];});


    x.domain(data.map(function(d) { return d.title; }));
    y.domain([d3.min(data, function (d) {return d[change]}), d3.max(data, function (d) {return d[change]})]);

// Data‐join
    var updatedRect = svg.selectAll("rect")
        .data(data)


// tooltip

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function(d) {
            return "<strong></strong>"
              +'<div>'
                + (d[change])
                + '</div>';
        })



    svg.call(tip);



//enter
    updatedRect.enter().append("rect");

// Update (set the dynamic properties of the elements)
    updatedRect.transition()
        .attr("class", "rec")
        .attr("fill", "rgba(255, 195, 0, 1)")
        .attr("x", function(d) { return x(d["title"]); })
        .attr("y", function(d) { return y(d[change]); })
        .attr("width", x.rangeBand())
        .attr("height", function(d) { return height - y(d[change]); });

    svg.select(".x‐axis")
        .transition()
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.select(".y‐axis")
    //.transition()
        .call(yAxis);


    updatedRect
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

//exit
    updatedRect.exit().remove();
}