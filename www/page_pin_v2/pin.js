$(document).ready(() => {
    loadMap();
    getData();
});

let latlng = {
    lat: 16.820378,
    lng: 100.265787
}
let map = L.map('map', {
    center: latlng,
    zoom: 13
});
let marker, gps, dataurl;
// const url = 'http://localhost:3200';
const url = 'https://rti2dss.com:3200';

function loadMap() {
    var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1
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
        "Mapbox": mapbox.addTo(map),
        "google Hybrid": ghyb
    }
    var overlayMap = {
        "ขอบจังหวัด": pro
    }
    L.control.layers(baseMap, overlayMap).addTo(map);
}

function onLocationFound(e) {
    latlng = e.latlng;
    // console.log(e.latlng)
    $('#lat').val(e.latlng.lat);
    $('#lng').val(e.latlng.lng);
    changeLatlng();
}

function changeLatlng() {
    console.log(gps)
    if (gps) {
        map.removeLayer(gps);
    }

    latlng = {
        lat: $('#lat').val(),
        lng: $('#lng').val()
    }

    gps = L.marker(latlng, {
        draggable: true,
        name: 'p'
    });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
    gps.on('dragend', (e) => {
        console.log(e)
        $('#lat').val(e.target._latlng.lat);
        $('#lng').val(e.target._latlng.lng);
    })
}

function onLocationError(e) {
    console.log(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate({ setView: true, maxZoom: 16 });

async function getData() {
    // console.log(marker)
    if (marker) {
        map.removeLayer(marker);
    }

    await $.get(url + '/anticov-api/pin-getdata', (res) => {
        marker = L.geoJSON(res, {
            pointToLayer: (feature, latlng) => {
                let icon;
                if (feature.properties.stype == 'ตำแหน่งเสี่ยง') {
                    icon = risk
                } else if (feature.properties.stype == 'แบ่งปันหน้ากากและแอลกอฮอล์') {
                    icon = mask
                } else if (feature.properties.stype == 'แบ่งปันอาหารและเครื่องดื่ม') {
                    icon = food
                } else if (feature.properties.stype == 'สถานที่ปิดทำการ') {
                    icon = close
                } else if (feature.properties.stype == 'จุดตรวจ') {
                    icon = stop
                } else {
                    icon = other
                }

                const iconMarker = L.icon({
                    iconUrl: icon,
                    iconSize: [40, 40],
                });
                return L.marker(latlng, {
                    icon: iconMarker,
                    draggable: false
                });
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties) {
                    // console.log(feature.properties.img)
                    let img = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIC02NCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiPjxwYXRoIGQ9Im01MTIgNTguNjY3OTY5djI2Ni42NjQwNjJjMCAzMi40Mjk2ODgtMjYuMjM4MjgxIDU4LjY2Nzk2OS01OC42Njc5NjkgNTguNjY3OTY5aC0zOTQuNjY0MDYyYy01LjMzNTkzOCAwLTEwLjQ1MzEyNS0uNjQwNjI1LTE1LjE0ODQzOC0yLjEzMjgxMi0yNS4xNzE4NzUtNi42MTMyODItNDMuNTE5NTMxLTI5LjQ0MTQwNy00My41MTk1MzEtNTYuNTM1MTU3di0yNjYuNjY0MDYyYzAtMzIuNDI5Njg4IDI2LjIzODI4MS01OC42Njc5NjkgNTguNjY3OTY5LTU4LjY2Nzk2OWgzOTQuNjY0MDYyYzMyLjQyOTY4OCAwIDU4LjY2Nzk2OSAyNi4yMzgyODEgNTguNjY3OTY5IDU4LjY2Nzk2OXptMCAwIiBmaWxsPSIjZWNlZmYxIi8+PHBhdGggZD0ibTE0OS4zMzIwMzEgMTA2LjY2Nzk2OWMwIDIzLjU2MjUtMTkuMTAxNTYyIDQyLjY2NDA2Mi00Mi42NjQwNjIgNDIuNjY0MDYyLTIzLjU2NjQwNyAwLTQyLjY2Nzk2OS0xOS4xMDE1NjItNDIuNjY3OTY5LTQyLjY2NDA2MiAwLTIzLjU2NjQwNyAxOS4xMDE1NjItNDIuNjY3OTY5IDQyLjY2Nzk2OS00Mi42Njc5NjkgMjMuNTYyNSAwIDQyLjY2NDA2MiAxOS4xMDE1NjIgNDIuNjY0MDYyIDQyLjY2Nzk2OXptMCAwIiBmaWxsPSIjZmZjMTA3Ii8+PHBhdGggZD0ibTUxMiAyNzYuMDU0Njg4djQ5LjI3NzM0M2MwIDMyLjQyOTY4OC0yNi4yMzgyODEgNTguNjY3OTY5LTU4LjY2Nzk2OSA1OC42Njc5NjloLTM5NC42NjQwNjJjLTUuMzM1OTM4IDAtMTAuNDUzMTI1LS42NDA2MjUtMTUuMTQ4NDM4LTIuMTMyODEybDI2MC42OTUzMTMtMjYwLjY5NTMxM2MxNC41MDM5MDYtMTQuNTAzOTA2IDM4LjM5ODQzNy0xNC41MDM5MDYgNTIuOTA2MjUgMHptMCAwIiBmaWxsPSIjMzg4ZTNjIi8+PHBhdGggZD0ibTM2My45NDUzMTIgMzg0aC0zMDUuMjc3MzQzYy01LjMzNTkzOCAwLTEwLjQ1MzEyNS0uNjQwNjI1LTE1LjE0ODQzOC0yLjEzMjgxMi0yNS4xNzE4NzUtNi42MTMyODItNDMuNTE5NTMxLTI5LjQ0MTQwNy00My41MTk1MzEtNTYuNTM1MTU3di02LjYxMzI4MWwxMjIuODc4OTA2LTEyMi44Nzg5MDZjMTQuNTA3ODEzLTE0LjUwNzgxMyAzOC40MDIzNDQtMTQuNTA3ODEzIDUyLjkwNjI1IDB6bTAgMCIgZmlsbD0iIzRjYWY1MCIvPjwvc3ZnPgo=';
                    feature.properties.img == '-' || feature.properties.img == null ? img : img = feature.properties.img
                    layer.bindPopup(
                        '<span style="font-family: Kanit; font-size: 16px;"> ' + feature.properties.sname + '</span></br>' +
                        'ประเภท: ' + feature.properties.stype + '</br>' +
                        'คำอธิบาย: ' + feature.properties.sdesc + '</br>'
                        +
                        '<img src="' + img + '" width="250px">'
                    );
                }
            }
        }).on('click', selectMarker);
        marker.addTo(map);
    })
}

$("#edit").attr("disabled", true);
$("#remove").attr("disabled", true);

var pos;
var pkid;
function selectMarker(e) {
    // console.log(e);
    $("#save").attr("disabled", true);

    $.get(url + '/anticov-api/pin-getimg/' + e.layer.feature.properties.id).done((res) => {
        console.log(res)
    })

    $('#sname').val(e.layer.feature.properties.sname);
    $('#stype').val(e.layer.feature.properties.stype);
    $('#sdesc').val(e.layer.feature.properties.sdesc);
    $("#edit").attr("disabled", false);
    $("#remove").attr("disabled", false);
    pos = {
        geom: '{"type":"Point","coordinates":[' + e.latlng.lng + ',' + e.latlng.lat + ']}',
        id: e.layer.feature.properties.id
    }
    pkid = e.layer.feature.properties.pkid;
    $("#status").empty().text("กำลังแก้ใขข้อมูล..");
}

map.on('click', () => {
    console.log('wddwwd')
    $('form :input').val('');
    $("#edit").attr("disabled", true);
    $("#remove").attr("disabled", true);
    $("#status").empty().text("");
    $("#save").attr("disabled", false);
});

function insertData() {
    $("#status").empty().text("File is uploading...");
    dataurl ? dataurl : dataurl = '-'
    const obj = {
        sname: $('#sname').val(),
        stype: $('#stype').val(),
        sdesc: $('#sdesc').val(),
        img: dataurl,
        geom: JSON.stringify(gps.toGeoJSON().geometry)
    }
    $.post(url + '/anticov-api/pin-insert', obj).done((res) => {
        getData();
        dataurl = null;
        $('form :input').val('');
        $('#preview').attr('src', '');
        $("#status").empty().text("");
    })
    return false;
}

function editData() {
    dataurl ? dataurl : dataurl = '-'
    const obj = {
        sname: $('#sname').val(),
        stype: $('#stype').val(),
        sdesc: $('#sdesc').val(),
        img: dataurl,
        geom: pos.geom,
        id: pos.id
    }
    $.post(url + '/anticov-api/pin-update', obj, (res) => {
        getData();
        $('form :input').val('');
        $('#preview').attr('src', '');
        $("#status").empty().text("");
    })
    return false;
}

function deleteData() {
    const obj = {
        id: pos.id
    }
    $.post(url + '/anticov-api/pin-delete', obj, (res) => {
        getData();
        $('form :input').val('');
        $('#preview').attr('src', '');
        $("#status").empty().text("");
    })
}

function refreshPage() {
    location.reload(true);
}

$('#imgfile').change(function (evt) {
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize();
});

function resize() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById('imgfile').files;
        var file = filesToUploads[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement("img");
                img.src = e.target.result;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 800;
                var width = img.width;
                var height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                dataurl = canvas.toDataURL(file.type);
                // console.log(dataurl)
                // document.getElementById('output').src = dataurl;
            }
            reader.readAsDataURL(file);
        }
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}









