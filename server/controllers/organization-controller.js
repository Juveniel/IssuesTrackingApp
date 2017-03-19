'use strict';

let helpers = require('../helpers'),
    Mail = require('../config/mail');

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
                        organization: organization,
                        message: 'Organization created!'
                    });
                })
                .catch(errors => {
                    res.json({
                        success: false,
                        validationErrors: helpers.errorHelper(errors)
                    });
                });
        },
        addMember(req, res, next) {
            let organizationId = req.params.id,
                userData = req.body;

            // Generate random password for the new member
            userData.password = helpers.utilsHelper.generateRandomPassword();

            // Set member role
            userData.role = 'member';

            return Promise.resolve()
                .then(() => {
                    return data.createUser(userData); 
                })
                .then((user) => {
                    console.log(user);
                    console.log(user.password);

                    let options = {
                        to: `${user.email}`,
                        subject: 'Your theSlyfer account has been created',
                        message: `Credentials: username ${user.email} password: ${user.password}`
                    };

                    let mail = new Mail({
                        to: options.to,
                        subject: options.subject,
                        message: options.message,
                        successCallback: function(success) {
                            console.log('email sent');
                        },
                        errorCallback: function(err) {
                            console.log('error: ' + err);
                        }
                    });

                    mail.send();

                    return user;
                })
                .then((user) => {
                    return data.attachMemberToOrganization(organizationId, user._id);
                })
                .then((organization) => {
                    return res.status(201).json({
                        success: true,
                        organization: organization,
                        message: 'Organization member added successfully!'
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
