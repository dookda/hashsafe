$(document).ready(function () {
    loadMembermap();
    loadDensitymap();
});


//  member
var membermap = L.map('membermap', {
    center: [18.802664, 98.950034],
    zoom: 13
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
    densityLayerControl.addOverlay(pro.addTo(densmap), '<img src="legend/ST_Amphoe_1.png" /> จังหวัด');


    let hr = 24;
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

