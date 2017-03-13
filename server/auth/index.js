'use strict';

const passport = require('passport');

module.exports = function(app, config, data) {

    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user.id);
        }
    });

    passport.deserializeUser((userId, done) => {
        data.getUserById(userId)
            .then(user => done(null, user || false))
            .catch(error => done(error, false));
    });

    require('./local-strategy')(passport, app, config, data);
    require('./jwt-strategy')(passport, app, config, data);
};
