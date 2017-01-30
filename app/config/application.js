'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    path = require('path');

/* Setup App */
module.exports = function(config){
    let app = express();

    /* View Engine */
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../views'));
    app.use('/static', express.static(path.join(__dirname, '../../public')));

    /* Cookies & session */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true
    }));
    
    /* App start f */
    app.start = function(){
        const port = config.port;
        app.listen(port, () => console.log(`App running at: http://localhost:${port}`));
    };

    return app;
};
