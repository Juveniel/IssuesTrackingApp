'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const ALPHA_PATTERN = /^[A-Za-zА-Яа-я0-9]+$/;

let OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        minLength: [3, 'Name is too short!'],
        maxLength: [50, 'Name is too long!'],
        match: ALPHA_PATTERN
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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