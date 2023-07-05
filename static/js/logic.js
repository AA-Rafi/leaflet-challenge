let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 6
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url).then(function(response) {
    let features = response.features;

    for (let i = 0; i < features.length; i++) {
        let location = features[i].geometry;
        let properties = features[i].properties;
// Color conditions
        if(location){
            let color = 'white';
            if (location.coordinates[2] > 90) {
                color = 'red';
            } else if (location.coordinates[2] > 70) {
                color = 'orange';
            } else if (location.coordinates[2] > 50) {
                color = 'yellow';
            } else if (location.coordinates[2] > 30) {
                color = 'cyan';
            } else if (location.coordinates[2] > 10) {
                color = 'green';
            } else {
                color = '#D1E231';
            }

            L.circleMarker([location.coordinates[1], location.coordinates[0]], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: properties.mag * 5
            }).bindPopup("<h3>" + properties.place +
              "</h3><hr><p>Magnitude: " + properties.mag + 
              "<br>Depth: " + location.coordinates[2] + "</p>").addTo(myMap);
        }
    }
});

// Create a legend
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ['#D1E231', 'green', 'cyan', 'yellow', 'orange', 'red'];
    let labels = [];

    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    // Add the numbers beside the colors
    let legendItems = div.getElementsByTagName('i');
    for (let i = 0; i < legendItems.length; i++) {
        let number = document.createElement('span');
        number.className = 'legend-number';
        number.textContent = depths[i];
        legendItems[i].appendChild(number);
    }

    return div;
};

legend.addTo(myMap);