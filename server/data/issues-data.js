'use strict';

module.exports = function(models) {
    const Issue = models.Issue;

    return {
        getIssuePriorities() {
            return new Promise((resolve) => {
                return resolve(Issue.schema.path('priority').enumValues);
            });
        }
    };
};