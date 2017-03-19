'use strict';

module.exports = function(models) {
    const Issue = models.Issue,
        mongoose = require('mongoose');

    return {
        getIssueById(id) {
            let parsedId = new mongoose.Types.ObjectId(id);

            return new Promise((resolve, reject) => {
                Issue.findOne({ _id: parsedId })
                    .populate({
                        path: 'project',
                        populate: [
                            { path: 'members', model: 'User' },
                            { path: 'categories', model: 'Category' }
                        ]
                    })
                    .populate('category')
                    .populate('assignee')
                    .exec(function (err, issue) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(issue);
                    });
            });
        },
        getIssuePriorities() {
            return new Promise((resolve) => {
                return resolve(Issue.schema.path('priority').enumValues);
            });
        },
        getIssueStatuses() {
            return new Promise((resolve) => {
                return resolve(Issue.schema.path('status').enumValues);
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
        updateIssue(issueData) {
            return new Promise((resolve, reject) => {
                let issueId = issueData.issueId,
                    issueUpdate = {
                        name: issueData.name,
                        description: issueData.description,
                        priority: issueData.priority,
                        assignee: mongoose.Types.ObjectId(issueData.assignee),
                        category: mongoose.Types.ObjectId(issueData.category),
                        status: issueData.status
                    };

                Issue.findByIdAndUpdate(
                    issueId,
                    issueUpdate,
                    { new: true, runValidators: true },
                    function (error, issue) {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(issue);
                    }
                );
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