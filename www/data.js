
$(document).ready(function () {
    loadMap();
    // getHosp();
    getHeat();
    getHeatLv1();
    getHeatLv2();
    getHeatLv3();
    getHeatLv4();
    getHeateMe();
});

var map = L.map('map', {
    center: [18.802664, 98.950034],
    zoom: 13
});
var urlParams = new URLSearchParams(window.location.search);
var marker, gps, dataurl, tam, amp, pro, x, y;

var url = 'https://rti2dss.com:3200';
// var url = 'http://localhost:3200';

$('#modal').modal('show');

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


var hr_all = 2;
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
            gradient: { 0.4: 'LightCoral', 0.5: 'Crimson', 1: 'Red' },
            blur: 30
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
            blur: 30
        });
        layerControl.addOverlay(heatLyr, 'ความหนาแน่นผู้ใช้ที่สบายดี');
    })
}

var pntLv2 = [];
function getHeatLv2() {
    $.get(url + '/anticov-api/getweloc/' + hr_all + '/0.4').done((res) => {
        var pnt = res.data
        pnt.forEach(e => {
            pntLv2.push([e.lat, e.lng, 0.5])
        });
        // console.log(pntArr);
        var heatLyr = L.heatLayer(pntLv2, {
            radius: 20,
            gradient: { 0.4: 'Plum', 0.5: 'Orchid', 1: 'DarkOrchid' },
            blur: 30
        });
        layerControl.addOverlay(heatLyr, 'ความหนาแน่นผู้ใช้ที่ไม่แน่ใจว่าเสี่ยง');
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
            blur: 30
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
            blur: 30
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
            blur: 30
        });
        layerControl.addOverlay(heatLyr.addTo(map), 'ความหนาแน่นของตนเอง');
    })
}


