'use strict';

module.exports = function(models) {
    const Organization = models.Organization,
        mongoose = require('mongoose');

    return {
        getAllOrganizations() {
            return new Promise((resolve, reject) => {
                Organization.find((err, organizations) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(organizations);
                });
            });
        },
        getOrganizationById(id) {
            return new Promise((resolve, reject) => {
                Organization.findOne({ _id: id }, (err, organization) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!organization) {
                        return reject(organization);
                    }

                    return resolve(organization);
                });
            });
        },
        getOrganizationsByUserId(id) {
            let parsedId = new mongoose.Types.ObjectId(id);

            return new Promise((resolve, reject) => {
                Organization.find({ $or: [ { members: parsedId }, { _creator: parsedId }] })
                    .populate('_creator')
                    .populate('members')
                    .exec(function (err, item) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(item);
                    });
            });
        },
        createOrganization(organizationData) {
            let organization = new Organization(organizationData);

            return new Promise((resolve, reject) => {
                organization.save((error) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(organization);
                });
            });
        },
        attachMemberToOrganization(orgId, userId) {

            return new Promise((resolve, reject) => {
                Organization.findByIdAndUpdate(
                    orgId,
                    { $push: { 'members': userId } },
                    { new : true },
                    function(error, organization) {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(organization);
                    }
                );
            });
        }
    };
};