
$(document).ready(async function () {
    loadMap();
    // await loadInfectedMap();
    await getLabcovid();
    // await getHeat();
    await getHeatLv1();
    await getHeatLv2();
    // await getHeatLv3();
    // await getHeatLv4();
    // await getHeateMe();
});

var map = L.map('map', {
    center: [18.802664, 98.950034],
    zoom: 13
});
var urlParams = new URLSearchParams(window.location.search);
var marker, gps, dataurl, tam, amp, pro, x, y;

var url = 'https://rti2dss.com:3200';
// var url = 'http://localhost:3200';

// $('#modal').modal('show');

var healthy = 0.1;

function getHowdy(a) {
    healthy = a;
}

function loadMap() {
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var Stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
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
        "StamenBasemap": Stamen.addTo(map),
        "OpenStreetMap": osm,
        "GoogleMap": grod,
        "GoogleHybrid": ghyb
    }

    layerControl = L.control.layers(baseMap).addTo(map);
    // layerControl.addOverlay(pro.addTo(map), '<img src="legend/ST_Amphoe_1.png" /> จังหวัด');
}

var place;
function onLocationFound(e) {
    // console.log(e)
    gps = L.marker(e.latlng);
    setLocation(gps)
}

function onLocationError(e) {
    console.log(e.message);
}

function refreshPage() {
    location.reload(true);
}

map.on('locationfound', onLocationFound);
// map.on('locationerror', onLocationError);
// map.locate({ setView: true, maxZoom: 18 });

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: "enable gps"
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);

lc.start();

function setLocation(gps) {
    const obj = {
        userid: urlParams.get('userid'),
        healthy: healthy,
        geom: JSON.stringify(gps.toGeoJSON().geometry)
    }
    $.post(url + '/anticov-api/saveloc', obj).done((res) => {
        return false;
    })
    return false;
}

var hospitals;
function getLabcovid() {

    const icon = './img/shield.png';
    const iconMarker = L.icon({
        iconUrl: icon,
        iconSize: [32, 35],
        iconAnchor: [12, 37],
        popupAnchor: [5, -36]
    });

    hospitals = L.geoJSON(covidlab, {
        // onEachFeature: labPopup,
        pointToLayer: function (feature, latlng) {
            // console.log(feature)
            return L.marker(latlng, {
                icon: iconMarker
            }).bindPopup(
                '<br/><span >สถานที่: </span>' + feature.properties.Name +
                '<br/><span >ลิ้งค์: </span><a href="' + feature.properties.PopupInfo + '">' + feature.properties.PopupInfo + '</a>'
            );;
        }
    });
    layerControl.addOverlay(hospitals.addTo(map), 'สถานที่รับตรวจ COVID 19');
}

function labPopup(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var hr_all = 6;
var hr_me = 120;

var pntAll = [];
function getHeat() {
    $.get(url + '/anticov-api/getweloc/' + hr_all).done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntAll.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        let heatLyr = L.heatLayer(pntAll, {
            radius: 20,
            gradient: { 0.4: 'OliveDrab', 0.5: 'Orange', 1: 'Coral' },
            blur: 40
        });
        layerControl.addOverlay(heatLyr, 'ความหนาแน่นของผู้ใช้ทั้งหมด');
    })
}


var pntLv1 = [];
function getHeatLv1() {
    $.get(url + '/anticov-api/getweloc/' + hr_all + '/0.1').done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntLv1.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        let heatLyr = L.heatLayer(pntLv1, {
            radius: 20,
            gradient: { 0.4: 'PaleGreen', 0.5: 'MediumSeaGreen', 1: 'ForestGreen' },
            blur: 50
        });
        layerControl.addOverlay(heatLyr.addTo(map), 'กลุ่มผู้ใช้ที่สบายดี');
    })
}

var pntLv2 = [];
function getHeatLv2() {
    $.get(url + '/anticov-api/getweloc/' + hr_all + '/0.6').done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntLv2.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        var heatLyr = L.heatLayer(pntLv2, {
            radius: 20,
            gradient: { 0.4: 'Plum', 0.5: 'Orchid', 1: 'DarkOrchid' },
            blur: 50
        });
        layerControl.addOverlay(heatLyr, 'กลุ่มผู้ใช้ที่ผู้ป่วย');
    })
}

var pntLv3 = [];
function getHeatLv3() {
    $.get(url + '/anticov-api/getweloc/' + hr_all + '/0.6').done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntLv3.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        var heatLyr = L.heatLayer(pntLv3, {
            radius: 20,
            gradient: { 0.4: 'PeachPuff', 0.5: 'Coral', 1: 'OrangeRed' },
            blur: 50
        });
        layerControl.addOverlay(heatLyr, 'ความหนาแน่นผู้ใช้ที่คิดว่าเสี่ยง');
    })
}

var pntLv4 = [];
function getHeatLv4() {
    $.get(url + '/anticov-api/getweloc/' + hr_all + '/1.0').done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntLv4.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        var heatLyr = L.heatLayer(pntLv4, {
            radius: 20,
            gradient: { 0.4: 'LightCoral', 0.5: 'Crimson', 1: 'Red' },
            blur: 50
        });
        layerControl.addOverlay(heatLyr, 'ความหนาแน่นผู้ใช้ที่ป่วย');
    })
}

var pntArrMe = [];
function getHeateMe() {
    const obj = {
        userid: urlParams.get('userid'),
        hr: hr_me
    }
    $.post(url + '/anticov-api/getmyloc/', obj).done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntArrMe.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        var heatLyr = L.heatLayer(pntArrMe, {
            radius: 20,
            gradient: { 0.4: 'lightskyblue', 0.5: 'lemonchiffon', 1: 'lightcoral' },
            blur: 50
        });
        layerControl.addOverlay(heatLyr.addTo(map), 'ความหนาแน่นของตนเอง');
    })
}

// infected province map
var info = L.control();
var legend = L.control({ position: 'bottomright' });
function loadInfectedMap() {

    info.onAdd = function (infectedMap) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        // console.log(props)
        this._div.innerHTML = '<h4>จำนวนผู้ติดเชื้อ COVID-19</h4>' + (props ?
            '<b>' + props.pro_name + '</b><br />' + props.infected + ' ราย'
            : '');
    };

    geojson = L.geoJson(infected, {
        style: style,
        onEachFeature: onEachFeature
    });

    layerControl.addOverlay(geojson, 'จำนวนผู้ติดเชื้อรายจังหวัด');

    // map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

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
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

map.on('overlayadd', onOverlayAdd);
map.on('overlayremove', onOverlayRemove);

function onOverlayAdd(e) {
    // console.log(e)
    e.name == "จำนวนผู้ติดเชื้อรายจังหวัด" ? legend.addTo(map) : null;
    e.name == "จำนวนผู้ติดเชื้อรายจังหวัด" ? info.addTo(map) : null;

    // legend.addTo(map);
    // info.addTo(map);
}

function onOverlayRemove(e) {
    // this.removeControl(legend);
    // this.removeControl(info);
    e.name == "จำนวนผู้ติดเชื้อรายจังหวัด" ? this.removeControl(legend) : null;
    e.name == "จำนวนผู้ติดเชื้อรายจังหวัด" ? this.removeControl(info) : null;
}


