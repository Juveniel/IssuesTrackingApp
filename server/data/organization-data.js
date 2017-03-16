'use strict';

module.exports = function(models) {
    const Organization = models.Organization;

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
        }
    };
};