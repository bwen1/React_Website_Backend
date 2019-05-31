const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/api/genders', (req, res) => {
    let query = `SELECT * FROM offences`;

    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        let gender = result.map((val, i) => {
            return val.gender;
        });
        console.log(gender);
        res.status(200)
            .send(gender)
            .end();
    });
});

router.get('/api/area', (req, res) => {
    let query = `SELECT * FROM offences`;

    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        let area = result.map((val, i) => {
            return val.area;
        });
        console.log(area);
        res.status(200)
            .send(area)
            .end();
    });
});

router.get('/api/ages', (req, res) => {
    let query = `SELECT * FROM offences`;

    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        let age = result.map((val, i) => {
            return val.age;
        });
        console.log(age);
        res.status(200)
            .send(age)
            .end();
    });
});

router.get('/api/years', (req, res) => {
    let query = `SELECT * FROM offences`;

    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        let years = result.map((val, i) => {
            return val.years;
        });

        console.log(years);
        res.status(200)
            .send(years)
            .end();
    });
});

router.get('/api/offences', (req, res) => {
    let query = `SELECT * FROM offence_columns`;
    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        let pretty = result.map((val, i) => {
            return val.pretty;
        });

        console.log(pretty);
        res.status(200)
            .send(pretty)
            .end();
    });
});

router.get('/api/search', (req, res) => {
    var token =
        req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                let offence = req.query.offence;
                //let offence = 'arson';
                let queryString = `SELECT area, ${offence} FROM offences`;
                const queryNames = ['age', 'gender', 'year', 'area'];
                let counter = 0;
                for (let child in req.query) {
                    if (queryNames.includes(child)) {
                        if (counter === 0) {
                            queryString += ` WHERE `;
                        } else {
                            queryString += ` AND `;
                        }

                        queryString += `${child} =  "${req.query[child]}"`;
                        counter++;
                    }
                }

                req.app.locals.db.query(queryString, (err, result) => {
                    if (err) {
                        console.log(err, result);
                        res.redirect('/');
                    }
                    console.log(result);

                    let search = result.reduce((acc, cur) => {
                        acc[cur.area] = (acc[cur.area] || 0) + cur[offence];
                        return acc;
                    }, {});

                    console.log(search);
                    res.status(200)
                        .send(search)
                        .end();
                });
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.get('/api/searchtest', (req, res) => {
    let queryString = `SELECT offences.arson, offences.area, areas.lat, areas.lng from offences 
    INNER JOIN areas ON areas.area=offences.area`;
    const queryNames = ['age', 'gender', 'year', 'area'];
    let counter = 0;
    for (let child in req.query) {
        if (queryNames.includes(child)) {
            if (counter === 0) {
                queryString += ` WHERE `;
            } else {
                queryString += ` AND `;
            }

            queryString += `${child} =  "${req.query[child]}"`;
            counter++;
        }
    }

    //console.log(queryString);
    req.app.locals.db.query(queryString, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        let search = result.reduce((acc, cur) => {
            acc[cur.area] = (acc[cur.area] || 0) + cur.arson;

            return acc;
        }, {});

        //console.log(search);
        res.status(200)
            .send(search)
            .end();
    });
});

module.exports = router;
