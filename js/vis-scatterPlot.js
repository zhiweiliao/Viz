

Plan = function(_parentElement, _data, _data1){
    this.parentElement = _parentElement;
    this.data = _data;
    this.data1=_data1;

    this.displayData = []; // see data wrangling

    this.initVis();

}

Plan.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 100, right:100, bottom: 100, left:100};
    vis.width = 300 - vis.margin.left - vis.margin.right,
        vis.height =300-vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.ratio=1;


    vis.x = d3.scale.linear()
        .range([0, vis.width*vis.ratio]);

    vis.y = d3.scale.linear()
        .range([vis.height*vis.ratio, 0]);

    vis.z = d3.time.scale()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) {return d.date;
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
    vis.zAxisGroup = vis.svg.append("g")
        .attr("class", "z‐axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.xAxisGroup = vis.svg.append("g")
        .attr("class", "x‐axis axis")
  //      .attr("transform", "translate(0," + vis.height + ")");

    vis.yAxisGroup = vis.svg.append("g")
        .attr("class", "y‐axis axis");
*/

   // filter out the far points
    vis.data = vis.data.sort(function(a, b) {return b.Z-a.Z;});
    vis.data = vis.data.slice(0,-6);


    // minimize the data size

    vis.data= vis.data.map(function(d){
        return{
            IMG: d.IMG,
            X: d.X,
            Z: d.Z,
            date: d.date
        }
    });

    // filter out the subject points by measurement
    vis.data1= vis.data1.filter(function(d) {
           return d.N > 5
    })

    vis.data1= vis.data1.map(function(d){
            return{
                X: d.X,
                Z: d.Z,
                N: d.N
        }


    });


    vis.wrangleData();

};

Plan.prototype.wrangleData = function(){
    var vis = this;

 /*   vis.data= vis.data.filter(function(d){
        return !isNaN(d.X) && !isNaN(d.Y)
    });*/
    var temp=vis.z.domain();

    vis.displayData = vis.data.filter(function(d){
        return (d.date > temp[0] && d.date < temp[1] )

    });


    vis.updateVis();

};

Plan.prototype.updateVis = function(){
    var vis = this;

    vis.min=d3.min(vis.data,function(d){return d.X;});
    vis.max=d3.max(vis.data,function(d){return d.X;});
    vis.min1=d3.min(vis.data,function(d){return d.Z;});
    vis.max1=d3.max(vis.data,function(d){return d.Z;});

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

    vis.svg.select(".z‐axis")
        .transition()
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.zAxis);

/*
    vis.image = vis.svg.append("image")
        .attr("xlink:href", "img/campPlan.jpg")
        .attr("x",0)
        .attr("y",0)
        .attr("width", vis.width*1)
        .attr("height", vis.height*1)
        .attr("id", "fillImage")
        //.attr("style", "fill:url(#fillImage)")
        .attr("opacity", ".5");
*/


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

    vis.tip = d3.tip()
       .attr('class', 'd3-tip')
       .offset([0, 0])
        .html(function(d) {
         return "<strong></strong>"
                 //'<img  src="data/' + Configs[i-1].key + '/Elev.jpg" />'
           //  + "<img src='data/IMG/Elev.jpg' alt='' >"
         + "<img src='data/IMG/" + d.IMG  + "' alt='' >"
      + formatDate(d.date)
                 //+(d.IMG)
             + '</img>';
      })



   vis.svg.call(vis.tip);

// label();
    function label(){
        vis.region=["Subject","Camera"]

        vis.col=["white","black"];
        vis.legendScatter= vis.svg.selectAll('.legendScatter')
            .data(vis.col)
            .enter()
            .append('g').attr('class','legendScatter');

        vis.legendScatter.append("circle")
            .attr("cx",10)
            .attr("cy", function(d,i) {
                return (i+10)* 15;
            })
            .attr("r",function(d,i){
                return 1/(0+0.3);
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
            .text("Top View")

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




//join
/*  vis.imgs = vis.svg.selectAll("image.dot")
        .data(vis.data).attr("class","dot");

    vis.imgs.enter()
        .append("image");

    var pad= 40
    vis.imgs.transition()
        .attr("xlink:href", "data/qtqGp.png")
        .attr("x", function(d){return vis.x(d.X)-500-pad/2;})
        .attr("y", function(d){return vis.y(d.Z)-pad/2;})
        .attr("width", pad)
        .attr("height", pad);

 var grads = svg.append("defs").selectAll("radialGradient").data(pie(dataset.apples))
 .enter().append("radialGradient")
 .attr("gradientUnits", "userSpaceOnUse")
 .attr("cx", 0)
 .attr("cy", 0)
 .attr("r", "100%")
 .attr("id", function(d, i) { return "grad" + i; });

*/

/*
    vis.radialGradient = vis.svg.append("defs")
        .append("radialGradient")
        .attr("id", "radialgradient");

    vis.radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(255, 0, 255, 0.5)") //#C70039
        .attr("stop-opacity",1);

    vis.radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(255, 0, 255, 0.5)")
        .attr("stop-opacity", 0);
*/



    vis.circles = vis.svg.selectAll(".camera")
        .data(vis.displayData)


    vis.circles
        .enter()
        .append("circle")
        .attr("class","camera");

    vis.circles
        .transition()
        .attr("cx",function(d){return vis.x(d.X);})
        .attr("cy",function(d){return vis.y(d.Z);})
        .attr("r",2.5 )

    vis.circles
       .on('mouseover', vis.tip.show)
       .on('mouseout', vis.tip.hide);

    vis.circles
        .exit()
        .remove();

// building points
   points();
    function points(){
        var circle1 = vis.svg
            .selectAll(".subject")
            .data(vis.data1)

        circle1
            .enter()
            .append("circle")
            .attr("class","subject");

        circle1
            .transition()
            .attr("cx",function(d){return vis.x(d.X);})
            .attr("cy",function(d){return vis.y(d.Z);})
            .attr("r", 2)//function(d){return (d.N)*.05;})


        circle1
        .exit()
        .remove();



    }








}


















