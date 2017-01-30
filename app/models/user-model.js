'use strict';

const mongoose = require('mongoose'),
    crypto = require('crypto'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const LETTERS = /^[A-Za-zА-Яа-я]+$/,
    ALPHA_PATTERN = /^[A-Za-zА-Яа-я0-9]+$/,
    EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        minlength: [3, 'Username is too short!'],
        maxlength: [50, 'Username is too long!'],
        match: ALPHA_PATTERN
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        match: EMAIL_PATTERN
    },
    salt: String,
    passwordHash: {
        type: String
    },
    firstName: {
        type: String,
        required: true,
        minlength: [3, 'First mame is too short!'],
        maxlength: [50, 'First name is too long!'],
        match: LETTERS
    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, 'Last name is too short!'],
        maxlength: [50, 'Last name is too long!'],
        match: LETTERS
    },
    age: {
        type: Number
    },
    avatarUrl: {
        type: String,
        default: '/static/uploads/users/avatar.jpg'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean
    }
});

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.passwordHash = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema
    .virtual('fullName')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });

UserSchema.plugin(uniqueValidator);

UserSchema.methods = {
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: function(password) {
        if (!password) {
            return '';
        }

        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    authenticatePassword: function(password) {
        return this.encryptPassword(password) === this.passwordHash;
    }
};

mongoose.model('User', UserSchema);
let User = mongoose.model('User');
module.exports = User;