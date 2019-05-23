const express = require('express');
const mysql = require('mysql');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: "The World's Best Database API",
        name: 'Libb'
    });
});

router.get('/api', function(req, res, next) {
    res.render('index', { title: 'Lots of routes available' });
});

router.get('/api/random', (req, res) => {
    res.send({ randomNumber: Math.round(Math.random() * 1000) });
});

router.get('/api/city', function(req, res) {
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

module.exports = router;
