

Elev = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
};

Elev.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 30, right:10, bottom: 20, left: 10};
    vis.width =300 - vis.margin.left - vis.margin.right,
    vis.height =300 -vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.scale.linear()
        .range([0, vis.width]);

    vis.y = d3.scale.linear()
        .range([0,vis.height]);

    vis.z = d3.time.scale()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) {return d.N;
        }));



    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");

    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");

    vis.zAxis = d3.svg.axis()
        .scale(vis.z)
        .orient("bottom");

/*
    vis.xAxisGroup = vis.svg.append("g")
        .attr("class", "x‐axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.yAxisGroup = vis.svg.append("g")
        .attr("class", "y‐axis axis");
*/

    vis.data= vis.data.filter(function(d) {
        return d.N >2
    })

    vis.wrangleData();
};


Elev.prototype.wrangleData = function(){
    var vis = this;

        vis.data= vis.data.map(function(d){
            return{
                X: d.X,
                Y: d.Y,
                N: d.N
            }
        });


    var temp=vis.z.domain();

    vis.displayData = vis.data.filter(function(d){
        return (d.N > temp[0] && d.N < temp[1] )

    });


    vis.updateVis();

};


Elev.prototype.updateVis = function(){
    var vis = this;

    vis.min=d3.min(vis.data,function(d){return d.X;});
    vis.max=d3.max(vis.data,function(d){return d.X;});
    vis.min1=d3.min(vis.data,function(d){return d.Y;});
    vis.max1=d3.max(vis.data,function(d){return d.Y;});

    if (vis.min > vis.min1) {  vis.min = vis.min1}

    if (vis.max < vis.max1) {  vis.max = vis.max1}

    vis.x.domain([vis.min,vis.max]);
    //vis.y.domain([d3.min(data,function(d){return d.Y;}),d3.max(data,function(d){return d.Y;})]);
    vis.y.domain([vis.min,vis.max]);



// Update (set the dynamic properties of the elements)
    vis.svg.select(".x‐axis")
        .transition()
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    vis.svg.select(".y‐axis")
        .transition()
        .call(vis.yAxis)

/*
    vis.svg.append("text")
        .attr("class","axisText")
        .attr("text-anchor", "end")
        .attr("transform", "translate("+vis.width+","+(vis.height)*0.98+")rotate(0)")
        .text("Camera X coordinate");

        vis.svg.append("text")
        .attr("class","axisText")
        .attr("text-anchor", "end")
        .attr("transform", "translate(15,"+(0)+")rotate(-90)")
        .text("Camera Z coordinate");
*/

/*
    vis.image = vis.svg.append("image")
        .attr("xlink:href", "img/campPlan.jpg")
        .attr("x",0)
        .attr("y", 0)
        .attr("width", vis.width)
        .attr("height", vis.height)
        .attr("id", "fillImage")
        //.attr("style", "fill:url(#fillImage)")
        .attr("opacity", "1");
*/

    vis.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([100, 0])
        .html(function(d) {
            return "<strong></strong>"

               // + "<div>"
            //    +  (d.X)
                + "<h1>"
                + d.N
           + "</h1>"
        });

    vis.svg.call(vis.tip);

// label();
    function label(){
        vis.region=[">20","<5"]

        vis.col=["white","white"];
        vis.legendScatter= vis.svg.selectAll('g.legendScatter')
            .data(vis.col)
            .enter()
            .append('g').attr('class','legendScatter');

        vis.legendScatter.append("circle")
            .attr("cx",10)
            .attr("cy", function(d,i) {
                return (i+10)* 15;
            })
            .attr("r",function(d,i){
                return 1/(i+0.3);
            })
            .style("fill",function(d){
                return d;
            })

        vis.legendScatter.append("text").transition()
            .attr("x",5)
            .attr("y",0)
            .attr("dy", "0.4em")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .attr("class","lab")
            .text("Subject in Elevation")

        vis.legendScatter.append("text").transition()
            .attr("x", 20)
            .attr("y", function(d,i) {
                return (i+10)* 15;
            })
            .attr("dy", "0.4em")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .attr("class","lab")
            .text(function(d,i){
                return vis.region[i];
            })
    }

//  radialGradient()
   function radialGradient(){
       vis.radialGradient = vis.svg.append("defs")
           .append("radialGradient")
           .attr("id", "radialgradient1");

       vis.radialGradient.append("stop")
           .attr("offset", "0%")
           .attr("stop-color", "white") //#C70039
           .attr("stop-opacity",.3);

       vis.radialGradient.append("stop")
           .attr("offset", "100%")
           .attr("stop-color", "white")
           .attr("stop-opacity", 0);
   }


//join
    vis.circle = vis.svg.selectAll(".subject")
        .data(vis.displayData);

//enter
    vis.circle.enter()
        .append("circle")
        .attr("class","subject");

//update
    vis.circle.transition()
        .attr("cx",function(d){return vis.x(d.X);})
        .attr("cy",function(d){return vis.y(d.Y);})
        .attr("r", function(d){return (d.N)*.15;})
     //   .attr("fill-opacity",0.8);
       /*
        .style("fill", "white");
        .style("fill", "url(#radialgradient1)");
        .style("fill",
            function(d) {
                if (d.Z > 6.0) {
                    return ""
                }
                else {
                    return  "white"// "transparent"
                }
            }
        )*/

    vis.circle
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

    vis.circle.exit().remove();

    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);


};


















