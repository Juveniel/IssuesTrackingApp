'use strict';

const passport = require('passport');

module.exports = {
    isJwtAuthenticated: (req, res, next) => {
        return passport.authenticate('jwt', { session: false });
    },

    isInRole: (role) =>
        (req, res, next) => {
            if (req.user && req.user.role === role) {
                next();
            } else {
                return res.status(400)
                    .json({
                        success: false,
                        message: 'You do not have the right permissions!'
                    });
            }
        }
};