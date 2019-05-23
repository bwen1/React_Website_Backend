const mysql = require('mysql');

// Exported the connection instance object
// Consider using dotenv for sensitive info
module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2535743380S',
    database: 'web_computing'
});

/*
connection.connect = (err) => {
    if (err) throw err;
};

module.exports = (req, res, next) => {
    req.db = connection;
    next();
};
*/
