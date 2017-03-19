'use strict';
const helpers = require('../helpers'),
    environment = process.env.NODE_ENV || 'development',
    config = require('../config/config')(environment),
    Recaptcha = require('recaptcha2');

module.exports = function (data) {
    return {
        contact(req, res) {
            let contactData = req.body;

            return Promise.resolve()
                .then(() => {
                    let isRecaptchaValid = false;

                    let recaptcha = new Recaptcha(
                        {
                            siteKey: config.recaptchaKey,
                            secretKey:config.recaptchaSecret
                        });

                    recaptcha.validateRequest(req)
                        .then(function(){
                            data.sendContactMail(contactData);
                        })
                        .catch(function(errorCodes){
                            res.json({ success: false });
                        });

                    return isRecaptchaValid;
                })
                .then(() => {
                    res.status(201)
                        .json({
                            success: true,
                            message: 'Your message was successfully sent!'
                        });
                })
                .catch(error => {
                    console.log(error);
                    res.json({
                        success: false,
                        validationErrors: helpers.errorHelper(error)
                    });
                });
        }
    };
};
