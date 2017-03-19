'use strict';

module.exports = function(app, passport, express, data, auth) {
    let issueRouter = new express.Router(),
        issueController = require('../controllers/issue-controller')(data);

    issueRouter
        .get('/:issueId', auth.isJwtAuthenticated(), issueController.getIssue)
        .post('/:issueId', auth.isJwtAuthenticated(), issueController.updateIssue);

    app.use('/api/issues', issueRouter);
};
