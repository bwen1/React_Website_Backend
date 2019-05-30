const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const my_key = 'mysecretkey';

/* GET users listing. */
router.get('/test', (req, res, next) => {
    res.send('respond with a resource');
});

router.post('/register', (req, res) => {
    //TODO: Use password hash
    let today = new Date();

    let users = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        created_at: today,
        updated_at: today
    };

    req.app.locals.db.query(
        'INSERT INTO users SET ?',
        users,
        (error, results, fields) => {
            if (error) {
                console.log('Error', error);
                res.send({ code: 400, error });
            } else {
                console.log('results', results);
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: users.id }, my_key, {
                    expiresIn: expiresIn
                });
                res.send({
                    code: 200,
                    success: 'user registered successfully'
                });
            }
        }
    );
});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    req.app.locals.db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results, fields) => {
            if (error) {
                res.send({ code: 400, failed: 'error occured' });
            } else {
                if (results.length > 0) {
                    if (bcrypt.compareSync(password, results[0].password)) {
                        const expiresIn = 24 * 60 * 60;
                        const accessToken = jwt.sign(
                            { id: results[0].id },
                            my_key,
                            {
                                expiresIn: expiresIn
                            }
                        );
                        res.send({
                            code: 200,
                            success: 'login successful',
                            access_token: accessToken,
                            expires_in: expiresIn
                        });
                    }
                }
            }
        }
    );
});

router.post('/login');

module.exports = router;
