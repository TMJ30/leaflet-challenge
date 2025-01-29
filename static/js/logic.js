// Create the 'basemap' tile layer that will be the background of our map.
let map = L.map("map", {
  center:  [39.50, -98.35],
  zoom: 5
})

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  // let earthquakes = data.features
  // console.log(earthquakes[0].properties.mag) //Make sure data importing

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return{
      color: "black" ,
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag),
      opacity: 1,
      fillOpacity: 1
    }

  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) { //shallow earthquakes 0 to 70km, medium earthquakes 71 to 300km, deep earthquakes 301 to 700
    if (depth > 10) {return "blue"}
    else if (depth > 30) {return "green"}
    else if (depth > 50) {return "yellow"}
    else if (depth > 70) {return "orange"}
    else if (depth > 90) {return "red"}
    else  {return "purple"}

    
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) return 1
    else magnitude * 4
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng)
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " + feature.properties.mag
        + "<br> Depth: " + feature.geometry.coordinates[2]
        + "<br> Location: " + feature.properties.place
      )
    }

  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let depthRanges = [-10, 10, 30, 50, 70, 90]
    let depthColors = ["purple", "blue", "green", "yellow", "orange", "red"]
    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthRanges.length; i++) {
      div.innerHTML += "<i style='background: " + depthColors[i] + "'></i> "
        + depthRanges[i] + (depthRanges[i + 1] ? "&ndash;" + depthRanges[i + 1] + "<br>" : "+");
    }

    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(map)
});
