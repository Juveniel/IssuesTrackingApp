'use strict';

module.exports = function(app, passport, express, data, auth) {
    let projectRouter = new express.Router(),
        projectController = require('../controllers/project-controller')(data);

    projectRouter
        .post('/create', auth.isJwtAuthenticated(), auth.isInRole('admin') , projectController.create)
        .post('/:id/categories/create', auth.isJwtAuthenticated(), auth.isInRole('admin') , projectController.createCategory)
        .post('/:id/members/add', auth.isJwtAuthenticated(), auth.isInRole('admin') , projectController.addRemoveMembers)
        .post('/:id/issues/create', auth.isJwtAuthenticated(), projectController.createProjectIssue)
        .get('/:id/users', auth.isJwtAuthenticated(), auth.isInRole('admin') , projectController.getOrganizationUsers)
        .get('/:id/data', auth.isJwtAuthenticated(), projectController.getProjectData)
        .get('/list', passport.authenticate('jwt'), projectController.getByUser);

    app.use('/api/projects', projectRouter);
};
