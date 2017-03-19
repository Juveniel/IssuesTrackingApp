'use strict';

module.exports = function(models) {
    const Issue = models.Issue,
        mongoose = require('mongoose');

    return {
        getIssuePriorities() {
            return new Promise((resolve) => {
                return resolve(Issue.schema.path('priority').enumValues);
            });
        },
        createIssue(issueData) {
            let issue = new Issue(issueData);

            return new Promise((resolve, reject) => {
                issue.save((error) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(issue);
                });
            });
        },
        getOpenedProjectIssuesCount(projectId) {
            let parsedId = new mongoose.Types.ObjectId(projectId);

            return new Promise((resolve, reject) => {
                Issue.count({ project: parsedId, status: 'Open' })
                    .exec(function (err, count) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(count);
                    });
            });
        }
    };
};