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
    zoom: 5
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
        // await $.get(url + '/anticov-api/covid-accum').done(r => {
        await $.get('https://covid19.th-stat.com/api/open/cases/sum').done(r => {
            const cs = r.Province;
            fs.forEach((f) => {
                // console.log(f.properties.PV_EN)
                f.properties.PV_EN == 'Amnat Charoen' ? f.properties.count = cs['Amnat Charoen'] : null;
                f.properties.PV_EN == 'Ang Thong' ? f.properties.count = cs['Ang Thong'] : null;
                f.properties.PV_EN == 'Bangkok' ? f.properties.count = cs['Bangkok'] : null;
                f.properties.PV_EN == 'Bueng Kan' ? f.properties.count = cs['Bueng Kan'] : null;
                f.properties.PV_EN == 'Buri Ram' ? f.properties.count = cs['Buriram'] : null;
                f.properties.PV_EN == 'Chachoengsao' ? f.properties.count = cs['Chachoengsao'] : null;
                f.properties.PV_EN == 'Chai Nat' ? f.properties.count = cs['Chai Nat'] : null;
                f.properties.PV_EN == 'Chaiyaphum' ? f.properties.count = cs['Chaiyaphum'] : null;
                f.properties.PV_EN == 'Chanthaburi' ? f.properties.count = cs['Chanthaburi'] : null;
                f.properties.PV_EN == 'Chiang Mai' ? f.properties.count = cs['Chiang Mai'] : null;
                f.properties.PV_EN == 'Chiang Rai' ? f.properties.count = cs['Chiang Rai'] : null;
                f.properties.PV_EN == 'Chon Buri' ? f.properties.count = cs['Chonburi'] : null;
                f.properties.PV_EN == 'Chumphon' ? f.properties.count = cs['Chumphon'] : null;
                f.properties.PV_EN == 'Kalasin' ? f.properties.count = cs['Kalasin'] : null;
                f.properties.PV_EN == 'Kamphaeng Phet' ? f.properties.count = cs['Kamphaeng Phet'] : null;
                f.properties.PV_EN == 'Kanchanaburi' ? f.properties.count = cs['Kanchanaburi'] : null;
                f.properties.PV_EN == 'Khon Kaen' ? f.properties.count = cs['Khon Kaen'] : null;
                f.properties.PV_EN == 'Krabi' ? f.properties.count = cs['Krabi'] : null;
                f.properties.PV_EN == 'Lampang' ? f.properties.count = cs['Lampang'] : null;
                f.properties.PV_EN == 'Lamphun' ? f.properties.count = cs['Lamphun'] : null;
                f.properties.PV_EN == 'Loei' ? f.properties.count = cs['Loei'] : null;
                f.properties.PV_EN == 'Lop Buri' ? f.properties.count = cs['Lopburi'] : null;
                f.properties.PV_EN == 'Mae Hong Son' ? f.properties.count = cs['Mae Hong Son'] : null;
                f.properties.PV_EN == 'Maha Sarakham' ? f.properties.count = cs['Maha Sarakham'] : null;
                f.properties.PV_EN == 'Mukdahan' ? f.properties.count = cs['Mukdahan'] : null;
                f.properties.PV_EN == 'Nakhon Nayok' ? f.properties.count = cs['Nakhon Nayok'] : null;
                f.properties.PV_EN == 'Nakhon Pathom' ? f.properties.count = cs['Nakhon Pathom'] : null;
                f.properties.PV_EN == 'Nakhon Phanom' ? f.properties.count = cs['Nakhon Phanom'] : null;
                f.properties.PV_EN == 'Nakhon Ratchasima' ? f.properties.count = cs['Nakhon Ratchasima'] : null;
                f.properties.PV_EN == 'Nakhon Sawan' ? f.properties.count = cs['Nakhon Sawan'] : null;
                f.properties.PV_EN == 'Nakhon Si Thammarat' ? f.properties.count = cs['Nakhon Si Thammarat'] : null;
                f.properties.PV_EN == 'Nan' ? f.properties.count = cs['Nan'] : null;
                f.properties.PV_EN == 'Narathiwat' ? f.properties.count = cs['Narathiwat'] : null;
                f.properties.PV_EN == 'Nong Bua Lam Phu' ? f.properties.count = cs['Nong Bua Lamphu'] : null;
                f.properties.PV_EN == 'Nong Khai' ? f.properties.count = cs['Nong Khai'] : null;
                f.properties.PV_EN == 'Nonthaburi' ? f.properties.count = cs['Nonthaburi'] : null;
                f.properties.PV_EN == 'Pathum Thani' ? f.properties.count = cs['Pathum Thani'] : null;
                f.properties.PV_EN == 'Pattani' ? f.properties.count = cs['Pattani'] : null;
                f.properties.PV_EN == 'Phang-nga' ? f.properties.count = cs['Phang-nga'] : null;
                f.properties.PV_EN == 'Phatthalung' ? f.properties.count = cs['Phatthalung'] : null;
                f.properties.PV_EN == 'Phayao' ? f.properties.count = cs['Phayao'] : null;
                f.properties.PV_EN == 'Phetchabun' ? f.properties.count = cs['Phetchabun'] : null;
                f.properties.PV_EN == 'Phetchaburi' ? f.properties.count = cs['Phetchaburi'] : null;
                f.properties.PV_EN == 'Phichit' ? f.properties.count = cs['Phichit'] : null;
                f.properties.PV_EN == 'Phitsanulok' ? f.properties.count = cs['Phitsanulok'] : null;
                f.properties.PV_EN == 'Phra Nakhon Si Ayutthaya' ? f.properties.count = cs['Phra Nakhon Si Ayutthaya'] : null;
                f.properties.PV_EN == 'Phrae' ? f.properties.count = cs['Phrae'] : null;
                f.properties.PV_EN == 'Phuket' ? f.properties.count = cs['Phuket'] : null;
                f.properties.PV_EN == 'Prachin Buri' ? f.properties.count = cs['Prachinburi'] : null;
                f.properties.PV_EN == 'Prachuap Khiri Khan' ? f.properties.count = cs['Prachuap Khiri Khan'] : null;
                f.properties.PV_EN == 'Ranong' ? f.properties.count = cs['Ranong'] : null;
                f.properties.PV_EN == 'Ratchaburi' ? f.properties.count = cs['Ratchaburi'] : null;
                f.properties.PV_EN == 'Rayong' ? f.properties.count = cs['Rayong'] : null;
                f.properties.PV_EN == 'Roi Et' ? f.properties.count = cs['Roi Et'] : null;
                f.properties.PV_EN == 'Sa kaeo' ? f.properties.count = cs['Sa Kaeo'] : null;
                f.properties.PV_EN == 'Sakon Nakhon' ? f.properties.count = cs['Sakon Nakhon'] : null;
                f.properties.PV_EN == 'Samut Prakarn' ? f.properties.count = cs['Samut Prakan'] : null;
                f.properties.PV_EN == 'Samut Sakhon' ? f.properties.count = cs['Samut Sakhon'] : null;
                f.properties.PV_EN == 'Samut Songkhram' ? f.properties.count = cs['Samut Songkhram'] : null;
                f.properties.PV_EN == 'Saraburi' ? f.properties.count = cs['Saraburi'] : null;
                f.properties.PV_EN == 'Satun' ? f.properties.count = cs['Satun'] : null;
                f.properties.PV_EN == 'Si Sa Ket' ? f.properties.count = cs['Sisaket'] : null;
                f.properties.PV_EN == 'Sing Buri' ? f.properties.count = cs['Sing Buri'] : null;
                f.properties.PV_EN == 'Songkhla' ? f.properties.count = cs['Songkhla'] : null;
                f.properties.PV_EN == 'Sukhothai' ? f.properties.count = cs['Sukhothai'] : null;
                f.properties.PV_EN == 'Suphan Buri' ? f.properties.count = cs['Suphan Buri'] : null;
                f.properties.PV_EN == 'Surat Thani' ? f.properties.count = cs['Surat Thani'] : null;
                f.properties.PV_EN == 'Surin' ? f.properties.count = cs['Surin'] : null;
                f.properties.PV_EN == 'Tak' ? f.properties.count = cs['Tak'] : null;
                f.properties.PV_EN == 'Trang' ? f.properties.count = cs['Trang'] : null;
                f.properties.PV_EN == 'Trat' ? f.properties.count = cs['Trat'] : null;
                f.properties.PV_EN == 'Ubon Ratchathani' ? f.properties.count = cs['Ubon Ratchathani'] : null;
                f.properties.PV_EN == 'Udon Thani' ? f.properties.count = cs['Udon Thani'] : null;
                f.properties.PV_EN == 'Uthai Thani' ? f.properties.count = cs['Uthai Thani'] : null;
                f.properties.PV_EN == 'Uttaradit' ? f.properties.count = cs['Uttaradit'] : null;
                f.properties.PV_EN == 'Yala' ? f.properties.count = cs['Yala'] : null;
                f.properties.PV_EN == 'Yasothon' ? f.properties.count = cs['Yasothon'] : null;

                f.properties.count == null ? f.properties.count = 0 : null;
                features.push(f);
            })
        })

        let json = {
            type: "FeatureCollection",
            name: "prov",
            features: features
        }

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

        getChart(dat, cat, '#chartByProv', true, 'จำนวน (ราย)', 'จังหวัด', 800);

        geojson = L.geoJson(json, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

    })
}

function getColor(d) {
    return d > 200 ? '#990000' :
        d > 100 ? '#cc0000' :
            d > 50 ? '#ff0000' :
                d > 10 ? '#ff3333' :
                    d > 5 ? '#ff6666' :
                        d > 1 ? '#ff9999' :
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
    this._div.innerHTML = '<h4>จำนวนผู้ป่วย COVID-19</h4>' + (props ?
        '<b>' + props.pro_name + '</b><br />' + props.count + ' ราย'
        : '');

};

info.addTo(map);

async function stat() {
    await $.get('https://covid19.th-stat.com/api/open/today').done(res => {
        // console.log(res)
        $('#paccum').text(res.Confirmed);
        $('#pnew').text(res.NewConfirmed);
        $('#death').text(res.Deaths);
        $('#update').text(res.UpdateDate)
    })
}

async function getInfect() {
    let arr = [];
    await $.get('https://covid19.th-stat.com/api/open/timeline').done(async (res) => {
        // console.log(res.Data)
        let data = await res.Data;
        let date = await data.map(obj => { return obj.Date; });
        let NewConfirmed = await data.map(obj => { return obj.NewConfirmed; });
        let NewRecovered = await data.map(obj => { return obj.NewRecovered; });
        let NewHospitalized = await data.map(obj => { return obj.NewHospitalized; });
        let NewDeaths = data.map(obj => { return obj.NewDeaths; });
        let Confirmed = data.map(obj => { return obj.Confirmed; });
        let Recovered = data.map(obj => { return obj.Recovered; });
        let Hospitalized = data.map(obj => { return obj.Hospitalized; });
        let Deaths = data.map(obj => { return obj.Deaths; });

        getToday(NewConfirmed, Confirmed, date)
        $("#update").text(arr.pop());
    })

    await $.get('https://covid19.th-stat.com/api/open/cases').done(async (res) => {
        let data = await res.Data;
        let week = data.map(obj => { return moment(obj.ConfirmDate).isoWeek() })
        let age = data.map(obj => {
            if (obj.Age < 10) {
                return 10;
            } else if (obj.Age < 20) {
                return 20;
            } else if (obj.Age < 30) {
                return 30;
            } else if (obj.Age < 40) {
                return 40;
            } else if (obj.Age < 50) {
                return 50;
            } else if (obj.Age < 60) {
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
                name: "ผู้ป่วยใหม่",
                data: a
            },
            {
                name: "ผู้ป่วยสะสม",
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
                text: 'จำนวนผู้ป่วย (ราย)'
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
            name: 'อายุ 0-10ปี',
            data: b1
        }, {
            name: 'อายุ 10-20ปี',
            data: b2
        }, {
            name: 'อายุ 20-30ปี',
            data: b3
        }, {
            name: 'อายุ 30-40ปี',
            data: b4
        }, {
            name: 'อายุ 40-50ปี',
            data: b5
        }, {
            name: 'อายุ 50-60ปี',
            data: b6
        }, {
            name: 'อายุ >60ปี',
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

