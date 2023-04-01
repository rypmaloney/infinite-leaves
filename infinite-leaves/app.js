require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const socketIO = require('./controllers/socket');
const cors = require('cors');

const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');

const app = express();

if (process.env.NODE_ENV === 'development') {
    const allowedOrigin = process.env.ALLOWED_ORIGIN;
    app.use(
        cors({
            origin: allowedOrigin,
        })
    );
} else {
    app.use(cors());
}

// Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = `${process.env.DB_URI}`;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'log',
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/build')));

app.use('/data', express.static(path.join(__dirname, 'public/data')));

// Routers
app.use('/', indexRouter);
app.use('/about', aboutRouter);

// Create the http server
const server = require('http').createServer(app);
// Set up socket.io
socketIO(server);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = { app: app, server: server };
