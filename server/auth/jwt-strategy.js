'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function (passport, app, config, data) {
    app.use(passport.initialize());
    app.use(passport.session());

    let opts = {};
    const tokenExtractor = function (req) {
        let token = '';

        if (req) {
            token = req.get('Authorization');
        }

        return token;
    };

    opts.jwtFromRequest = ExtractJwt.fromExtractors([tokenExtractor]);
    opts.secretOrKey = config.webTokenSecret;

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

        data.getUserById(jwt_payload._id)
            .then((user) => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch((err) => {
                done(err, false);
            });
    }));
};
