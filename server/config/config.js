'use strict';

module.exports = function(environment) {
    const config = {
        development: {
            cookieName: 'test cookie',
            sessionSecret: 'secret ala bala',
            webTokenSecret: 'secret mecret',
            connectionString: 'mongodb://localhost:27017/issues-tracking-db',
            port: 3000,
            email: 'issues.tracking.app@gmail.com',
            password: 'issues123',
            recaptchaKey: '6LdqmRkUAAAAADxGMnsOj8fVAfQhAa9ECg1xsedj',
            recaptchaSecret: '6LdqmRkUAAAAAOX8oAI2_CY7bRaNAQ2b-RIdAq47'
        },
        production: {
            cookieName: process.env.COOKIE_NAME,
            sessionSecret: process.env.SESSION_SECRET,
            webTokenSecret: process.env.WEB_TOKEN_SECRET,
            connectionString: process.env.CONNECTION_STRING,
            port: process.env.PORT,
            email: process.env.EMAIL,
            password: process.env.PASSWORD
        }
    };

    return config[environment];
};