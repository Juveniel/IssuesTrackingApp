'use strict';

module.exports = function(environment) {
    const config = {
        development: {
            cookieName: 'test cookie',
            sessionSecret: 'secret ala bala',
            connectionString: 'mongodb://localhost:27017/issues-tracking-db',
            port: 3000,
            email: '',
            password: ''
        },
        production: {
            cookieName: process.env.COOKIE_NAME,
            sessionSecret: process.env.SESSION_SECRET,
            connectionString: process.env.CONNECTION_STRING,
            port: process.env.PORT,
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        }
    };

    return config[environment];
};