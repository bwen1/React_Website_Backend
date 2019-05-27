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
    // const { term } = req.query; // Better syntax
    //const term = req.query.term;
    //res.send(['brisbane', 'sydney']);
    //const query = `SELECT * FROM world.city WHERE name = "${term}"`;
    let query = `SELECT * FROM offence_columns`;
    //var table = ['city'];

    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        let pretty = result.map((val, i) => {
            return val.pretty; // Will save all the pretty text into the variable 'pretty' as an array
        });

        console.log(pretty);
        res.status(200)
            .send(pretty)
            .end();
    });
});

router.get('/api/search', (req, res) => {
    let term = req.query.term;
    //term = 'arson';
    let query = `SELECT area, ${term} FROM offences`;
    console.log(query);

    //let query = `SELECT * FROM world.city WHERE name = "${term}"`;

    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        console.log(result);
        // TODO: Implement filters
        let search = result.reduce((acc, cur) => {
            acc[cur.area] = acc[cur.area] || 0 + cur[term];
            return acc;
        }, {});

        console.log(search);
        res.status(200)
            .send(search)
            .end();
    });
});

router.get('/api/searchtest', (req, res) => {
    // const { term } = req.query; // Better syntax
    //const term = req.query.term;
    //res.send(['brisbane', 'sydney']);
    //const query = `SELECT * FROM world.city WHERE name = "${term}"`;
    let query = `SELECT area,arson FROM offences`;
    //var table = ['city'];

    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result);
            res.redirect('/');
        }
        //console.log(result);
        let search = result.reduce((acc, cur) => {
            acc[cur.area] = acc[cur.area] || 0 + cur.arson;
            return acc;
        }, {});

        console.log(search);
        res.status(200)
            .send(search)
            .end();
    });
});

module.exports = router;
