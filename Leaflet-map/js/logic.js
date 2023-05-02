
 // Set up earthquakes visualization GeoJSON url variable
var eq_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Initialize the map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
  
});

// Define and add the background basemap layers to the map:
  
  var baseMap = { 
    StreetView: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',   {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
    Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?',   {layers: 'TOPO-WMS'}),
    };

// Create a layer control  
  L.control.layers(baseMap,).addTo(myMap);
  
  baseMap.StreetView.addTo(myMap);


// Retrieve and add the earthquake data to the map
d3.json(eq_url).then(function (eq_data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapSize(feature.properties.mag),
            stroke: true,
            weight: 0.7
        };

    // Establish marker colors corresponding to earthquake depth
    }
    function mapColor(depth) {
        switch (true) {
            case depth > 90:
                return "#ff00bf";
            case depth > 70:
                return "#FF0000";
            case depth > 50:
                return "#FF4600";
            case depth > 30:
                return "#ff8000";
            case depth > 10:
                return "#FFEC00";
            default:
                return "#83FF00";
        }
    }
    // Establish marker sizes corresponding to earthquake magnitude
    function mapSize(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 4;
    }

    // Add earthquake data to the map
    L.geoJson(eq_data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,
        // Activate pop-up data when circles are clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place 
            + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

// Add the information legend with colors corresponding to depth
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];
  div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  
// loop through the depth intervals 
  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;'
    + depth[i + 1] + '<br>' : '+');
}
  return div;
};
legend.addTo(myMap)
});



