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

    /**
     * _______________ DELETE COMMENT BLOCK ________________
     * Used req.app.locals.db.query rather than db.query to access persitent
     *  database connection object
     * 
     * I noticed there were some issues in this file regarding the databse
     *  connection. Firstly, i see that you've required mysql although you 
     *  haven't connected to the databse. Which is why you're getting the 
     *  'db not found' error. If you required db from '../database/db' instead
     *  i think the query may have worked.
     * 
     * The only problem with that though is every time an api request is made
     *  you'll be creating a new databse connection, which is resource intensive.
     * 
     * I've saved the database connection to app.locals.db so it is kept open as
     *  a form of pipe or socket which will open and close as the server does. This
     *  way you're saving resources and theres only ever one connection to the db.
     */
    req.app.locals.db.query(query, (err, result) => {
        if (err) {
            console.log(err, result)
            //res.redirect('/');
        }
        console.log(result)
    });
});

module.exports = router;
