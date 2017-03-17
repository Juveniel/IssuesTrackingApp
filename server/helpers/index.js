'use strict';

const util = require('util');

let helpers = {};

helpers.errorHelper = function (err) {
    let errors = [],
        messages = {
            'required': '%s is required.',
            'min': '%s below minimum.',
            'max': '%s above maximum.',
            'enum': '%s not an allowed value.',
            'unique': '%s already exists.',
            'regexp': '%s contains illegal characters!'
        };

    // MongoError message for unique validation
    if (err.name === 'MongoError' && err.message.indexOf('duplicate key') !== -1) {
        // extracting the field that caused the error
        let msg = err.message,
            findWrongFieldNamePattern = 'index: ',
            indexOfFieldName = msg.indexOf(findWrongFieldNamePattern),
            secondPartMsg = msg.substring(indexOfFieldName + findWrongFieldNamePattern.length, msg.length - 1),
            fieldName = secondPartMsg.substring(0, secondPartMsg.indexOf('_'));

        errors.push(util.format(
            messages.unique,
            fieldName)
        );

        return errors;
    }

    if (err.name !== 'ValidationError') {
        return err;
    }
    
    console.dir(err);

    Object.keys(err.errors).forEach(function (field) {
        let eObj = err.errors[field];
        if (!messages.hasOwnProperty(eObj.properties.type)) {
            
            errors.push(eObj.properties.message);
        } else {
            errors.push(util.format(
                messages[eObj.properties.type],
                eObj.properties.path)
            );
        }
    });

    return errors;
};

helpers.utilsHelper = {
    generateRandomPassword: function() {
        return Math.random().toString(36).slice(-8);
    }
};

module.exports = helpers;
