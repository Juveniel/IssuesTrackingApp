'use strict';

let helpers = require('../helpers');

module.exports = function (data) {
    return {
        getByUser(req, res) {
            let id = req.user._id;

            data.getProjectsByUserId(id)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        create(req, res, next) {
            let project = req.body;

            data.createProject(project)
                .then((project) => {
                    return res.status(201).json({
                        success: true,
                        project: project,
                        message: 'Project created!'
                    });
                })
                .catch(errors => {
                    res.json({
                        success: false,
                        validationErrors: helpers.errorHelper(errors)
                    });
                });
        },
        createCategory(req, res, next) {
            let category = req.body;

            data.createProjectCategory(category)
                .then((category) => {
                    data.attachCategoryToProject(category.project, category._id);
                    
                    return category;
                })
                .then((category) => {
                    return res.status(201).json({
                        success: true,
                        category: category,
                        message: 'Project category created!'
                    });
                })
                .catch(errors => {
                    res.json({
                        success: false,
                        validationErrors: helpers.errorHelper(errors)
                    });
                });
        },
        getOrganizationUsers(req, res, next) {
            let projectId = req.params.id;

            data.getProjectAvailableUsers(projectId)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        addRemoveMembers(req, res, next) {
            let projectId = req.params.id,
                members = req.body;

            data.addRemoveMembersFromProject(projectId, members)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getProjectData(req, res, next) {
            let projectId = req.params.id;

            Promise.all([ data.getProjectById(projectId), data.getIssuePriorities()])
                .then(([project, priorities]) => {
                    return res.status(200).json({ project, priorities });
                });
        },
        createProjectIssue(req, res, next) {
            let issueData = req.body;

            let issue = {
                name: issueData.name,
                description: issueData.description,
                project: issueData.id,
                priority: issueData.priority,
                assignee: issueData.assignee,
                category: issueData.category
            };

            data.createIssue(issue)
                .then((issue) => {
                    data.attachIssueToProject(issue.project, issue._id);

                    return issue;
                })
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
