'use strict';

let helpers = require('../helpers');

module.exports = function (data) {
    return {
        getIssue(req, res, next) {
            let id = req.params.issueId;

            Promise.all([ data.getIssueById(id), data.getIssuePriorities(), data.getIssueStatuses()])
                .then(([issue, priorities, statuses]) => {
                    return res.status(200).json({ issue, priorities, statuses });
                });
        },
        updateIssue(req, res) {
            let issueData = req.body;
            
            data.updateIssue(issueData)
                .then((issue) => {
                    return res.status(201).json({
                        success: true,
                        issue: issue,
                        message: 'Issue category created!'
                    });
                })
                .catch(errors => {
                    res.json({
                        success: false,
                        validationErrors: helpers.errorHelper(errors)
                    });
                });
        }
    };
};
