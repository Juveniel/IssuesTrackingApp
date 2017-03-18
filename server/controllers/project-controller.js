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
        }
    };
};
