$(document).ready(async function () {

    await liff.init({ liffId: "1653987548-K3B2gV1Z" })
    loadInfectedMap();
});

let map = L.map('map', {
    center: [13.802664, 100.890034],
    zoom: 6
});

var info = L.control();
function loadInfectedMap() {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    $.get('https://rti2dss.com/saveme/page_upload/upload/coviddata.geojson').done((res) => {
        let json = JSON.parse(res);
        $("#update").text(json.features[0].properties.update);
        geojson = L.geoJson(JSON.parse(res), {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
}

function getColor(d) {
    return d > 200 ? '#800026' :
        d > 100 ? '#BD0026' :
            d > 50 ? '#E31A1C' :
                d > 10 ? '#FC4E2A' :
                    d > 5 ? '#FD8D3C' :
                        d > 1 ? '#FEB24C' :
                            d > 0 ? '#FED976' :
                                '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.infected)
    };
}

var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function (infectedMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 5, 10, 20, 50, 100, 200],
        labels = ['จำนวนผู้ป่วย : ราย'],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

function zoomToFeature(e) {
    var layer = e.target;
    map.fitBounds(e.target.getBounds());
    info.update(layer.feature.properties);
}

function onEachFeature(feature, layer) {
    layer.on({
        click: zoomToFeature
    });
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>จำนวนผู้ป่วย COVID-19</h4>' + (props ?
        '<b>' + props.pro_name + '</b><br />' + props.infected + ' ราย'
        : '');

};

info.addTo(map);
