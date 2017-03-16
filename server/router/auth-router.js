'use strict';

module.exports = function(app, passport, express, data, auth) {
    let userRouter = new express.Router(),
        authController = require('../controllers/auth-controller')(data);

    userRouter
        .post('/login', authController.login)
        .post('/register', authController.register)
        .get('/verify', authController.checkAuthentication)
        .get('/getLoggedUser', auth.isJwtAuthenticated(), authController.getLoggedUser);

    app.use('/api/auth', userRouter);
};