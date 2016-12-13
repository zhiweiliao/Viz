
// Variables for the visualization instances
var Plans=[], Elevs=[], Times=[],Measures=[];

// decimal digits to minimize files' size
var digit=1;

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%m-%d-%Y").parse;
var formatDate = d3.time.format("%b-%y-%Y");

var Configs;
var map;


var pie0,pie1,pie2,pie3,pie4,pie5,pie6,pie7;


//var dataAttention = [55,7,7,7,4,3,142];
var partCamCount = [{"type": "Other", "value":194},{"type": "Major", "value":55}];
var pantCamCount = [{"type": "Other", "value":132},{"type": "Major", "value":57}];
var campCamCount = [{"type": "Other", "value":168},{"type": "Major", "value":57}];
var sagrCamCount = [{"type": "Other", "value":165},{"type": "Major", "value":60}];
var villCamCount = [{"type": "Other", "value":1768},{"type": "Major", "value":257}];
var roncCamCount = [{"type": "Other", "value":189},{"type": "Major", "value":48}];
var guggCamCount = [{"type": "Other", "value":1231},{"type": "Major", "value":122}];
var cctvCamCount = [{"type": "Other", "value":196},{"type": "Major", "value":49}];

pie0 = new PieChart("pie-1",partCamCount);
pie1 = new PieChart("pie-2",pantCamCount);
pie2 = new PieChart("pie-3",campCamCount);
pie3 = new PieChart("pie-4",sagrCamCount);
pie4 = new PieChart("pie-5",villCamCount);
pie5 = new PieChart("pie-6",roncCamCount);
pie6 = new PieChart("pie-7",guggCamCount);
pie7 = new PieChart("pie-8",cctvCamCount);




queue().defer(d3.csv, "data/configs.csv")
        .await(function (error,data) {
            if (!error) {
                Configs = data;

            }

                for (i = Configs.length; i > 0 ; i--) {
                    // load images
                    $('#imageElev-'+i.toString())
                        .prepend('<img  src="data/' + Configs[i-1].key + '/Elev.jpg" />')

                    $('#imagePlan-'+i.toString())
                        .prepend('<img  src="data/' + Configs[i-1].key + '/Plan.jpg" />')
                }

//225 Test Sample, 55 Major Cameras looking at the main facade.
                for (i = 1; i <= (Configs.length); i++) {

                // load titles
                        $('#Titl-'+i)
                            .prepend('<p>'
                        +"<br>"+  Configs[i-1].title +", built in "+Configs[i-1].year
           /*             +"<br>"+ "Total Instagram Photos Analyzed: " + Configs[i-1].imageCount
                        +"<br>"+ "Photos Capturing Common Interest: " + Configs[i-1].majorView
                        +"<br>"+ "Other Photos in the area: " + Configs[i-1].others     */
                        +'</p>')
                }
            map = new Map("mapid",Configs)



            loadData();



        })

function loadData() {



    queue()
        .defer(d3.json, "data/partCam.json")
        .defer(d3.json, "data/partPts.json")

        .defer(d3.json, "data/pantCam.json")
        .defer(d3.json, "data/pantPts.json")

        .defer(d3.json, "data/campCam.json")
        .defer(d3.json, "data/campPts.json")
        .defer(d3.json, "data/sagrCam.json")
        .defer(d3.json, "data/sagrPts.json")

        .defer(d3.json, "data/savoCam.json")
        .defer(d3.json, "data/savoPts.json")

        .defer(d3.json, "data/roncCam.json")
        .defer(d3.json, "data/roncPts.json")
        .defer(d3.json, "data/guggCam.json")
        .defer(d3.json, "data/guggPts.json")
        .defer(d3.json, "data/cctvCam.json")
        .defer(d3.json, "data/cctvPts.json")
        .await(function (error, data0, data1, data2, data3, data4, data5, data6, data7,
                         data8, data9, data10, data11, data12, data13, data14, data15) {

            data11 = data11.filter(function(d) {
                return d.X > -1.0 && d.X<1.5})

            data13 = data13.filter(function(d) {
                return d.X > -20})

                        if (!error) {
                            for (i = 0; i < (Configs.length) * 2; i++) {
                                if ((i % 2) == 0) {
                                    eval("data" + (i).toString()).forEach(function (d) {
                                        d.date = parseDate(d.date);
                                        d.X = +parseFloat(d.X).toFixed(digit);
                                        d.Y = +parseFloat(d.Y).toFixed(digit);
                                        d.Z = +parseFloat(d.Z).toFixed(digit);
                                    });
                                }
                                else {
                                    eval("data" + (i).toString()).forEach(function (d) {
                                        d.X = +parseFloat(d.X).toFixed(digit);
                                        d.Y = +parseFloat(d.Y).toFixed(digit);
                                        d.Z = +parseFloat(d.Z).toFixed(digit);
                                    });
                                }
                            }

                            enableNavigation();

//append plan elev and time graph

                            for (i = 0; i < (Configs.length) * 2; i++) {
                                if ((i % 2) == 0) {
                                    Plans.push(new Plan("imagePlan-" + ((i + 2) / 2).toString(), eval("data" + (i).toString()), eval("data" + (i + 1).toString())));
                                    Times.push(new Time("Time-" + ((i + 2) / 2).toString(), eval("data" + (i).toString())));

                                }
                                else {
                                    Elevs.push(new Elev("imageElev-" + ((i + 1) / 2).toString(), eval("data" + (i).toString())));
                                    Measures.push(new Measure("Measure-" + ((i + 1) / 2).toString(), eval("data" + (i).toString())));
                                }
                            }


            }

        })


}




function brushed() {
  for (i = 0; i < Plans.length; i++) {
        Plans[i].z.domain(Times[i].brush.empty() ? Times[i].x.domain() : Times[i].brush.extent());
        Plans[i].wrangleData();
  }

}

function brushedMeasure() {

    for (i = 0; i < Elevs.length; i++) {
        Elevs[i].z.domain(Measures[i].brush.empty() ? Measures[i].x.domain() : Measures[i].brush.extent());
        Elevs[i].wrangleData();
    }
}


function enableNavigation(){
    $('body').removeClass('noscroll');
    $('#preloader').css("visibility", "hidden");

}