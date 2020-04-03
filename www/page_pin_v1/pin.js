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

    const mask = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgd2lkdGg9IjUxMnB4Ij48cGF0aCBkPSJtMTI4IDc1LjUxNmgtODQuNWE1IDUgMCAwIDAgLTUgNXY5MS4wMzlhNSA1IDAgMCAwIDQuMzU5IDQuOTU5bDgzLjg1OSAxMC44MzZhMTAgMTAgMCAwIDAgMi41NjQgMGw4My44NTktMTAuODM2YTUgNSAwIDAgMCA0LjM1OS00Ljk1OXYtOTEuMDM5YTUgNSAwIDAgMCAtNS01eiIgZmlsbD0iIzZiZGRkZCIvPjxwYXRoIGQ9Im0xODUuMSAxNDYuMTU5LTU2Ljg1NiA0LjU0YTIuOTM0IDIuOTM0IDAgMCAxIC0uNDc4IDBsLTU2Ljg1Ni00LjU0YTMgMyAwIDAgMCAtMy4yMzggMi45OSAzIDMgMCAwIDAgMi43NjEgMi45OTFsNTcuMzMzIDQuNTc4LjIzOS4wMiA1Ny41NzItNC42YTMgMyAwIDAgMCAyLjc2MS0yLjk5MSAzIDMgMCAwIDAgLTMuMjM4LTIuOTg4eiIgZmlsbD0iI2UwZWJmYyIvPjxwYXRoIGQ9Im0xODUuMSAxMzIuMTU5LTU2Ljg1NiA0LjU0YTIuOTM0IDIuOTM0IDAgMCAxIC0uNDc4IDBsLTU2Ljg1Ni00LjU0YTMgMyAwIDAgMCAtMy4yMzggMi45OSAzIDMgMCAwIDAgMi43NjEgMi45OTFsNTcuMzMzIDQuNTc4LjIzOS4wMiA1Ny41NzItNC42YTMgMyAwIDAgMCAyLjc2MS0yLjk5MSAzIDMgMCAwIDAgLTMuMjM4LTIuOTg4eiIgZmlsbD0iI2UwZWJmYyIvPjxwYXRoIGQ9Im0xMjggMTg5LjQzM2ExMi4wMTUgMTIuMDE1IDAgMCAxIC0xLjUzOS0uMWwtODMuODYxLTEwLjgzM2E3LjAxNiA3LjAxNiAwIDAgMSAtNi4xLTYuOTQydi05MS4wNDJhNy4wMDggNy4wMDggMCAwIDEgNy03aDE2OWE3LjAwOCA3LjAwOCAwIDAgMSA3IDd2OTEuMDM5YTcuMDE2IDcuMDE2IDAgMCAxIC02LjEgNi45NDJsLTgzLjg1OSAxMC44MzZhMTEuOTg4IDExLjk4OCAwIDAgMSAtMS41NDEuMXptLTg0LjUtMTExLjkxN2EzIDMgMCAwIDAgLTMgM3Y5MS4wMzlhMy4wMDYgMy4wMDYgMCAwIDAgMi42MTYgMi45NzVsODMuODU5IDEwLjgzNmE3Ljk4NSA3Ljk4NSAwIDAgMCAyLjA0OSAwbDgzLjg2LTEwLjgzNmEzLjAwNiAzLjAwNiAwIDAgMCAyLjYxNi0yLjk3NXYtOTEuMDM5YTMgMyAwIDAgMCAtMy0zeiIgZmlsbD0iIzM3NjJjYyIvPjxnIGZpbGw9IiM0NjcxYzYiPjxwYXRoIGQ9Im00Ni41IDE1NS4zNjVoLTIyLjUzNWExNS45NjUgMTUuOTY1IDAgMCAxIC0xNS45NjUtMTUuOTY1di0zMmExNS45NjUgMTUuOTY1IDAgMCAxIDE1Ljk2NS0xNS45NjVoMjIuNTM1YTMgMyAwIDAgMSAzIDMgMyAzIDAgMCAxIC0zIDNoLTIyLjUzNWE5Ljk2NSA5Ljk2NSAwIDAgMCAtOS45NjUgOS45NjV2MzJhOS45NjUgOS45NjUgMCAwIDAgOS45NjUgOS45NjVoMjIuNTM1YTMgMyAwIDAgMSAzIDMgMyAzIDAgMCAxIC0zIDN6Ii8+PHBhdGggZD0ibTIzMi4wMzUgMTU1LjM2NWgtMjIuNTM1YTMgMyAwIDAgMSAtMy0zIDMgMyAwIDAgMSAzLTNoMjIuNTM1YTkuOTY1IDkuOTY1IDAgMCAwIDkuOTY1LTkuOTY1di0zMmE5Ljk2NSA5Ljk2NSAwIDAgMCAtOS45NjUtOS45NjVoLTIyLjUzNWEzIDMgMCAwIDEgLTMtMyAzIDMgMCAwIDEgMy0zaDIyLjUzNWExNS45NjUgMTUuOTY1IDAgMCAxIDE1Ljk2NSAxNS45NjV2MzJhMTUuOTY1IDE1Ljk2NSAwIDAgMSAtMTUuOTY1IDE1Ljk2NXoiLz48L2c+PC9zdmc+Cg==';
    const food = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBpZD0iTGF5ZXJfMSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTEyLjAwMSA1MTIuMDAxIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTEyLjAwMSA1MTIuMDAxIiB3aWR0aD0iNTEycHgiPjxnPjxnPjxnIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJtNDQ0Ljg5OSAyNTYuMDAxaC0zNzcuNzk2LTEzLjIxNmMtOS44MzggMC0xNy44ODYgOC4wNDktMTcuODg2IDE3Ljg4NnYxNS43NzJjMCA3OC42OTkgNjQuMzkxIDE0My4wODkgMTQzLjA4OSAxNDMuMDg5aDE1My44MjFjNzguNjk4IDAgMTQzLjA4OS02NC4zOTEgMTQzLjA4OS0xNDMuMDg5di0xNS43NzJjMC05LjgzNy04LjA0OC0xNy44ODYtMTcuODg2LTE3Ljg4NnoiIGZpbGw9IiNmZmUwZTYiLz48cGF0aCBkPSJtMTc5LjA5IDQzMi43NDhoMTUzLjgyMXY0My4yNTJoLTE1My44MjF6IiBmaWxsPSIjZmZiZWNiIi8+PHBhdGggZD0ibTY3LjEwMyAyNTYuMDAxaDM3Ny43OTZjNi4zMDctNy4yNzIgOS4wMDgtMTcuNDQ0IDYuMzI4LTI3LjQ0Mi0yLjY3OC05Ljk5OC0xMC4xMDMtMTcuNDU2LTE5LjIwMS0yMC42IDQuMjEtOC42NTcgNC4xODYtMTkuMTgyLS45OS0yOC4xNDYtNS4xNzUtOC45NjQtMTQuMjc3LTE0LjI0Ni0yMy44NzktMTQuOTI5LjQyMS0yLjE3OS41OTktNC4zOTYuNTMzLTYuNjA3LS4yMTgtNy4zNzgtMy4xNDItMTQuNjkyLTguNzc0LTIwLjMyMy01LjA5OS01LjA5OS0xMS41NzYtNy45NzgtMTguMjMzLTguNjM5LTIuODk4LS4yODctNS44My0uMTU0LTguNjk3LjM5OS0uNjgzLTkuNjAyLTUuOTY2LTE4LjcwNS0xNC45My0yMy44OC04Ljk2My01LjE3NS0xOS40ODgtNS4xOTktMjguMTQ0LS45ODktMy4xNDUtOS4wOTgtMTAuNjA0LTE2LjUyMy0yMC42MDItMTkuMjAycy0yMC4xNjkuMDIzLTI3LjQ0MSA2LjMyOWMtNS4zOTItNy45NzQtMTQuNTE5LTEzLjIxNi0yNC44Ny0xMy4yMTYtMTAuMzUgMC0xOS40NzYgNS4yNDItMjQuODY4IDEzLjIxNi03LjI3Mi02LjMwNy0xNy40NDQtOS4wMDgtMjcuNDQyLTYuMzI5cy0xNy40NTYgMTAuMTA0LTIwLjYwMSAxOS4yMDJjLTguNjU3LTQuMjEtMTkuMTgyLTQuMTg2LTI4LjE0NS45OS04Ljk2NCA1LjE3NS0xNC4yNDYgMTQuMjc4LTE0LjkyOSAyMy44OC0yLjg2Ny0uNTU0LTUuNzk5LS42ODctOC42OTctLjM5OS02LjY1Ni42Ni0xMy4xMzQgMy41NC0xOC4yMzMgOC42MzktNS42MzEgNS42MzEtOC41NTYgMTIuOTQ1LTguNzczIDIwLjMyMy0uMDY1IDIuMjExLjExMyA0LjQyNy41MzMgNi42MDYtOS42MDIuNjgzLTE4LjcwNSA1Ljk2NS0yMy44OCAxNC45My01LjE3NSA4Ljk2NC01LjE5OCAxOS40ODgtLjk4OSAyOC4xNDUtOS4wOTggMy4xNDUtMTYuNTIzIDEwLjYwMy0xOS4yMDIgMjAuNjAxLTIuNjc5IDkuOTk3LjAyMyAyMC4xNjkgNi4zMyAyNy40NDF6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTEwNC4zMTEgMTU4LjI3N2MuMjE3LTcuMzc4IDMuMTQyLTE0LjY5MiA4Ljc3My0yMC4zMjMgNS4wOTktNS4wOTkgMTEuNTc3LTcuOTc5IDE4LjIzMy04LjYzOWwtODMuNDc5LTg2Ljc5M2MtOC40NDMtOC43NzgtMjIuNzA0LTguNjEyLTMxLjMxNyAwLTguNjEyIDguNjEyLTguNzc3IDIyLjg3NCAwIDMxLjMxNnoiIGZpbGw9IiNmZmUwZTYiLz48cGF0aCBkPSJtNDY0LjE2MyA0Mi41MjItODMuNDggODYuNzkzYzYuNjU2LjY2IDEzLjEzNCAzLjU0IDE4LjIzMyA4LjYzOSA1LjYzMiA1LjYzMiA4LjU1NiAxMi45NDUgOC43NzQgMjAuMzIzbDg3Ljc5LTg0LjQzOGM4Ljc3Ny04LjQ0MyA4LjYxMi0yMi43MDQgMC0zMS4zMTctOC42MTMtOC42MTItMjIuODc0LTguNzc4LTMxLjMxNyAweiIgZmlsbD0iI2ZmZTBlNiIvPjwvZz48Zz48cGF0aCBkPSJtMTg2LjE2NCAyMDkuODgzYy01LjUyMiAwLTEwLjAwNC00LjQ3Ny0xMC4wMDQtMTBzNC40NzUtMTAgOS45OTctMTBoLjAwN2M1LjUyMiAwIDEwIDQuNDc3IDEwIDEwcy00LjQ3OCAxMC0xMCAxMHoiIGZpbGw9IiNlM2VhZWYiLz48L2c+PGc+PHBhdGggZD0ibTI0MC42NjUgMTU0Ljg4M2MtNS41MjIgMC0xMC4wMDQtNC40NzctMTAuMDA0LTEwczQuNDc1LTEwIDkuOTk3LTEwaC4wMDdjNS41MjIgMCAxMCA0LjQ3NyAxMCAxMHMtNC40NzggMTAtMTAgMTB6IiBmaWxsPSIjZTNlYWVmIi8+PC9nPjxnPjxwYXRoIGQ9Im0zNjMuNjY1IDIxNS44ODRjLTUuNTIyIDAtMTAuMDA0LTQuNDc3LTEwLjAwNC0xMHM0LjQ3NC0xMCA5Ljk5Ni0xMGguMDA4YzUuNTIyIDAgMTAgNC40NzcgMTAgMTBzLTQuNDc4IDEwLTEwIDEweiIgZmlsbD0iI2UzZWFlZiIvPjwvZz48Zz48cGF0aCBkPSJtMjkwLjY2NSAyMDguODgzYy01LjUyMiAwLTEwLjAwNC00LjQ3Ny0xMC4wMDQtMTBzNC40NzUtMTAgOS45OTctMTBoLjAwN2M1LjUyMiAwIDEwIDQuNDc3IDEwIDEwcy00LjQ3OCAxMC0xMCAxMHoiIGZpbGw9IiNlM2VhZWYiLz48L2c+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNDcyLjg3NiAzMTkuMzc1aC00MzMuNzUxYzMuODc0IDE4LjE1OCAxMS4yMiAzNS4wNyAyMS4zMDMgNTBoMzkxLjE0NmMxMC4wODItMTQuOTMgMTcuNDI4LTMxLjg0MiAyMS4zMDItNTB6IiBmaWxsPSIjZmZiZWNiIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L2c+PHBhdGggZD0ibTUxMiA1OC42NGMuMDg0LTguNjQ4LTMuMzU5LTE3LjEwMS05LjQ0OC0yMy4xODktNi4wMTctNi4wMTYtMTQuMzQtOS40NS0yMi44OC05LjQ1LS4xMDMgMC0uMjA2IDAtLjMxLjAwMS04LjU4Mi4wODMtMTYuNTM5IDMuNDg5LTIyLjQwNSA5LjU4OGwtNzcuOTE0IDgxLjAwN2MtMy4zMTgtOC4wNjgtOS4yMi0xNC45NC0xNi45ODUtMTkuNDIzLTguNTk5LTQuOTY1LTE4LjU5My02LjQ5OS0yOC4wODktNC41MzUtNS4zMjYtOC4xMDMtMTMuNDc5LTE0LjA4NS0yMy4wNjktMTYuNjU1cy0xOS42NDItMS40NjMtMjguMzA1IDIuODljLTcuMjQyLTYuNDQ4LTE2LjY2NS0xMC4xMTctMjYuNTk0LTEwLjExNy05LjkyOCAwLTE5LjM1MSAzLjY2OS0yNi41OTMgMTAuMTE3LTguNjY1LTQuMzU0LTE4LjcxNS01LjQ1OC0yOC4zMDYtMi44ODktOS41OSAyLjU2OS0xNy43NDIgOC41NTItMjMuMDY4IDE2LjY1NC05LjQ5Ny0xLjk2Mi0xOS40OTItLjQyOC0yOC4wOSA0LjUzNi03Ljc2NCA0LjQ4My0xMy42NjcgMTEuMzU0LTE2Ljk4NCAxOS40MjNsLTc3LjkxNS04MS4wMDhjLTUuODY2LTYuMDk5LTEzLjgyMy05LjUwNC0yMi40MDQtOS41ODctLjEwNC0uMDAxLS4yMDctLjAwMi0uMzExLS4wMDItOC41NCAwLTE2Ljg2NCAzLjQzNS0yMi44ODEgOS40NTEtNi4wODkgNi4wODktOS41MzIgMTQuNTQyLTkuNDQ4IDIzLjE5LjA4NCA4LjU4MSAzLjQ4OSAxNi41MzggOS41ODcgMjIuNDA0bDgwLjU1MiA3Ny40NzZjLTcuMzggMy40MTYtMTMuNjQ5IDkuMDQxLTE3LjgzNSAxNi4yOTEtNC45NjUgOC41OTktNi40OTkgMTguNTkzLTQuNTM2IDI4LjA4OS04LjEwMyA1LjMyNy0xNC4wODUgMTMuNDc5LTE2LjY1NCAyMy4wNjktMS44IDYuNzE0LTEuNzgxIDEzLjY1LS4xMjQgMjAuMTgyLTE0LjAyMSAxLjQ1My0yNC45OSAxMy4zMzctMjQuOTkgMjcuNzM1djE1Ljc3MmMwIDQwLjczMyAxNS45NjggNzkuMTM0IDQ0Ljk2MiAxMDguMTI4IDI2LjYwOSAyNi42MDggNjEuMTQyIDQyLjIzNSA5OC4xMjggNDQuNjI4djMzLjU4NmMwIDUuNTIzIDQuNDc4IDEwIDEwIDEwaDE1My44MjFjNS41MjIgMCAxMC00LjQ3NyAxMC0xMHYtMzMuNTg2YzM2Ljk4Ni0yLjM5MyA3MS41MTktMTguMDIgOTguMTI3LTQ0LjYyOCAyOC45OTQtMjguOTk0IDQ0Ljk2Mi02Ny4zOTUgNDQuOTYyLTEwOC4xMjd2LTE1Ljc3MmMwLTE0LjM5OS0xMC45Ny0yNi4yODItMjQuOTktMjcuNzM1IDEuNjU3LTYuNTMyIDEuNjc1LTEzLjQ2Ny0uMTI1LTIwLjE4MS0yLjU2OC05LjU5LTguNTUxLTE3Ljc0Mi0xNi42NTMtMjMuMDY5IDEuOTYzLTkuNDk2LjQyOS0xOS40OTEtNC41MzYtMjguMDg5LTQuMTg2LTcuMjUtMTAuNDU1LTEyLjg3NS0xNy44MzUtMTYuMjkybDgwLjU1MS03Ny40NzZjNi4wOTgtNS44NjggOS41MDQtMTMuODI1IDkuNTg3LTIyLjQwN3ptLTQ5MS45OTktLjE5NGMtLjAzMi0zLjMxMSAxLjI3Ny02LjUzOCAzLjU5My04Ljg1MyAyLjMxNC0yLjMxNSA1LjUxMi0zLjYyOSA4Ljg1My0zLjU5MiAzLjE2Ni4wMzEgNi4wNzMgMS4yNTcgOC4xODYgMy40NTNsNzIuNzM4IDc1LjYyNmMtMi42NDEgMS42MjItNS4xMTQgMy41Ni03LjM1NyA1LjgwMy0yLjY0IDIuNjQtNC44NjIgNS41OTYtNi42MzcgOC43NzJsLTc1LjkyMy03My4wMjRjLTIuMTk3LTIuMTExLTMuNDIyLTUuMDE4LTMuNDUzLTguMTg1em0xNjkuMDg5IDQwNy41NTV2LTIzLjI1MmgxMzMuODIxdjIzLjI1MnptMjc2LjkxMS0xOTIuMTE0djE1Ljc3MmMwIDczLjM4NS01OS43MDMgMTMzLjA4OS0xMzMuMDg5IDEzMy4wODloLTE1My44MjJjLTczLjM4NiAwLTEzMy4wOS01OS43MDQtMTMzLjA5LTEzMy4wODl2LTE1Ljc3MmMwLTQuMzQ4IDMuNTM4LTcuODg2IDcuODg3LTcuODg2aDQwNC4yMjhjNC4zNDggMCA3Ljg4NiAzLjUzOCA3Ljg4NiA3Ljg4NnptLTQyLjk2OC03MC4zMDJjLTEuMjUxIDIuNTcyLTEuMzQxIDUuNTU4LS4yNDYgOC4yczMuMjY5IDQuNjkgNS45NzMgNS42MjVjNi4zIDIuMTc4IDExLjA4OCA3LjMxMyAxMi44MDkgMTMuNzM4IDEuMzU1IDUuMDU1LjY1OCAxMC4zNjUtMS44MjUgMTQuODU0aC0zNjcuNDg1Yy0yLjQ4My00LjQ4OS0zLjE4LTkuNzk5LTEuODI2LTE0Ljg1NCAxLjcyMi02LjQyNSA2LjUxMS0xMS41NjEgMTIuODEtMTMuNzM4IDIuNzA0LS45MzUgNC44NzgtMi45ODIgNS45NzMtNS42MjVzMS4wMDUtNS42MjgtLjI0Ni04LjJjLTIuOTE1LTUuOTk0LTIuNjctMTMuMDExLjY1Ni0xOC43NzEgMy4zMjUtNS43NiA5LjI4LTkuNDgxIDE1LjkyOS05Ljk1NCAyLjg1NC0uMjAzIDUuNDgzLTEuNjE4IDcuMjI1LTMuODg3czIuNDI4LTUuMTc2IDEuODg1LTcuOTg0Yy0xLjI2NS02LjU0NC43ODktMTMuMjU4IDUuNDkyLTE3Ljk2MSA0LjcwMy00LjcwNCAxMS40MTUtNi43NTggMTcuOTYzLTUuNDkzIDIuODA3LjU0NSA1LjcxNC0uMTQzIDcuOTg0LTEuODg1IDIuMjctMS43NDEgMy42ODUtNC4zNzEgMy44ODctNy4yMjUuNDczLTYuNjQ4IDQuMTk0LTEyLjYwMyA5Ljk1NC0xNS45MjggNS43NjQtMy4zMjYgMTIuNzgxLTMuNTcgMTguNzcyLS42NTcgMi41NzIgMS4yNSA1LjU1NiAxLjM0IDguMi4yNDYgMi42NDMtMS4wOTUgNC42ODktMy4yNjkgNS42MjQtNS45NzIgMi4xNzgtNi4yOTkgNy4zMTMtMTEuMDg4IDEzLjczOC0xMi44MDkgNi40MjQtMS43MjMgMTMuMjY2LS4xNDMgMTguMzAyIDQuMjI1IDIuMTYxIDEuODczIDUuMDI0IDIuNzMxIDcuODU2IDIuMzU5IDIuODM2LS4zNzQgNS4zNzctMS45NDMgNi45NzktNC4zMTMgMy43MzMtNS41MjEgOS45MzQtOC44MTggMTYuNTg0LTguODE4IDYuNjUyIDAgMTIuODUyIDMuMjk2IDE2LjU4NSA4LjgxNyAxLjYwMyAyLjM3IDQuMTQzIDMuOTQgNi45NzkgNC4zMTMgMi44MzcuMzcxIDUuNjk3LS40ODYgNy44NTctMi4zNiA1LjAzNi00LjM2NyAxMS44NzgtNS45NDUgMTguMzAxLTQuMjI1IDYuNDI2IDEuNzIyIDExLjU2MiA2LjUxMSAxMy43MzkgMTIuODEuOTM1IDIuNzA0IDIuOTgxIDQuODc3IDUuNjI0IDUuOTcyIDIuNjQ1IDEuMDk1IDUuNjI4IDEuMDA1IDguMi0uMjQ2IDUuOTk1LTIuOTE2IDEzLjAxMS0yLjY3IDE4Ljc3MS42NTYgNS43NjEgMy4zMjUgOS40ODIgOS4yOCA5Ljk1NSAxNS45MjkuMjAyIDIuODU0IDEuNjE3IDUuNDgzIDMuODg3IDcuMjI1czUuMTc1IDIuNDI2IDcuOTg1IDEuODg1YzYuNTQ0LTEuMjYzIDEzLjI1OS43ODkgMTcuOTYxIDUuNDkyIDQuNzA0IDQuNzA0IDYuNzU4IDExLjQxOCA1LjQ5MyAxNy45NjItLjU0MyAyLjgwOS4xNDQgNS43MTUgMS44ODUgNy45ODRzNC4zNzEgMy42ODUgNy4yMjUgMy44ODdjNi42NDguNDczIDEyLjYwNCA0LjE5NCAxNS45MjkgOS45NTUgMy4zMjcgNS43NiAzLjU3MiAxMi43NzcuNjU3IDE4Ljc3MXptNjUuNTE0LTEzNi45NTQtNzUuOTIyIDczLjAyNGMtMS43NzYtMy4xNzYtMy45OTgtNi4xMzItNi42MzgtOC43NzItMi4yNDMtMi4yNDMtNC43MTYtNC4xODEtNy4zNTYtNS44MDNsNzIuNzM5LTc1LjYyNWMyLjExMi0yLjE5NiA1LjAyLTMuNDIyIDguMTg2LTMuNDUzIDMuMzEzLS4wMzUgNi41MzcgMS4yNzcgOC44NTMgMy41OTIgMi4zMTUgMi4zMTQgMy42MjQgNS41NDEgMy41OTIgOC44NTItLjAzMSAzLjE2Ni0xLjI1NyA2LjA3My0zLjQ1NCA4LjE4NXoiIGZpbGw9IiNjMWIwYjUiLz48L2c+PC9zdmc+Cg==';
    const risk = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIC0xNCA1MTEuOTk4ODkgNTExIiB3aWR0aD0iNTEycHgiPjxwYXRoIGQ9Im01MDEuNzE0ODQ0IDM3MC40NDkyMTktMTgxLjE3MTg3NS0zMzMuMzEyNWMtMTMuODEyNS0yMi44MjQyMTktMzcuODM1OTM4LTM2LjYzNjcxOS02NC41NjI1LTM2LjYzNjcxOS0yNi43MjY1NjMgMC01MC43NDYwOTQgMTMuODEyNS02NC44NTkzNzUgMzcuMjM0Mzc1bC0xODAuNTcwMzEzIDMzMi4xMTMyODFjLTEzLjgxMjUgMjMuNzIyNjU2LTE0LjExMzI4MSA1MS45NDkyMTktLjYwMTU2MiA3NS42NzE4NzUgMTMuNTExNzE5IDIzLjcyMjY1NyAzNy44MzU5MzcgMzcuODM1OTM4IDY1LjE2MDE1NiAzNy44MzU5MzhoMzYxLjc0MjE4N2MyNy4zMjgxMjYgMCA1MS42NDg0MzgtMTQuMTEzMjgxIDY1LjE2MDE1Ny0zNy44MzU5MzggMTMuNTE1NjI1LTIzLjcyMjY1NiAxMy4yMTQ4NDMtNTEuOTQ5MjE5LS4yOTY4NzUtNzUuMDcwMzEyem0wIDAiIGZpbGw9IiNmZmUxN2EiLz48cGF0aCBkPSJtNTAyLjAxMTcxOSA0NDUuNTE5NTMxYy0xMy41MTE3MTkgMjMuNzIyNjU3LTM3LjgzMjAzMSAzNy44MzU5MzgtNjUuMTYwMTU3IDM3LjgzNTkzOGgtMTgwLjg3MTA5M3YtNDgyLjg1NTQ2OWMyNi43MjY1NjIgMCA1MC43NSAxMy44MTI1IDY0LjU2MjUgMzYuNjM2NzE5bDE4MS4xNzE4NzUgMzMzLjMxMjVjMTMuNTExNzE4IDIzLjEyMTA5MyAxMy44MTI1IDUxLjM0NzY1Ni4yOTY4NzUgNzUuMDcwMzEyem0wIDAiIGZpbGw9IiNmZGJmMDAiLz48cGF0aCBkPSJtMjcwLjk5NjA5NCAyNDMuMTI4OTA2di05MC4wODU5MzdoLTQyLjk0MTQwNmwtNzcuNDcyNjU3IDE4MC4xNzE4NzVoOTAuMzgyODEzdjkwLjA4NTkzN2g0My44NDM3NWw1OS40NTcwMzEtMTgwLjE3MTg3NXptMCAwIiBmaWxsPSIjNTc1ZjY0Ii8+PHBhdGggZD0ibTM0NC4yNjU2MjUgMjQzLjEyODkwNi01OS40NTcwMzEgMTgwLjE3MTg3NWgtMjguODI4MTI1di0yNzAuMjU3ODEyaDE1LjAxNTYyNXY5MC4wODU5Mzd6bTAgMCIgZmlsbD0iIzMyMzkzZiIvPjwvc3ZnPgo=';
    const other = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB4Ij48Zz48cGF0aCBkPSJtMjU2IDE2NS40OWMwLTcwLjY5Mi01Ny4zMDgtMTI4LTEyOC0xMjhzLTEyOCA1Ny4zMDctMTI4IDEyOGMwIDM1LjU1NSAxNC41IDY3LjcyIDM3LjkwNSA5MC45MTVsMjE4LjA5NSAyMTguMTA1IDExOC4xMDQtMjE4LjUxeiIgZmlsbD0iI2ZmN2M0OCIvPjxwYXRoIGQ9Im0yNTYgNDc0LjUxIDIxOC4wOTUtMjE4LjEwN2MyMy40MDUtMjMuMTk0IDM3LjkwNS01NS4zNTkgMzcuOTA1LTkwLjkxMyAwLTcwLjY5Mi01Ny4zMDctMTI4LTEyOC0xMjhzLTEyOCA1Ny4zMDgtMTI4IDEyOHoiIGZpbGw9IiNmZjQxNWIiLz48L2c+PC9zdmc+Cg==';
    const stop = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMS45OTkgNTExLjk5OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTExLjk5OSA1MTEuOTk5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggc3R5bGU9ImZpbGw6I0U1MDAyNzsiIGQ9Ik01MDEuNDQ5LDM2OC45MTRMMzIwLjU2Niw2Ni4yMDdDMzA2Ljc1MSw0My4zODQsMjgyLjcyOCwyOS41NjksMjU2LDI5LjU2OSAgcy01MC43NTIsMTMuODE1LTY0LjU2NywzNi42MzhMMTAuNTUsMzY4LjkxNGMtMTMuODEyLDIzLjcyNS0xNC4xMTMsNTEuOTU0LTAuNTk5LDc1LjY3OGMxMy41MTMsMjMuNzIzLDM3LjgzNiwzNy44MzgsNjUuMTY1LDM3LjgzOCAgaDM2MS43NjZjMjcuMzI5LDAsNTEuNjUzLTE0LjExNSw2NS4xNjUtMzcuODM4QzUxNS41NjMsNDIwLjg2OCw1MTUuMjYyLDM5Mi42MzksNTAxLjQ0OSwzNjguOTE0eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojQzEwMDFGOyIgZD0iTTUwMi4wNDksNDQ0LjU5MmMtMTMuNTEzLDIzLjcyMy0zNy44MzYsMzcuODM4LTY1LjE2NSwzNy44MzhIMjU2VjI5LjU3ICBjMjYuNzI3LDAsNTAuNzUyLDEzLjgxNSw2NC41NjcsMzYuNjM4TDUwMS40NSwzNjguOTE1QzUxNS4yNjIsMzkyLjYzOSw1MTUuNTYzLDQyMC44NjgsNTAyLjA0OSw0NDQuNTkyeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRkQwMDNBOyIgZD0iTTc1LjEwOSw0NTIuNGMtMTYuNjI4LDAtMzAuODUxLTguMjctMzkuMDYzLTIyLjY2OWMtOC4yMTEtMTQuNDE0LTguMDY1LTMxLjA4NywwLjQ2OS00NS43MiAgTDIxNy4yMyw4MS41NDljOC4yNy0xMy42NjYsMjIuODE2LTIxLjk1MSwzOC43NjktMjEuOTUxczMwLjUsOC4yODQsMzguODg3LDIyLjE1N2wxODAuNzQ1LDMwMi40OSAgYzguMzg4LDE0LjQsOC41MzQsMzEuMDcyLDAuMzIyLDQ1LjQ4NWMtOC4yMTEsMTQuNC0yMi40MzUsMjIuNjY5LTM5LjA2MywyMi42NjlINzUuMTA5VjQ1Mi40eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRTUwMDI3OyIgZD0iTTQzNi44OTEsNDUyLjRjMTYuNjI4LDAsMzAuODUxLTguMjcsMzkuMDYzLTIyLjY2OWM4LjIxMS0xNC40MTQsOC4wNjUtMzEuMDg3LTAuMzIyLTQ1LjQ4NSAgTDI5NC44ODYsODEuNzU0Yy04LjM4OC0xMy44NzEtMjIuOTMzLTIyLjE1Ny0zOC44ODctMjIuMTU3VjQ1Mi40SDQzNi44OTF6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNFMUU0RkI7IiBkPSJNMjg2LjAzLDE1Mi4wOTV2MTIwLjEyMmMwLDE2LjUxNy0xMy41MTQsMzAuMDMtMzAuMDMsMzAuMDNzLTMwLjAzMS0xMy41MTQtMzAuMDMxLTMwLjAzVjE1Mi4wOTUgIGMwLTE2LjUxNywxMy41MTQtMzAuMDMxLDMwLjAzMS0zMC4wMzFTMjg2LjAzLDEzNS41NzgsMjg2LjAzLDE1Mi4wOTV6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNDNUM5Rjc7IiBkPSJNMjg2LjAzLDE1Mi4wOTV2MTIwLjEyMmMwLDE2LjUxNy0xMy41MTQsMzAuMDMtMzAuMDMsMzAuMDNWMTIyLjA2NCAgQzI3Mi41MTYsMTIyLjA2NCwyODYuMDMsMTM1LjU3OCwyODYuMDMsMTUyLjA5NXoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0UxRTRGQjsiIGQ9Ik0yNTYsMzMyLjI3OGMtMjQuOTI2LDAtNDUuMDQ2LDIwLjExOS00NS4wNDYsNDUuMDQ2YzAsMjQuOTI0LDIwLjExOSw0NS4wNDYsNDUuMDQ2LDQ1LjA0NiAgczQ1LjA0Ni0yMC4xMjEsNDUuMDQ2LTQ1LjA0NkMzMDEuMDQ2LDM1Mi4zOTgsMjgwLjkyNSwzMzIuMjc4LDI1NiwzMzIuMjc4eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojQzVDOUY3OyIgZD0iTTMwMS4wNDYsMzc3LjMyM2MwLDI0LjkyNC0yMC4xMTksNDUuMDQ2LTQ1LjA0Niw0NS4wNDZ2LTkwLjA5MSAgQzI4MC45MjUsMzMyLjI3OCwzMDEuMDQ2LDM1Mi4zOTgsMzAxLjA0NiwzNzcuMzIzeiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K';
    const close = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIuOTggNTEyLjk4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTEyLjk4IDUxMi45OCIgd2lkdGg9IjUxMnB4Ij48cGF0aCBkPSJtNDIxLjA3IDIyMi44Ni0yMy4wNyAxOS4xNy0xMzMuMzMtMTYwLjQyYy0yLjg1LTMuMDgtNi4zLTMuNTYtOC4xNC0zLjU3aC0uMDRjLTEuODMgMC01LjMxLjQ3LTguMTggMy41N2wtMTMzLjMzIDE2MC40Mi0yMy4wNy0xOS4xNyAxMzMuNzEtMTYwLjg5LjE4LS4yYzcuOC04LjcyIDE4Ljk5LTEzLjczIDMwLjY5LTEzLjczaC4wNGMxMS42OS4wMSAyMi44NiA1LjAyIDMwLjY1IDEzLjczbC4zNS40MXoiIGZpbGw9IiM1YzU1NTUiLz48cGF0aCBkPSJtNDIxLjA3IDIyMi44Ni0yMy4wNyAxOS4xNy0xMzMuMzMtMTYwLjQyYy0yLjg1LTMuMDgtNi4zLTMuNTYtOC4xNC0zLjU3di0zMGMxMS42OS4wMSAyMi44NiA1LjAyIDMwLjY1IDEzLjczbC4zNS40MXoiIGZpbGw9IiMzNzMzMzIiLz48cGF0aCBkPSJtNTEyLjk4IDI5My45NHY5NC41YzAgNDIuMTgtMzQuMzIgNzYuNS03Ni41IDc2LjVoLTM1OS45OGMtNDIuMTggMC03Ni41LTM0LjMyLTc2LjUtNzYuNXYtOTQuNWMwLTQyLjE4IDM0LjMyLTc2LjQ5IDc2LjUtNzYuNDloMzU5Ljk4YzQyLjE4IDAgNzYuNSAzNC4zMSA3Ni41IDc2LjQ5eiIgZmlsbD0iI2ZlNGE0YSIvPjxwYXRoIGQ9Im01MTIuOTggMjkzLjk0djk0LjVjMCA0Mi4xOC0zNC4zMiA3Ni41LTc2LjUgNzYuNWgtMTc5Ljk1di0yNDcuNDloMTc5Ljk1YzQyLjE4IDAgNzYuNSAzNC4zMSA3Ni41IDc2LjQ5eiIgZmlsbD0iI2U4MGI2YSIvPjxnIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Im00OC4zNDkgMzQyLjQzN2MwLTUuNjQ0IDEuMDYzLTExLjIwMiAzLjE5MS0xNi42NzMgMi4xMjctNS40NzEgNS4yMy0xMC4zNzUgOS4zMTMtMTQuNzE4IDQuMDgtNC4zNDIgOS4wMy03Ljg1OCAxNC44NDktMTAuNTUxIDUuODE3LTIuNjkgMTIuNDYtNC4wMzggMTkuOTI5LTQuMDM4IDguOTQyIDAgMTYuNjkyIDEuODQ2IDIzLjI1IDUuNTM2IDYuNTU1IDMuNjkxIDExLjQzOSA4LjU3NiAxNC42NTMgMTQuNjUzbC0xOS40MDcgMTMuODA3Yy0uODY5LTIuMjU3LTIuMDItNC4xMjMtMy40NTItNS42MDEtMS40MzMtMS40NzYtMy4wMTktMi42NDgtNC43NTQtMy41MTgtMS43MzgtLjg2Ni0zLjU0LTEuNDc2LTUuNDA1LTEuODIzLTEuODY5LS4zNDYtMy42Ny0uNTIxLTUuNDA2LS41MjEtMy42NDYgMC02Ljc5NS43MTYtOS40NDMgMi4xNDgtMi42NDkgMS40MzMtNC44MTggMy4zMDItNi41MTIgNS42MDItMS42OTMgMi4zMDItMi45NTMgNC45MDYtMy43NzcgNy44MTQtLjgyNiAyLjkxLTEuMjM4IDUuNzk3LTEuMjM4IDguNjYyIDAgMy4yMTQuNDc3IDYuMjk3IDEuNDM0IDkuMjQ4Ljk1NCAyLjk1MyAyLjM0NCA1LjU1OCA0LjE2OCA3LjgxNCAxLjgyMyAyLjI2IDQuMDU5IDQuMDYxIDYuNzA4IDUuNDA2IDIuNjQ3IDEuMzQ3IDUuNjIxIDIuMDE5IDguOTIyIDIuMDE5IDEuNzM2IDAgMy41MTctLjE5NSA1LjM0MS0uNTg2IDEuODIzLS4zOTEgMy41ODItMS4wNDIgNS4yNzUtMS45NTRzMy4yMTEtMi4wODQgNC41NTktMy41MTdjMS4zNDYtMS40MzMgMi40MDktMy4xOTEgMy4xOTEtNS4yNzVsMjAuNzA5IDEyLjM3NGMtMS4zOSAzLjM4Ny0zLjQ5NiA2LjQyNy02LjMxNiA5LjExNy0yLjgyMyAyLjY5My02LjAzNyA0Ljk1LTkuNjM5IDYuNzczLTMuNjA0IDEuODIzLTcuNDY5IDMuMjE0LTExLjU5MyA0LjE2OC00LjEyNS45NTUtOC4xNDEgMS40MzMtMTIuMDQ4IDEuNDMzLTYuODYxIDAtMTMuMTM1LTEuMzY3LTE4LjgyMi00LjEwM3MtMTAuNTk1LTYuMzYtMTQuNzE4LTEwLjg3NmMtNC4xMjYtNC41MTUtNy4zMTYtOS42MzktOS41NzMtMTUuMzctMi4yNjItNS43MjctMy4zODktMTEuNTQ0LTMuMzg5LTE3LjQ1eiIvPjxwYXRoIGQ9Im0xNDMuNDMyIDM4OS40NTh2LTkyLjQ3OWgyNS4zOTl2NzAuMzM2aDQxLjk0MXYyMi4xNDN6Ii8+PHBhdGggZD0ibTMwMy45NyAzMjYuMjljLTIuMjItNS42NS01LjM2LTEwLjY4LTkuNDQtMTUuMTEtNC4wOS00LjQzLTguOTktNy45OS0xNC43Mi0xMC42OHMtMTIuMTItNC4wNC0xOS4xNS00LjA0Yy0xLjQgMC0yLjc4LjA1LTQuMTMuMTYtNS4yOS40Mi0xMC4yMyAxLjY0LTE0LjgyIDMuNjgtNS43OCAyLjU2LTEwLjc3IDUuOTktMTQuOTggMTAuMjlzLTcuNDkgOS4yNy05LjgzIDE0LjkxYy0yLjM1IDUuNjUtMy41MiAxMS41MS0zLjUyIDE3LjU5IDAgNS45OSAxLjEzIDExLjgxIDMuMzkgMTcuNDUgMi4yNSA1LjY1IDUuNDIgMTAuNjYgOS41IDE1LjA1IDQuMDggNC4zOCA4Ljk5IDcuOTIgMTQuNzIgMTAuNjEgNC43MyAyLjIyIDkuOTIgMy41MyAxNS41NCAzLjkyIDEuMTguMDggMi4zOS4xMiAzLjYxLjEyIDYuODYgMCAxMy4xNy0xLjMgMTguOTUtMy45MSA1Ljc4LTIuNiAxMC43NS02LjA1IDE0LjkxLTEwLjM1IDQuMTctNC4zIDcuNDMtOS4yNSA5Ljc3LTE0Ljg1IDIuMzUtNS42IDMuNTItMTEuNDQgMy41Mi0xNy41MiAwLTUuOTEtMS4xMS0xMS42OC0zLjMyLTE3LjMyem0tMjMuNzEgMjUuNzljLS44MiAyLjk1LTIuMDggNS41OC0zLjc3IDcuODgtMS43IDIuMy0zLjg5IDQuMTYtNi41OCA1LjYtMi43IDEuNDMtNS44NiAyLjE1LTkuNTEgMi4xNS0xLjM2IDAtMi42NS0uMS0zLjg3LS4yOS0yLjA2LS4zMy0zLjkxLS45My01LjU3LTEuOC0yLjY1LTEuMzktNC44NS0zLjIxLTYuNTgtNS40Ny0xLjc0LTIuMjYtMy4wNC00Ljg0LTMuOTEtNy43NXMtMS4zLTUuOTMtMS4zLTkuMDVjMC0zLjA0LjQxLTYuMDEgMS4yNC04LjkyLjgyLTIuOTEgMi4xLTUuNTIgMy44NC03LjgyIDEuNzMtMi4zIDMuOTMtNC4xNCA2LjU4LTUuNTMgMS42OS0uODkgMy41OS0xLjUgNS43LTEuODIgMS4xOC0uMTggMi40My0uMjcgMy43NC0uMjcgMy41NiAwIDYuNjYuNjcgOS4zMSAyLjAyczQuODcgMy4xMyA2LjY0IDUuMzRjMS43OCAyLjIyIDMuMTEgNC43OCAzLjk4IDcuNjkuODYgMi45MSAxLjMgNS45MiAxLjMgOS4wNSAwIDMuMDQtLjQxIDYuMDMtMS4yNCA4Ljk5eiIvPjwvZz48cGF0aCBkPSJtMzczLjMyOCAzMjcuMTk3Yy0yLjYwNS0xLjU2My01LjI5Ny0yLjk1LTguMDc2LTQuMTY4LTIuMzQ0LTEuMDQyLTQuOTcxLTIuMDE5LTcuODc5LTIuOTMxLTIuOTEtLjkxMS01Ljc1NC0xLjM2Ny04LjUzMS0xLjM2Ny0yLjI2IDAtNC4wNjEuMzQ4LTUuNDA2IDEuMDQyLTEuMzQ4LjY5Ni0yLjAyIDEuODY4LTIuMDIgMy41MTcgMCAxLjIxNy4zOTEgMi4yMTQgMS4xNzIgMi45OTYuNzgzLjc4MSAxLjkxIDEuNDk4IDMuMzg3IDIuMTQ4IDEuNDc3LjY1MSAzLjI3NyAxLjI4MiA1LjQwNiAxLjg4OSAyLjEyNy42MDkgNC41MzcgMS4zNDggNy4yMjkgMi4yMTUgNC4yNTQgMS4zMDMgOC4wOTYgMi43MzUgMTEuNTI3IDQuMjk4IDMuNDMgMS41NjMgNi4zNTkgMy40MDkgOC43OTMgNS41MzYgMi40MyAyLjEyOSA0LjI5NyA0LjcxMSA1LjYgNy43NSAxLjMwMyAzLjA0IDEuOTU1IDYuNzMgMS45NTUgMTEuMDcxIDAgNS41NTgtMS4wMjEgMTAuMjI1LTMuMDYzIDE0LjAwMnMtNC43MzIgNi43OTYtOC4wNzQgOS4wNTNjLTMuMzQ0IDIuMjU5LTcuMTIxIDMuODg3LTExLjMzMiA0Ljg4NS00LjIxMy45OTctOC40NDcgMS40OTctMTIuNjk5IDEuNDk3LTMuMzg3IDAtNi44NjEtLjI2LTEwLjQyMi0uNzgxcy03LjA5OC0xLjI1OC0xMC42MTUtMi4yMTRjLTMuNTE2LS45NTUtNi45MDItMi4wODQtMTAuMTU4LTMuMzg3LTMuMjU4LTEuMzAzLTYuMjc1LTIuNzc4LTkuMDUzLTQuNDI5bDEwLjk0MS0yMi4yNzNjMy4wMzcgMS45MTEgNi4yMDcgMy42MDQgOS41MDggNS4wOCAyLjc3NyAxLjMwMyA1LjkyNiAyLjQ3NSA5LjQ0MyAzLjUxNyAzLjUxNiAxLjA0MiA3LjA5OCAxLjU2MyAxMC43NDYgMS41NjMgMi43NzcgMCA0LjcwOS0uMzY4IDUuNzk1LTEuMTA3IDEuMDg2LS43MzYgMS42MjktMS43MTQgMS42MjktMi45MzEgMC0xLjMwMy0uNTQzLTIuNDA5LTEuNjI5LTMuMzIxcy0yLjU4NC0xLjcxNC00LjQ5Mi0yLjQwOWMtMS45MTItLjY5NC00LjEwNC0xLjM4OS02LjU3OC0yLjA4NC0yLjQ3NS0uNjk0LTUuMTA0LTEuNTE5LTcuODgxLTIuNDc2LTQuMDgyLTEuMzg4LTcuNi0yLjg4Ni0xMC41NTEtNC40OTMtMi45NTMtMS42MDYtNS4zODUtMy40My03LjI5My01LjQ3MS0xLjkxMi0yLjAzOS0zLjMyMi00LjM2My00LjIzNC02Ljk2OS0uOTEyLTIuNjA0LTEuMzY3LTUuNjAxLTEuMzY3LTguOTg3IDAtNS4xMjIuOTMyLTkuNjM5IDIuODAxLTEzLjU0NiAxLjg2NS0zLjkwOCA0LjQwNi03LjE2NCA3LjYxOS05Ljc3IDMuMjExLTIuNjA0IDYuODgxLTQuNTc5IDExLjAwNi01LjkyNiA0LjEyNS0xLjM0NiA4LjQ4OC0yLjAyIDEzLjA5Mi0yLjAyIDMuMzg3IDAgNi42ODYuMzI2IDkuODk4Ljk3OCAzLjIxMS42NTEgNi4zMTYgMS40NzggOS4zMTMgMi40NzUgMi45OTYuOTk5IDUuNzk3IDIuMDg0IDguNDAyIDMuMjU2IDIuNjA0IDEuMTczIDQuOTQ5IDIuMjggNy4wMzMgMy4zMjJ6IiBmaWxsPSIjZWFlMmUwIi8+PHBhdGggZD0ibTQ2My41OTIgMzY3LjMxNXYyMi4xNDNoLTY1LjkwOHYtOTIuNDc5aDY0LjczNnYyMi4xNDNoLTM5LjMzNnYxMy4wMjVoMzMuNjA0djIwLjU3OWgtMzMuNjA0djE0LjU4OXoiIGZpbGw9IiNlYWUyZTAiLz48cGF0aCBkPSJtMzA3LjI5IDM0My42MWMwIDYuMDgtMS4xNyAxMS45Mi0zLjUyIDE3LjUyLTIuMzQgNS42LTUuNiAxMC41NS05Ljc3IDE0Ljg1LTQuMTYgNC4zLTkuMTMgNy43NS0xNC45MSAxMC4zNS01Ljc4IDIuNjEtMTIuMDkgMy45MS0xOC45NSAzLjkxLTEuMjIgMC0yLjQzLS4wNC0zLjYxLS4xMnYtMjIuN2MxLjIyLjE5IDIuNTEuMjkgMy44Ny4yOSAzLjY1IDAgNi44MS0uNzIgOS41MS0yLjE1IDIuNjktMS40NCA0Ljg4LTMuMyA2LjU4LTUuNiAxLjY5LTIuMyAyLjk1LTQuOTMgMy43Ny03Ljg4LjgzLTIuOTYgMS4yNC01Ljk1IDEuMjQtOC45OSAwLTMuMTMtLjQ0LTYuMTQtMS4zLTkuMDUtLjg3LTIuOTEtMi4yLTUuNDctMy45OC03LjY5LTEuNzctMi4yMS0zLjk5LTMuOTktNi42NC01LjM0cy01Ljc1LTIuMDItOS4zMS0yLjAyYy0xLjMxIDAtMi41Ni4wOS0zLjc0LjI3di0yMi42NGMxLjM1LS4xMSAyLjczLS4xNiA0LjEzLS4xNiA3LjAzIDAgMTMuNDIgMS4zNSAxOS4xNSA0LjA0czEwLjYzIDYuMjUgMTQuNzIgMTAuNjhjNC4wOCA0LjQzIDcuMjIgOS40NiA5LjQ0IDE1LjExIDIuMjEgNS42NCAzLjMyIDExLjQxIDMuMzIgMTcuMzJ6IiBmaWxsPSIjZWFlMmUwIi8+PC9zdmc+Cg=='

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









