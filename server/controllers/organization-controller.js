'use strict';

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
        create(req, res, next) {
            let name = req.body.name;

            data.createOrganization(name)
                .then((organization) => {
                    return res.status(201).json({
                        success: true,
                        message: 'Article created!'
                    });
                });
        }
    };
};
