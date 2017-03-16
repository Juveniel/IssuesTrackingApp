'use strict';

const mongoose = require('mongoose'),
    crypto = require('crypto'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const ALPHA_PATTERN = /^[A-Za-zА-Яа-я0-9]+$/;

let OrganizationSchema = new Schema({
    _creator: String,
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        minLength: [3, 'Username is too short!'],
        maxLength: [50, 'Username is too long!'],
        match: ALPHA_PATTERN
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean
    }
});

mongoose.model('Organization', OrganizationSchema);
let Organization = mongoose.model('Organization');
module.exports = Organization;