const express = require('express');
const mysql = require('mysql');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: "The World's Best Database API",
        name: 'Libb'
    });
});

router.get('/api', (req, res, next) => {
    res.render('index', { title: 'Lots of routes available' });
});

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
    let offence = req.query.offence;
    //offence = 'arson';
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

    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        console.log(result);

        let search = result.reduce((acc, cur) => {
            acc[cur.area] = (acc[cur.area] || 0) + cur[term];
            return acc;
        }, {});

        console.log(search);
        res.status(200)
            .send(search)
            .end();
    });
});

router.get('/api/searchtest', (req, res) => {
    let queryString = `SELECT area,arson FROM offences`;
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

router.post('/api/register', (req, res) => {
    //TODO: Use password hash
    let today = new Date();

    let users = {
        id: today,
        email: req.body.email,
        password: req.body.password,
        created_at: today,
        updated_at: today
    };

    connection.query(
        'INSERT INTO users SET ?',
        users,
        (error, results, fields) => {
            if (error) {
                console.log('Error', error);
                res.send({ code: 400, failed: 'error occured' });
            } else {
                console.log('results', results);
                res.send({
                    code: 200,
                    success: 'user registered successfully'
                });
            }
        }
    );
});

router.post('/api/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    connection.query(
        'SELECT * FROM users WHERE eamail = ?',
        [email],
        (error, results, fields) => {
            if (error) {
                res.send({ code: 400, failed: 'error occured' });
            } else {
                if (results.length > 0) {
                    if (results[0].password == password) {
                        res.send({
                            code: 200,
                            success: 'login successfull'
                        });
                    }
                }
            }
        }
    );
});

module.exports = router;
