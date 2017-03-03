'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    path = require('path'),
    cors = require('cors');

/* Setup App */
module.exports = function(config){
    let app = express();

    /* View Engine */
    //app.use('/', express.static(path.join(__dirname, '../../public')));

    /* Cookies & session */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true
    }));

    /* CORS */
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Credentials', true);

        next();
    });
    app.options('*', cors());
    
    /* App start func */
    app.start = function(){
        const port = config.port;
        app.listen(port, () => console.log(`App running at: http://localhost:${port}`));
    };

    return app;
};
