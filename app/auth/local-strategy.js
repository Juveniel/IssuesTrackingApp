'use strict';

const LocalStrategy = require('passport-local');

module.exports = function (passport, app, config, data) {

    const authStrategy = new LocalStrategy(
        function (username, password, done) {
            data.getUserByUsername(username)
                .then(user => {
                    if (user && user.authenticatePassword(password)) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                })
                .catch(error => done(error, false));
        });
    
    passport.use(authStrategy);
};