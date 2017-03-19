'use strict';

module.exports = function(models) {
    const Project = models.Project,
        Category = models.Category,
        Organization = models.Organization,
        mongoose = require('mongoose');

    return {
        getProjectById(id) {
            let parsedId = new mongoose.Types.ObjectId(id);

            return new Promise((resolve, reject) => {
                Project.findOne({ _id : parsedId })
                    .populate('_creator')
                    .populate('members')
                    .populate('categories')
                    .populate({
                        path: 'issues',
                        populate: [
                            { path: 'assignee', model: 'User' },
                            { path: 'category', model: 'Category' }
                        ]
                    })
                    .exec(function (err, project) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(project);
                    });
            });
        },
        getProjectsByUserId(id) {
            let parsedId = new mongoose.Types.ObjectId(id);

            return new Promise((resolve, reject) => {
                Project.find({ $or: [ { members: parsedId }, { _creator: parsedId }] })
                    .populate('_creator')
                    .populate('organization')
                    .populate('members')
                    .populate('categories')
                    .populate('issues')
                    .exec(function (err, item) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(item);
                    });
            });
        },
        createProject(projectData) {
            let project = new Project(projectData);

            return new Promise((resolve, reject) => {
                project.save((error) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(project);
                });
            });
        },
        createProjectCategory(categoryData) {
            let category = new Category(categoryData);

            return new Promise((resolve, reject) => {
                category.save((error) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(category);
                });
            });
        },
        attachCategoryToProject(projId, catId) {
            return new Promise((resolve, reject) => {
                Project.findByIdAndUpdate(
                    projId,
                    { $push: { 'categories': catId } },
                    { new : true },
                    function(error, project) {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(project);
                    }
                );
            });
        },
        getProjectAvailableUsers(projId) {
            return new Promise((resolve, reject) => {
                this.getProjectById(projId)
                    .then((project) => {
                        let parsedId = new mongoose.Types.ObjectId(project.organization);

                        Organization.findOne({ _id:  parsedId })
                            .populate('_creator')
                            .populate('members')
                            .exec(function (err, organization) {
                                if (err) {
                                    return reject(err);
                                }

                                return resolve({ project, organization });
                            });
                    });
            });
        },
        addRemoveMembersFromProject(projId, members) {
            return new Promise((resolve, reject) => {
                let parsedId = new mongoose.Types.ObjectId(projId),
                    bulk = Project.collection.initializeOrderedBulkOp();

                bulk.find({ '_id': parsedId }).updateOne({
                    $addToSet: { 'members': { $each: members.newMembers.map(mongoose.Types.ObjectId) } }
                });

                bulk.find({ '_id': parsedId }).updateOne({
                    $pullAll: { 'members': members.forDelete.map(mongoose.Types.ObjectId) }
                }, { multi: true });

                bulk.execute(function(error, project) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(project);
                });
            });
        },
        attachIssueToProject(projId, issueId) {
            return new Promise((resolve, reject) => {
                Project.findByIdAndUpdate(
                    projId,
                    { $push: { 'issues': issueId } },
                    { new : true },
                    function(error, project) {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(project);
                    }
                );
            });
        }
    };
};