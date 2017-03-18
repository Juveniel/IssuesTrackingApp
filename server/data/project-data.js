'use strict';

module.exports = function(models) {
    const Project = models.Project,
        mongoose = require('mongoose');

    return {
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
        }
    };
};