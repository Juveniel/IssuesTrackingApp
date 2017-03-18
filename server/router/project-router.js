'use strict';

module.exports = function(app, passport, express, data, auth) {
    let projectRouter = new express.Router(),
        projectController = require('../controllers/project-controller')(data);

    projectRouter
        .post('/create', auth.isJwtAuthenticated(), auth.isInRole('admin') , projectController.create)
        .get('/list', passport.authenticate('jwt'), projectController.getByUser);

    app.use('/api/projects', projectRouter);
};
