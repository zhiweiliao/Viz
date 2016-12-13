
Map = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.displayData = []; // see data wrangling
    this.initVis();
}

Map.prototype.initVis = function() {
    var vis = this;


    vis.map = L.map(vis.parentElement).setView([41.893359, 12.482802], 3);

    L.Icon.Default.imagePath = 'img/';


    vis.capmap = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?' +
        'access_token=pk.eyJ1IjoiemxpYW8iLCJhIjoiY2l2eDV2NGJ2MDFncDJ0cHM5ZTJ1NDB1bSJ9.BiUu91Qd1Z2eWl7sBKYKrA',
        {
            minZoom: 0,
            maxZoom: 18,

        }).addTo(vis.map);


//var marker = L.marker([41.893359, 12.482802]).addTo(map);
    for (i = 0; i < vis.data.length; i++) {

        vis.circle = L.circle(
            [+vis.data[i].latitude, +vis.data[i].longitude
            ], 50000, {
            color: '#FFC300',
            fillColor: '#FFC300',
            fillOpacity: 1
        })
            .bindPopup(vis.data[i].title)
            .addTo(vis.map)
            //console.log(vis.circle)
    }

    vis.popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(vis.map);
    }

    vis.map.on('click', onMapClick);


    /*
     var marker = L.marker([41.893359, 12.482802])
     .bindPopup(popupContent)
     .addTo(map);
     */



// Create a marker and bind a popup with a particular HTML content
  //  vis.marker = L.marker([41.898620, 12.476864])
    //    .bindPopup(popupContent)
      //  .addTo(vis.map);

}