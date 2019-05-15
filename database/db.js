const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2535743380S',
    database: 'web_computing'
});

connection.connect = (err) => {
    if (err) throw err;
};

module.exports = (req, res, next) => {
    req.db = connection;
    next();
};
