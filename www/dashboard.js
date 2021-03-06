$(document).ready(function () {
    loadMembermap();
    loadDensitymap();
    loadInfectedMap();
    getChart();
});

//  member
var membermap = L.map('membermap', {
    center: [13.802664, 99.950034],
    zoom: 6
});

var url = 'https://rti2dss.com:3200';
// var url = 'http://localhost:3200';

function loadMembermap() {
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var Stamen = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
    });
    const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    var pro = L.tileLayer.wms("http://rti2dss.com:8080/geoserver/th/wms?", {
        layers: 'th:province_4326',
        format: 'image/png',
        transparent: true
    });
    var baseMap = {
        "OSM": osm,
        "แผนที่ขาวดำ": Stamen.addTo(membermap),
        "แผนที่ถนน": grod,
        "แผนที่ภาพถ่าย": ghyb
    }

    let memberLayerControl = L.control.layers(baseMap).addTo(membermap);
    memberLayerControl.addOverlay(pro.addTo(membermap), '<img src="legend/ST_Amphoe_1.png" /> จังหวัด');


    let member = L.layerGroup();
    $.get(url + '/anticov-api/memberloc').done((res) => {
        var pnt = res.data;
        $('#usercount').text(pnt.length);
        let mk;
        pnt.forEach(e => {
            mk = L.marker([e.lat, e.lng]).bindPopup(e.titleth + '</br>' + e.titleother + '</br> <a href="' + e.googlemapslink + '">ดูเส้นทาง</a>');
            mk.addTo(member)
        });

        memberLayerControl.addOverlay(member.addTo(membermap), 'ผู้ใช้');
    })
}


// density
let densmap = L.map('densitymap', {
    center: [18.802664, 98.950034],
    zoom: 13
});
function loadDensitymap() {
    let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let Stamen = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
    });
    const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    let pro = L.tileLayer.wms("http://rti2dss.com:8080/geoserver/th/wms?", {
        layers: 'th:province_4326',
        format: 'image/png',
        transparent: true
    });
    let baseMap = {
        "OSM": osm,
        "แผนที่ขาวดำ": Stamen.addTo(densmap),
        "แผนที่ถนน": grod,
        "แผนที่ภาพถ่าย": ghyb
    }

    let densityLayerControl = L.control.layers(baseMap).addTo(densmap);
    densityLayerControl.addOverlay(pro.addTo(densmap), '<img style="height:15px;" src="legend/ST_Amphoe_1.png" /> จังหวัด');


    let hr = 20000;
    let pntAll = [];
    $.get(url + '/anticov-api/getweloc/' + hr).done((res) => {
        var pnt = res.data;
        pnt.forEach(e => {
            pntAll.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        let heatLyr = L.heatLayer(pntAll, {
            radius: 20,
            gradient: { 0.4: 'LightCoral', 0.5: 'Crimson', 1: 'Red' },
            blur: 50
        });
        densityLayerControl.addOverlay(heatLyr.addTo(densmap), 'ความหนาแน่นของผู้ใช้ทั้งหมด');
    })
}

// infected map
let infectedMap = L.map('infectedMap', {
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

