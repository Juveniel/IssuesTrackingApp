'use strict';

module.exports = function(models) {
    const Issue = models.Issue;

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
        }
    };
};