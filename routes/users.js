const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const app = require('../app');
const mysecretkey = 'mysecretkey';
// Register route
router.post('/register', (req, res) => {
    let today = new Date();
    // Create new user with following params
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
                res.send({ code: 400, message: 'Error occured' });
            } else {
                console.log('results', results);
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: users.id }, mysecretkey, {
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
// Login route
router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    req.app.locals.db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results, fields) => {
            if (error) {
                res.send({ code: 400, failed: 'Error occured' });
            } else {
                if (results.length > 0) {
                    // Compares password, and if passed creates a token
                    if (bcrypt.compareSync(password, results[0].password)) {
                        const expiresIn = 24 * 60 * 60;
                        const accessToken = jwt.sign(
                            { id: results[0].id },
                            mysecretkey,
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

module.exports = router;
