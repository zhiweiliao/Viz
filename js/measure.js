
Measure = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.displayData = this.data;

    this.initVis();
}


Measure.prototype.initVis = function(){
    var vis = this; // read about the this

    vis.margin = {top: 0, right: 30, bottom: 50, left: 10};
    var areaWidth = $("#Measure-1").width();
    if (areaWidth > 400) {
        vis.width = $("#Measure-1").width() - vis.margin.left - vis.margin.right;
    } else {
        vis.width = 400 - vis.margin.left - vis.margin.right;
    }
    vis.height = 80 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.scale.linear()
        .range([0, vis.width])
        .domain(d3.extent(vis.displayData, function(d) { return((d.N)); }));

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");


    vis.brush = d3.svg.brush()
        .x(vis.x)
        .on("brush",brushedMeasure);

    vis.svg.append("g")
        .attr("class","x brush")
        .call(vis.brush)
        .selectAll("rect")
        .attr("y",-7)
        .attr("height",vis.height +7);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height",vis.height);
}

