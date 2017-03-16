'use strict';

module.exports = function(app, passport, express, data, auth) {
    let userRouter = new express.Router(),
        userController = require('../controllers/user-controller')(data);

    userRouter
        .get('/login', userController.getLogin)
        .get('/register', userController.getRegister)
        .get('/profile', userController.getProfile)
        .post('/profile', userController.updateProfile)
        .get('/unauthorized', userController.getUnauthorized);

    app.use('/api/users/', userRouter);
};