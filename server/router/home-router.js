'use strict';

module.exports = function(app, passport, express, data, auth) {
    let homeRouter = new express.Router(),
        homeController = require('../controllers/home-controller')(data);

    homeRouter
        .post('/contact', homeController.contact);

    app.use('/api/home', homeRouter);
};