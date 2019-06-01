const express = require('express');
const mysql = require('mysql');

const router = express.Router();

// Helper routes
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

// Offences route
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

// Search route
router.get('/api/search', (req, res) => {
    // Check it token exists
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
                    let name = result.map((item) => {
                        return item.area;
                    });

                    let latitude = result.map((item) => {
                        return item.lat;
                    });

                    let longitude = result.map((item) => {
                        return item.lng;
                    });
                    let index;

                    // For loop to remove duplicates
                    let unique_latitude = [];
                    let unique_longitude = [];
                    for (let i = 0; i < latitude.length; i++) {
                        if (name[i] === index) {
                            continue;
                        } else {
                            index = name[i];
                            unique_latitude.push(latitude[i]);
                            unique_longitude.push(longitude[i]);
                        }
                    }

                    // Compile into an object
                    const ress = Object.entries(search).map(
                        ([key, value], index) => ({
                            LGA: key,
                            total: value,
                            lat: unique_latitude[index],
                            lng: unique_longitude[index]
                        })
                    );

                    const ret_data = { result: ress };
                    console.log(ret_data);
                    /* for (let LGA of search) [];*/

                    //console.log(ret_data);
                    res.status(200)
                        .send(ret_data)
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

// Test route
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

        let name = result.map((item) => {
            return item.area;
        });

        let latitude = result.map((item) => {
            return item.lat;
        });

        let longitude = result.map((item) => {
            return item.lng;
        });
        let index;

        // For loop to remove duplicates
        let unique_latitude = [];
        let unique_longitude = [];
        for (let i = 0; i < latitude.length; i++) {
            if (name[i] === index) {
                continue;
            } else {
                index = name[i];
                unique_latitude.push(latitude[i]);
                unique_longitude.push(longitude[i]);
            }
        }

        // Compile into an object
        const ress = Object.entries(search).map(([key, value], index) => ({
            LGA: key,
            total: value,
            lat: unique_latitude[index],
            lng: unique_longitude[index]
        }));

        const ret_data = { result: ress };
        console.log(ret_data);
        /* for (let LGA of search) [];*/

        //console.log(ret_data);
        res.status(200)
            .send(ret_data)
            .end();
    });
});

module.exports = router;
