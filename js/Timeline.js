
/*
 * Timeline - //brush time line to filter Interactive Camera Circles
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the  
 */

Time = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    // No data wrangling, no update sequence
    this.displayData = this.data;

    this.initVis();
}

/*
 * Initialize area chart with brushing component
 */

Time.prototype.initVis = function(){
    var vis = this; // read about the this

    vis.margin = {top: 10, right: 30, bottom: 50, left: 10};
    var areaWidth = $("#Time-1").width();
    if (areaWidth > 400) {
        vis.width = $("#Time-1").width() - vis.margin.left - vis.margin.right;
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

    // Scales and axes
    vis.x = d3.time.scale()
        .range([0, vis.width])
        .domain(d3.extent(vis.displayData, function(d) { return((d.date)); }));

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");
/*
    vis.svg.append("text")
        .attr("class","axisText")
        .attr("text-anchor", "end")
        .attr("transform", "translate("+vis.width+","+(vis.height) +")rotate(0)")
        .text("Photos Uploaded Time line");
*/
    // SVG area path generator

    /*
    vis.area = d3.svg.area()
        .x(function(d) { return vis.x(d.date); })
        .y0(0)
        .y1(10);

    vis.svg.append("path")
        .datum(vis.displayData)
        .attr("fill", "#ccc")
        .attr("d", vis.area);




*/
    // TO-DO: Initialize brush component




    vis.brush = d3.svg.brush()
        .x(vis.x)
        .on("brush",brushed);

    // TO-DO: Append brush component here
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

