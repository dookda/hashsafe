
$(document).ready(function () {
    loadMap();
    getHosp();
    getHeat()
});

var map = L.map('map', {
    center: [18.802664, 98.950034],
    zoom: 13
});
var urlParams = new URLSearchParams(window.location.search);
var marker, gps, dataurl, tam, amp, pro, x, y;

// var url = 'https://rti2dss.com:3200';
var url = 'http://localhost:3200';

$('#modal').modal('show');

var healthy = 0.2;
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
        "OpenStreetMap": osm,
        "Stamen": Stamen.addTo(map),
        "GoogleMap": grod,
        "GoogleHybrid": ghyb
    }
    // var overlayMap = {
    //     "ขอบจังหวัด": pro.addTo(map)
    // }
    // L.control.layers(baseMap, overlayMap).addTo(map);

    layerControl = L.control.layers(baseMap).addTo(map);
    // layerControl.addOverlay(pro.addTo(map), '<img src="legend/ST_Amphoe_1.png" /> จังหวัด');

}

var place;
function onLocationFound(e) {
    console.log(e)
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

var hospitals = L.layerGroup();
function getHosp() {
    // console.log(hospital)
    var mk;
    hospital.forEach(e => {
        // console.log(e)
        mk = L.marker([e.lat, e.lng]).bindPopup(e.titleth + '</br>' + e.titleother + '</br> <a href="' + e.googlemapslink + '">ดูเส้นทาง</a>');
        mk.addTo(hospitals)
    });
    layerControl.addOverlay(hospitals, 'โรงพยาบาล');
}


var pntArr = [];
function getHeat() {
    $.get(url + '/anticov-api/getweloc/1').done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntArr.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        var heatLyr = L.heatLayer(pntArr, {
            radius: 20,
            gradient: { 0.4: 'lightskyblue', 0.5: 'lemonchiffon', 1: 'lightcoral' },
            blur: 30
        });
        layerControl.addOverlay(heatLyr.addTo(map), 'Heatmap ของทุกคน');
    })
}

var pntArrAll = [];
function getHeat() {
    $.get(url + '/anticov-api/getmyloc/1').done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntArr.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        var heatLyr = L.heatLayer(pntArr, {
            radius: 20,
            gradient: { 0.4: 'lightskyblue', 0.5: 'lemonchiffon', 1: 'lightcoral' },
            blur: 30
        });
        layerControl.addOverlay(heatLyr.addTo(map), 'Heatmap ของทุกคน');
    })
}


