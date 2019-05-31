const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swaggerapi.json');

// Removed const db = require... as it is no longer needed.
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

logger.token('req', (req, res) => JSON.stringify(req.headers));
logger.token('res', (req, res) => {
    const headers = {};
    res.getHeaderNames().map((h) => (headers[h] = res.getHeader(h)));
    return JSON.stringify(headers);
});

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// Removed app.use(db) inn favor of persitent db connection
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
