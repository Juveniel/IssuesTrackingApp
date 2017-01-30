'use strict';

const helpers = require('../helpers');

module.exports = function(data) {
    return {
        getLogin(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.render('user/login', {});
                    } else {
                        res.redirect('/home');
                    }
                });
        },
        getRegister(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.render('user/register', {});
                    } else {
                        res.redirect('/home');
                    }
                });
        },
        getProfile(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.status(401).redirect('/unauthorized');
                    } else {
                        if (req.user.role === 'admin') {
                            res.render('user/profile', { user: req.user, isAdmin: true });
                        } else {
                            res.render('user/profile', { user: req.user, isAdmin: false });
                        }
                    }
                });
        },
        updateProfile(req, res) {
            const updatedUser = req.body;

            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.redirect('/home');
                    } else {
                        return data.findUserByIdAndUpdate(req.user._id, updatedUser);
                    }
                })
                .then(user => {
                    res.status(200)
                        .send({ redirectRoute: '/profile' });
                })
                .catch(err => {
                    res.status(400)
                        .send(JSON.stringify({ validationErrors: helpers.errorHelper(err) }));
                });
        },
        getUnauthorized(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.render('unathorized', {});
                    } else {
                        res.redirect('/home');
                    }
                });
        }
    };
};