'use strict';

module.exports = function(models) {
    const User = models.User,
        environment = process.env.NODE_ENV || 'development',
        config = require('../config/config')(environment),
        Mail = require('../config/mail');

    return {
        createUser(userData) {
            let user = new User(userData);

            return new Promise((resolve, reject) => {
                user.save((error) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(user);
                });
            });
        },
        getUserById(id) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: id }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        return reject(user);
                    }

                    return resolve(user);
                });
            });
        },
        findUserByIdAndUpdate(id, update) {
            return new Promise((resolve, reject) => {
                User.findOneAndUpdate({ _id: id }, update, { new: true }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        return reject(user);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByUsername(name) {
            return new Promise((resolve, reject) => {
                User.findOne({ username: name }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        return reject(user);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByEmail(email) {
            return new Promise((resolve, reject) => {
                User.findOne({ email: email }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        getUsersByNames(User, ...names) {
            return new Promise((resolve, reject) => {
                User.find({
                    name: { $in: names }
                }, (err, users) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(users);
                });
            });
        },
        getAllUsers() {
            return new Promise((resolve, reject) => {
                User.find((err, users) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(users);
                });
            });
        },
        sendContactMail(contactData) {
            let name = contactData.f_name,
                email = contactData.f_email,
                message = contactData.f_message;

            let options = {
                to: config.email,
                subject: 'You have a new contact mail from theSlyfer',
                message: `Name: ${name} Email: ${email} Message: ${message}`
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
        }
    };
};