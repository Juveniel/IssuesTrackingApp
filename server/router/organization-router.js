'use strict';

module.exports = function(app, passport, express, data, auth) {
    let organizationRouter = new express.Router(),
        organizationController = require('../controllers/organization-controller')(data);

    organizationRouter
        .post('/create', auth.isJwtAuthenticated(), auth.isInRole('admin') , organizationController.create)
        .post('/:id/add', auth.isJwtAuthenticated(), auth.isInRole('admin') , organizationController.addMember)
        .get('/list', passport.authenticate('jwt'), organizationController.getByUser);

    app.use('/api/organizations', organizationRouter);
};
