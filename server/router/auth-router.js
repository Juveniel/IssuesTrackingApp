'use strict';

module.exports = function(app, passport, express, data) {
    let userRouter = new express.Router(),
        authController = require('../controllers/auth-controller')(data);

    userRouter
        .post('/login', authController.login)
        .post('/register', authController.register);

    app.use('/api/auth', userRouter);
};