'use strict';

module.exports = function(app, passport, express, data, auth) {
    let organizationRouter = new express.Router(),
        organizationController = require('../controllers/organization-controller')(data);

    organizationRouter
        .post('/create', passport.authenticate('jwt'), organizationController.create)
        .get('/list', passport.authenticate('jwt'), organizationController.getAll);

    app.use('/api/organization', organizationRouter);
};
