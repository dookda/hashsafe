$(document).ready(function () {
    loadMap();

})

var map = L.map('risk-map').setView([14.114433, 101.079177], 6);
var marker;

function loadMap() {
    const Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const pro = L.tileLayer.wms("http://rti2dss.com:8080/geoserver/th/wms?", {
        layers: 'th:province_4326',
        format: 'image/png',
        transparent: true,
        zIndex: 5,
        CQL_FILTER: 'pro_code=53'

    });
    const amp = L.tileLayer.wms('http://rti2dss.com:8080/geoserver/th/wms?', {
        layers: 'th:amphoe_4326',
        format: 'image/png',
        transparent: true,
        zIndex: 5,
        CQL_FILTER: 'pro_code=53'
    });
    const tam = L.tileLayer.wms('http://rti2dss.com:8080/geoserver/th/wms?', {
        layers: 'th:tambon_4326',
        format: 'image/png',
        transparent: true,
        zIndex: 5,
        CQL_FILTER: 'pro_code=53'
    });

    const riskpoint = L.tileLayer.wms('http://rti2dss.com:8080/geoserver/accident/wms?', {
        layers: 'accident:ud_riskpoint_4326',
        format: 'image/png',
        transparent: true,
        zIndex: 5
    });

    var baseMap = {
        "OSM": Mapnik.addTo(map),
        "แผนที่ถนน": grod,
        "แผนที่ภาพถ่าย": ghyb
    }
    layerControl = L.control.layers(baseMap).addTo(map);
    layerControl.addOverlay(tam.addTo(map), 'ขอบเขตตำบล');
    layerControl.addOverlay(amp.addTo(map), 'ขอบเขตอำเภอ');
    layerControl.addOverlay(pro.addTo(map), 'ขอบเขตจังหวัด');
    layerControl.addOverlay(riskpoint.addTo(map), 'จุดเสี่ยง');

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.locate({ setView: true, watch: true, maxZoom: 16 });
}

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: "Show me where I am, yo!"
    },
    locateOptions: {
        enableHighAccuracy: true
    },
    setView: 'untilPanOrZoom'
}).addTo(map);

lc.start();

var latlon;

function onLocationFound(e) {
    latlon = e.latlng;
    // map.setView(e.latlng, 16);
    // const icon = './img/marker.svg';
    // const iconMarker = L.icon({
    //     iconUrl: icon,
    //     iconSize: [35, 35],
    //     iconAnchor: [12, 37],
    //     popupAnchor: [5, -36]
    // });
    // marker = L.marker(e.latlng, {
    //     icon: iconMarker, draggable: true
    // });
    // marker.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
    getDisease(latlon.lat, latlon.lng);
    // marker.on('dragend', (e) => {
    //     latlon = {
    //         lat: e.target._latlng.lat,
    //         lon: e.target._latlng.lng
    //     };
    //     map.panTo(e.target._latlng);
    //     getDisease(latlon.lat, latlon.lon);
    // })
}

function onLocationError(e) {
    console.log(e.message);
}

function getDisease(lat, lon) {
    var point = L.layerGroup();
    var buff = 1000;
    const icon = './img/caution.svg';
    const iconMarker = L.icon({
        iconUrl: icon,
        iconSize: [30, 30],
        iconAnchor: [15, 20],
        popupAnchor: [5, -36]
    });
    map.eachLayer((lyr) => {
        // console.log(lyr);
        if (lyr.options.iconName == 'risk') {
            map.removeLayer(lyr);
        }
    });
    $.get(`https://rti2dss.com:3100/acc-api/riskpoint/${lat}/${lon}/${buff}`, (res) => {
        $('#sumpoint').text('พบจุดเสี่ยงใกล้คุณ ' + res.count + ' จุด');
        $('#items').empty();
        // console.log(res)
        let marker = L.geoJSON(res.data, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: iconMarker,
                    iconName: 'risk',
                    attribute: feature.properties
                });
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties) {
                    layer.bindPopup(feature.properties.name);
                }

                var newDiv = $(`<div class="card bg-warning text-white mt-3">
                    <div class="card-body">${feature.properties.name}</span></div>
                </div>`);
                console.log(feature.properties)
                $('#items').append(newDiv);
            }
        });
        marker.addTo(point);
        point.addTo(map);

    })

    // layerControl.addOverlay(point.addTo(map), 'จุดเสี่ยงในรัศมี 2 กม.');
}

$("#radius").change(() => {
    getDisease(latlon.lat, latlon.lon);
})








