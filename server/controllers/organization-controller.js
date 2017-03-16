'use strict';

let helpers = require('../helpers');

module.exports = function (data) {
    return {
        getAll(req, res) {
            data.getAllOrganizations()
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getById(req, res) {
            let id = req.params.id;

            data.getOrganizationById(id)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getByUser(req, res) {
            let id = req.user._id;

            data.getOrganizationsByUserId(id)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        create(req, res, next) {
            let organization = req.body;

            data.createOrganization(organization)
                .then((organization) => {
                    return res.status(201).json({
                        success: true,
                        message: 'Organization created!'
                    });
                })
                .catch(errors => {
                    res.status(400)
                        .json({
                            success: false,
                            validationErrors: helpers.errorHelper(errors)
                        });
                });
        }
    };
};
