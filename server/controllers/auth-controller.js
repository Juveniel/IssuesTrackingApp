'use strict';
const passport = require('passport'),
    helpers = require('../helpers'),
    environment = process.env.NODE_ENV || 'development',
    config = require('../config/config')(environment),
    jwt = require('jsonwebtoken');

module.exports = function(data) {
    const webTokenSecret = config.webTokenSecret;

    return {
        login(req, res) {
            let username = req.body.username;
            let password = req.body.password;

            data.getUserByEmail(username)
                .then(user => {

                    if (user === null || !user.authenticatePassword(password)) {
                        return res.json({
                            success: false,
                            message: 'Wrong username or password!'
                        });
                    }

                    const webTokenObject = {
                        _id: user._id,
                        username: user.username
                    };

                    return res.status(200).json({
                        success: true,
                        _id: user._id,
                        username: user.username,
                        auth_token: jwt.sign(webTokenObject, webTokenSecret)
                    });
                })
                .catch(error => {
                    res.status(400)
                        .send(JSON.stringify({ validationErrors: error }));
                });
        },
        logout(req, res) {
            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        res.redirect('/home');
                    } else {
                        req.logout();
                        res.redirect('/home');
                    }
                });
        },
        register(req, res) {
            const user = req.body;

            return Promise.resolve()
                .then(() => {
                    if (!req.isAuthenticated()) {
                        return data.createUser(user);
                    } else {
                        res.json({ redirectRoute: '#/home' });
                    }
                })
                .then(() => {
                    res.status(201)
                        .json({
                            success: true,
                            redirectRoute: '#/dashboard/profile'
                        });
                })
                .catch(error => {
                    res.json({
                        success: false,
                        validationErrors: helpers.errorHelper(error)
                    });
                });
        },
        checkAuthentication(req, res) {
            let token = req.headers.authorization;

            if (token && token !== 'null') {
                let decoded = jwt.decode(token, config.webTokenSecret);

                return data.getUserByUsername(decoded.username)
                    .then((user) => {
                        if (!user) {
                            return res.json({ success: false, message: 'No user.' });
                        } else {
                            res.json({
                                success: true,
                                user: {
                                    token,
                                    username: user.username,
                                    _id: user._id
                                }
                            });
                        }
                    })
                    .catch(error => {
                        res.status(400)
                            .send(JSON.stringify({ error: error }));
                    });
            }
            else {
                return res.json({ success: false, message: 'No token provided!' });
            }
        },
        getLoggedUser(req, res) {
            if (!req.user) {
                return res.status(200).json({
                    success: false,
                    message: 'Please provide token'
                });
            }

            let user = {
                username: req.user.username,
                _id: req.user._id
            };

            return res.status(200).json({
                success: true,
                user: user
            });
        },
        getUserRole(req, res) {
            return res.status(200).json(req.user.role);
        }
    };
};