#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('./app');
const debug = require('debug')('api:server');
const https = require('https');
const http = require('http');
const fs = require('fs');

// Required the database here for database details
const database = require('./database/db');
/**
 * Get port from environment and store in Express.
 */

// Used parseInt over normalizePort
const port = parseInt(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

//HTTPS NOT WORKING
/*const privateKey = fs.readFileSync('./sslcert/cert.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};*/
const server = http.createServer(/*credentials.*/ app);

/**
 * Listen on provided port, on all network interfaces.
 */

// Wrapped the server listener and other functions in database connection
database.connect((err) => {
    err ? console.log(err) : false;
    app.locals.db = database;
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    normalizePort = (val) => {
        const port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    };

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        const addr = server.address();
        const bind =
            typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
        console.log('Server running on port:', port);
    }
});
