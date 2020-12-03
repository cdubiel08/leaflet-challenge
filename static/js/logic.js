
// Creating map object
var myMap = L.map("mapid", {
    center: [44, -90.2437],
    zoom: 2
});

// Adding tile layer
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    mapZoom: 15,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Outdoor Map": outdoormap,
    "Dark Map": darkmap,
    "Light Map": lightmap
};
outdoormap.addTo(myMap)

var earthquakes = new L.LayerGroup()

// Create overlay object to hold overlay layer
var overlayMaps = {
    "Earthquakes": earthquakes
};

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Load in geojson data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";


// Add a marker to the map for each earthquake
d3.json(link, function (response) {
    function circleadd(features) {
        return {
            radius: circlesize(features.properties.mag),
            fillColor: circlecolor(features.geometry.coordinates[2]),
            weight: .2,
            color: "black",
            fillOpacity: .7
        }
    }
    console.log(response);
    function circlecolor(depth) {
        if (depth > 90)
            return "#FF0000"
        else if (depth > 70)
            return "#FF6900"
        else if (depth > 50)
            return "#FFFF00"
        else if (depth > 30)
            return "#FFD300"
        else if (depth > 10)
            return "#C2FF00"
        else
            return "#58FF00"
    }

    function circlesize(mag) {
        if (mag === 0) {
            return 1
        } else
            return mag * 2

    }

    L.geoJSON(response, {
        pointToLayer: function (features, latlong) {
            return L.circleMarker(latlong);
        },
        style: circleadd,
        onEachFeature: function (features, layer) {
            layer.bindPopup(`<h3> ${features.properties.place} </h3> <hr> <p> <h3> Mag: ${features.properties.mag} </h3> <hr>${(features.geometry.coordinates[2])} </p>`);
        }

    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var depth = ["-10", "10", "30", "50", "70", "90"];
        var colors = ["green", "purple", "pink", "coral", "orange", "red"];
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML += "<i style='background:" + colors[i] + "'></i>" + depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] +
                "<br>" + "<br>" : "+");
        }

        return div;
    };
    // Add legend to the map
    legend.addTo(myMap);
});
