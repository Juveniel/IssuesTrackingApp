'use strict';

const mongoose = require('mongoose'),
    crypto = require('crypto'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const LETTERS = /^[A-Za-zА-Яа-я]+$/,
    ALPHA_PATTERN = /^[A-Za-zА-Яа-я0-9]+$/,
    EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let IssueSchema = new Schema({
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        minLength: [3, 'Username is too short!'],
        maxLength: [50, 'Username is too long!'],
        match: ALPHA_PATTERN
    },
    description: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean
    }
});

mongoose.model('Issue', IssueSchema);
let Issue = mongoose.model('Issue');
module.exports = Issue;