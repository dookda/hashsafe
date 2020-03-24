$(document).ready(function () {
    loadInfectedMap()

});

$('#fieldForm').submit(function (e) {
    e.preventDefault();
    $(this).ajaxSubmit({
        contentType: 'application/json',
        success: function (res) {
            $('form :input').val('');
            $("#status").empty().text("");
            refreshPage();
        }
    });
    return false;
});

let infectedMap = L.map('map', {
    center: [13.802664, 99.950034],
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
    }).addTo(infectedMap);


    // control that shows state info on hover


    info.onAdd = function (infectedMap) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        // console.log(props)
        this._div.innerHTML = '<h4>จำนวนผู้ติดเชื้อ COVID-19</h4>' + (props ?
            '<b>' + props.pro_name + '</b><br />' + props.infected + ' ราย'
            : '(เคลื่อนเม้าส์ไปยังจังหวัดที่ต้องการ)');
    };

    info.addTo(infectedMap);


    geojson = L.geoJson(infected, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(infectedMap);

    infectedMap.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (infectedMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 5, 10, 20, 50, 100, 200],
            labels = [],
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

    legend.addTo(infectedMap);
}

// get color depending on population density value
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

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    infectedMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function refreshPage() {
    location.reload(true);
}






