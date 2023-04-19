var myMap = L.map("map", {
    center: [37.6000, -95.6650],
    zoom: 4.5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
}).addTo(myMap);


// Getting the colors for the circles and legend based on depth
function getColor(depth) {
    return depth >= 90 ? "red" :
        depth < 90 && depth >= 70 ? "orangered" :
        depth < 70 && depth >= 50 ? "orange" :
        depth < 50 && depth >= 30 ? "gold" :
        depth < 30 && depth >= 10 ? "yellow" :
                                    "green";
}

// Drawing the circles
function drawCircle(point, latlng) {
    let mag = point.properties.mag;
    let depth = point.geometry.coordinates[2];
    return L.circle(latlng, {
            fillOpacity: 0.7,
            color: "black",
            fillColor: getColor(depth),
            weight:0.5,
            // The size of the circle is based on magnitude of the earthquake
            radius: mag * 20000
    })
}

// Displaying info when the feature is clicked
function bindPopUp(feature, layer) {
    layer.bindPopup(`<h4>Location: ${feature.properties.place}</h4> <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`);
}


// The link to get the Earthquak GeoJSON data
var url = " https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting the GeoJSON data
d3.json(url).then((data) => {
    var features = data.features;

    // Creating a GeoJSON layer with the retrieved data
    L.geoJSON(features, {
        pointToLayer: drawCircle,
        onEachFeature: bindPopUp
    }).addTo(myMap);

    // Setting up the legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = () => {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'></h3>"

        // Looping through our intervals and generating a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
});