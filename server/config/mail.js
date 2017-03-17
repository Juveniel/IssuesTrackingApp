'use strict';

let nodemailer = require('nodemailer'),
    environment = process.env.NODE_ENV || 'development',
    config = require('./config')(environment);

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email,
        pass: config.password
    }
});

module.exports = function(params) {

    this.send = function(){
        let options = {
            from : this.from,
            to : params.to,
            subject : params.subject,
            text : params.message
        };

        transporter.sendMail(options, function(err, info){
            err ? params.errorCallback(err) : params.successCallback(info.response);
        });
    };
};
