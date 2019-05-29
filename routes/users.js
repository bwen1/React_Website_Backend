var express = require('express');
const mysql = require('mysql');

var router = express.Router();

/* GET users listing. */
router.get('/test', (req, res, next) => {
    res.send('respond with a resource');
});

/*router.post('/api/register', (req, res) => {
    let today = new Date();

    let users = {
        id: today,
        email: 'test',
        password: 'test',
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
});*/

router.post('/login');

module.exports = router;
