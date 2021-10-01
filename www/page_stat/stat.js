$(document).ready(async function () {

    await liff.init({ liffId: "1653987548-K3B2gV1Z" })
    loadInfectedMap();

    // getChart();
    // getCov()

    getInfect();
    stat();
});

let map = L.map('map', {
    center: [13.802664, 100.890034],
    zoom: 5,
    scrollWheelZoom: false
});


const url = 'https://rti2dss.com:3200';
// const url = 'http://localhost:3200';

let data;
var info = L.control();
async function loadInfectedMap() {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    await $.get('https://rti2dss.com/saveme/api/prov.geojson').done(async (res) => {
        // console.log(res)
        let js = JSON.parse(res)
        let fs = await js.features;
        let features = [];
        await $.get(url+'/anticov-api/today-cases-by-provinces').done(r => {
            fs.map(f => {
                r.data.map(i => {
                    f.properties.pro_name == i.province ? f.properties.count = i.new_case : null
                })
                features.push(f);
            })
        })

        // features.map(i => {
        //     i.properties.count ? null : console.log(i.properties.PV_EN);
        // })

        let json = {
            type: "FeatureCollection",
            name: "prov",
            features: features
        }

        // console.log(json);

        let arr = []
        await json.features.forEach((e) => {
            arr.push({ name: e.properties.pro_name, count: e.properties.count })
        });

        await arr.sort(function (a, b) { return b.count - a.count; });

        let dat = [];
        let cat = [];
        arr.forEach(e => {
            dat.push(e.count);
            cat.push(e.name)
        })

        getChart(dat, cat, '#chartByProv', true, 'Number of case', 'Province', 800);

        geojson = L.geoJson(json, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

    })
}

function getColor(d) {
    return d > 20000 ? '#990000' :
        d > 10000 ? '#cc0000' :
            d > 5000 ? '#ff0000' :
                d > 1000 ? '#ff3333' :
                    d > 500 ? '#ff6666' :
                        d > 100 ? '#ff9999' :
                            d > 0 ? '#ffcccc' :
                                'none';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        stroke: "#555555",
        fillOpacity: 0.8,
        fillColor: getColor(feature.properties.count)
    };
}

var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function (infectedMap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 500, 1000, 2000, 5000, 10000, 20000],
        labels = ['Number of case : case'],
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

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Number of case </h4>' + (props ?
        '<b>' + props.pro_name + '</b><br />' + props.count + ' '
        : '');

};

info.addTo(map);

async function stat() {
    await $.get(url+'/anticov-api/today-cases-all').done(res => {
        // console.log(res)
        $('#paccum').text(res.data[0].total_case);
        $('#pnew').text(res.data[0].new_case);
        $('#death').text(res.data[0].total_death);
        $('#update').text(res.data[0].update_date)
    })
}

async function getInfect() {
    let arr = [];
    await $.get(url+'/anticov-api/timeline-cases-all').done(async (res) => {
        // console.log(res.Data)
        let data = await res.data;
        let date = await data.map(obj => { return obj.txn_date; });
        let NewConfirmed = await data.map(obj => { return obj.new_case; });
        // let NewRecovered = await data.map(obj => { return obj.NewRecovered; });
        // let NewHospitalized = await data.map(obj => { return obj.NewHospitalized; });
        // let NewDeaths = data.map(obj => { return obj.NewDeaths; });
        let Confirmed = data.map(obj => { return obj.total_case; });
        // let Recovered = data.map(obj => { return obj.Recovered; });
        // let Hospitalized = data.map(obj => { return obj.Hospitalized; });
        // let Deaths = data.map(obj => { return obj.Deaths; });

        getToday(NewConfirmed, Confirmed, date)
        $("#update").text(arr.pop());
    })

    await $.get(url+'/anticov-api/round-3-line-lists').done(async (res) => {
        let data = await res.data.data;
        let week = data.map(obj => { return moment(obj.txn_date).isoWeek() })
        let age = data.map(obj => {
            // console.log(obj);
            if (obj.age_number < 10) {
                return 10;
            } else if (obj.age_number < 20) {
                return 20;
            } else if (obj.age_number < 30) {
                return 30;
            } else if (obj.age_number < 40) {
                return 40;
            } else if (obj.age_number < 50) {
                return 50;
            } else if (obj.age_number < 60) {
                return 60;
            } else {
                return 99;
            }
        });

        let b1 = [];
        let b2 = [];
        let b3 = [];
        let b4 = [];
        let b5 = [];
        let b6 = [];
        let b9 = [];
        let wk = []
        for (let index = 1; index <= moment(Date.now()).isoWeek(); index++) {
            let a1 = 0; let a2 = 0; let a3 = 0; let a4 = 0; let a5 = 0; let a6 = 0; let a9 = 0;
            week.forEach((w, i) => {
                if (w == index) {
                    age[i] == 10 ? a1 += 1 : null;
                    age[i] == 20 ? a2 += 1 : null;
                    age[i] == 30 ? a3 += 1 : null;
                    age[i] == 40 ? a4 += 1 : null;
                    age[i] == 50 ? a5 += 1 : null;
                    age[i] == 60 ? a6 += 1 : null;
                    age[i] == 99 ? a9 += 1 : null;
                }
            })
            await b1.push(a1);
            await b2.push(a2);
            await b3.push(a3);
            await b4.push(a4);
            await b5.push(a5);
            await b6.push(a6);
            await b9.push(a9);
            await wk.push('w' + index);
        }
        getCase(b1, b2, b3, b4, b5, b6, b9, wk)
    })
}

function getToday(a, b, date) {

    var options = {
        series: [
            {
                name: "New cases",
                data: a
            },
            {
                name: "Accummulated cases",
                data: b
            }
        ],
        chart: {
            height: 350,
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#da9649', '#b22924'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [2, 2],
            curve: 'smooth'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: date,
        },
        yaxis: {
            title: {
                text: 'Number of case'
            }
        },
    };

    var chart = new ApexCharts(document.querySelector("#chartToday"), options);
    chart.render();
}

async function getChart(dat, cat, id, layout, xLabel, yLabel, height) {
    var options = {
        series: [{
            data: dat
        }],
        chart: {
            type: 'bar',
            height: height,
            colors: 'red'
        },
        plotOptions: {
            bar: {
                horizontal: layout,
            }
        },
        dataLabels: {
            enabled: false
        },
        yaxis: {
            title: {
                text: yLabel,
            },
        },
        xaxis: {
            categories: cat,
            title: {
                text: xLabel,
            },
        },
        fill: {
            colors: ['#cc0000']
        }
    };
    var chart = new ApexCharts(document.querySelector(id), options);
    chart.render();
}

async function getCase(b1, b2, b3, b4, b5, b6, b9, w) {
    var options = {
        series: [{
            name: '0-10 years',
            data: b1,
        }, {
            name: '10-20 years',
            data: b2
        }, {
            name: '20-30 years',
            data: b3
        }, {
            name: '30-40 years',
            data: b4
        }, {
            name: '40-50 years',
            data: b5
        }, {
            name: '50-60 years',
            data: b6
        }, {
            name: '>60 years',
            data: b9
        }],
        chart: {
            height: 350,
            type: 'heatmap',
        },
        xaxis: {
            type: 'category',
            categories: w
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#fb0012"],
    };

    var chart = new ApexCharts(document.querySelector("#chartCase"), options);
    chart.render();
}

