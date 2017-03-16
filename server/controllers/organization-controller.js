'use strict';

module.exports = function (data) {
    return {
        getAllOrganizations(req, res) {
            data.getAllOrganizations()
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getOrganizationById(req, res) {
            let id = req.params.id;

            data.getOrganizationById(id)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        createOrganization(req, res, next) {
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
