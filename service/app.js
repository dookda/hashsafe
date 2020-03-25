const express = require('express');
const request = require('request');
const app = express.Router();
const multer = require('multer');

const con = require('./db');
const th = con.th;
const cv = con.cv;
const cvm = con.cvm;

app.post('/webhook', (req, res) => {
    var text = req.body.events[0].message.text
    var sender = req.body.events[0].source.userId
    var replyToken = req.body.events[0].replyToken
    console.log(text, sender, replyToken)
    console.log(typeof sender, typeof text)
    // console.log(req.body.events[0])

})


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './../www/upload');
    },
    filename: function (req, file, callback) {
        callback(null, 'infected_prov.js');
    }
});

var upload = multer({ storage: storage });

app.post('/anticov-api/upload', upload.single('imagename'), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'insert data'
    });
});

app.get('/acc-api/getaddress/:lat/:lon', (req, res) => {
    const lat = req.params.lat;
    const lon = req.params.lon;
    const buff = 10;
    const sql = `SELECT tam_name, amp_name, pro_name FROM tambon_4326 
    WHERE ST_DWithin(ST_Transform(geom,3857), 
    ST_Transform(ST_GeomFromText('POINT(${lon} ${lat})',4326), 3857), ${buff}) = 'true'`;
    th.query(sql)
        .then((data) => {
            res.status(200).json({
                status: 'success',
                message: 'get disease',
                data: data.rows
            });
        })
});

app.post('/anticov-api/insert', (req, res) => {
    const { userid, ocupation, birthdate, sex, healthy, place, geom } = req.body;
    const rand1 = Math.random().toString(36).substr(2);
    const rand2 = Date.now();
    const pkid = rand1 + rand2;
    const sql = 'INSERT INTO geomember (userid,ocupation,birthdate,sex,healthy,place,pkid, geom) ' +
        'VALUES ($1,$2,$3,$4,$5,$6,$7,ST_SetSRID(st_geomfromgeojson($8), 4326))';
    const val = [userid, ocupation, birthdate, sex, healthy, place, pkid, geom];
    console.log(val)
    cv.query(sql, val)
        .then(() => {
            res.status(200).json({
                status: 'insert success',
            });
        })
});

app.post('/anticov-api/update', (req, res) => {
    const { userid, ocupation, birthdate, sex, healthy, place, geom } = req.body;
    const sql = 'UPDATE geomember SET ocupation=$2,birthdate=$3,sex=$4,healthy=$5,place=$6,geom=ST_SetSRID(st_geomfromgeojson($7), 4326) ' +
        'WHERE userid=$1';
    const val = [userid, ocupation, birthdate, sex, healthy, place, geom];
    cv.query(sql, val)
        .then(() => {
            res.status(200).json({
                status: 'update success',
            });
        })
});

app.post('/anticov-api/saveloc', (req, res) => {
    const { userid, healthy, geom } = req.body;
    const sql = 'INSERT INTO saveloc (userid, inputdate, healthy, geom) ' +
        'VALUES ($1, now(), $2, ST_SetSRID(st_geomfromgeojson($3), 4326))';
    const val = [userid, healthy, geom];
    console.log(val)
    cv.query(sql, val)
        .then(() => {
            res.status(200).json({
                status: 'insert success',
            });
        })
});

app.get('/anticov-api/getweloc/:hr', (req, res) => {
    const hr = req.params.hr;
    const sql = `SELECT gid, st_x(geom) as lng, st_y(geom) as lat FROM saveloc  
    WHERE inputdate >= (now() - interval '${hr} hours')`;
    // const val = [hr];
    cv.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get disease',
            data: data.rows
        });
    })
});

app.get('/anticov-api/getweloc/:hr/:w', (req, res) => {
    const hr = req.params.hr;
    const w = req.params.w;
    let sql;

    sql = `SELECT gid, st_x(geom) as lng, st_y(geom) as lat FROM saveloc  
        WHERE inputdate >= (now() - interval '${hr} hours') AND healthy = ${w}`;


    // const val = [hr];
    cv.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get disease',
            data: data.rows
        });
    })
});

app.post('/anticov-api/getmyloc', (req, res) => {
    const { userid, hr } = req.body;
    const sql = `SELECT gid, st_x(geom) as lng, st_y(geom) as lat FROM saveloc  
    WHERE inputdate >= (now() - interval '${hr} hours') and userid = '${userid}'`;
    cv.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get disease',
            data: data.rows
        });
    })
});

app.post('/anticov-api/getaccount', (req, res) => {
    const { userid } = req.body;
    const sql = `SELECT ocupation, to_char( birthdate, 'YYYY-mm-DD') as birthdate, sex, healthy  FROM geomember WHERE userid = $1`;
    const val = [userid];
    cv.query(sql, val).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get account',
            data: data.rows
        })
    })
})

app.get('/anticov-api/memberloc', (req, res) => {
    const sql = `SELECT pkid, st_y(geom) as lat, st_x(geom) as lng FROM geomember`;
    cv.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get member',
            data: data.rows
        })
    })
})

app.get('/anticov-api/notify', (req, res, next) => {
    var token = 'RAr7M3ZCUj3D8IArwuo6Czfd7KiEHZruGmU7QpoXIsG';
    var message = 'test line notify';
    request({
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            'bearer': token
        },
        form: {
            message: message
        }
    }, (err, httpResponse, body) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                httpResponse: httpResponse,
                body: body
            });
        }
    });
});


app.post('/anticov-api/notify2', (req, res) => {
    let reply_token = req.body.events[0].replyToken
    let msg = req.body.events[0].message.text
    console.log(reply_token)
    res.sendStatus(200)
})

app.get('/anticov-api/labcovid', (req, res) => {
    const sql = `SELECT * FROM labcovid`;
    cvm.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get member',
            data: data.rows
        })
    })
})

app.post('/anticov-api/savestore', (req, res) => {
    const { userid, storeName, storeId, facebook, lineid, tel, maskVol, maskLowprice, maskHighprice, gelVol, gelLowprice, gelHighprice, geom } = req.body;
    const sql = 'INSERT INTO drugstore (userid, storename, storeid, facebook, lineid, tel, maskvol, masklowprice, maskhighprice, gelvol, gellowprice, gelhighprice, date_update, geom)' +
        'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now(), ST_SetSRID(st_geomfromgeojson($13), 4326))';
    const val = [userid, storeName, storeId, facebook, lineid, tel, maskVol, maskLowprice, maskHighprice, gelVol, gelLowprice, gelHighprice, geom];
    // console.log(val)
    cvm.query(sql, val)
        .then(() => {
            res.status(200).json({
                status: 'insert success',
            });
        })
});

app.post('/anticov-api/updatestore', (req, res) => {
    const { userid, storeName, storeId, facebook, lineid, tel, maskVol, maskLowprice, maskHighprice, gelVol, gelLowprice, gelHighprice, geom } = req.body;
    const sql = 'UPDATE drugstore SET storename=$2,storeid=$3,facebook=$4,lineid=$5,tel=$6,maskvol=$7,masklowprice=$8,maskhighprice=$9,gelvol=$10,gellowprice=$11,gelhighprice=$12,date_update=now() ' +
        'WHERE userid=$1';
    const val = [userid, storeName, storeId, facebook, lineid, tel, maskVol, maskLowprice, maskHighprice, gelVol, gelLowprice, gelHighprice];
    cvm.query(sql, val)
        .then(() => {
            res.status(200).json({
                status: 'insert success',
            });
        })
});

app.post('/anticov-api/getstore', (req, res) => {
    const { userid } = req.body;
    const sql = `SELECT *, ST_X(geom) as lng, ST_X(geom) as lat  FROM drugstore where userid = '${userid}'`;
    cvm.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get member',
            data: data.rows
        })
    })
})

app.get('/anticov-api/getallstore', (req, res) => {
    const sql = `SELECT *, ST_X(geom) as lng, ST_Y(geom) as lat  FROM drugstore`;
    cvm.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get member',
            data: data.rows
        })
    })
})


module.exports = app;