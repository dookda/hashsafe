const express = require('express');
const app = express.Router();
const Pool = require('pg').Pool

const th = new Pool({
    user: 'postgres',
    host: '119.59.125.134',
    database: 'th',
    password: 'Pgis@rti2dss@2020',
    port: 5432,
});

const ac = new Pool({
    user: 'postgres',
    host: '119.59.125.134',
    database: 'accident',
    password: 'Pgis@rti2dss@2020',
    port: 5432,
});

const cv = new Pool({
    user: 'postgres',
    host: '119.59.125.134',
    database: 'anticov',
    password: 'Pgis@rti2dss@2020',
    port: 5432,
});

const config = require('./config.json');

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

const acc_token = "uVhsU43O3AAYX2Ia76hJTHsy9d/JIWEoaYeEsRC2/mm1lVMsIt/d/4sqYNi3sKRPJA/FqtyZBCsiS3QimNpR1HCJSF9K1OyyQvrkFZ/pKI4h4uqjbh9s4r40jfyjF2pVxUBt51WxCP4q0oC3DfuNPQdB04t89/1O/w1cDnyilFU=";
app.post('/anticov-wbhook', (req, res) => {
    let reply_token = req.body.events[0].replyToken;
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {' + acc_token + '}'
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: 'Hello'
        },
        {
            type: 'text',
            text: 'How are you?'
        }]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
    res.sendStatus(200)
});


app.post('/anticov-api/insert', (req, res) => {
    const { userid, first_name, last_name, stuid, birthdate, sex, place, geom } = req.body;
    const rand1 = Math.random().toString(36).substr(2);
    const rand2 = Date.now();
    const pkid = rand1 + rand2;
    const sql = 'INSERT INTO geomember (userid,first_name,last_name,stuid,birthdate,sex,place,pkid, geom) ' +
        'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,ST_SetSRID(st_geomfromgeojson($9), 4326))';
    const val = [userid, first_name, last_name, stuid, birthdate, sex, place, pkid, geom];
    console.log(val)
    cv.query(sql, val)
        .then(() => {
            res.status(200).json({
                status: 'insert success',
            });
        })
});

app.post('/anticov-api/update', (req, res) => {
    const { userid, first_name, last_name, stuid, birthdate, sex, place, geom } = req.body;
    const sql = 'UPDATE geomember SET first_name =$2,last_name=$3,stuid=$4,birthdate=$5,sex=$6,place=$7,geom=ST_SetSRID(st_geomfromgeojson($8), 4326) ' +
        'WHERE userid=$1';
    const val = [userid, first_name, last_name, stuid, birthdate, sex, place, geom];
    // console.log(val)
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
    const sql = `SELECT gid, st_x(geom) as lng, st_y(geom) as lat FROM saveloc  WHERE inputdate >= (now() - interval '$1 hours')`;
    const val = [hr];
    cv.query(sql, val).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get disease',
            data: data.rows
        });
    })
});

app.get('/anticov-api/getmyloc/:hr', (req, res) => {
    const hr = req.params.hr;
    const sql = `SELECT gid, st_x(geom) as lng, st_y(geom) as lat FROM saveloc  WHERE inputdate >= (now() - interval '$1 hours')`;
    const val = [hr];
    cv.query(sql, val).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get disease',
            data: data.rows
        });
    })
});

app.post('/anticov-api/getaccount', (req, res) => {
    const { userid } = req.body;
    const sql = `SELECT first_name, last_name, stuid, to_char( birthdate, 'YYYY-mm-DD') as birthdate, sex FROM geomember WHERE userid = $1`;
    const val = [userid];
    cv.query(sql, val).then((data) => {
        res.status(200).json({
            status: 'success',
            message: 'get account',
            data: data.rows
        })
    })
})


module.exports = app;