'use strict';

const mongoose = require('mongoose'),
    crypto = require('crypto'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const LETTERS = /^[A-Za-zА-Яа-я]+$/,
    ALPHA_PATTERN = /^[A-Za-zА-Яа-я0-9]+$/,
    EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const { organizationSchema } = require('./organization-model');

let UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        minLength: [3, 'Username is too short!'],
        maxLength: [50, 'Username is too long!'],
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
    role: {
        type: String,
        default: 'admin'
    },
    firstName: {
        type: String,
        minLength: [3, 'First mame is too short!'],
        maxLength: [50, 'First name is too long!'],
        match: LETTERS
    },
    lastName: {
        type: String,
        minLength: [3, 'Last name is too short!'],
        maxLength: [50, 'Last name is too long!'],
        match: LETTERS
    },
    age: {
        type: Number
    },
    avatarUrl: {
        type: String,
        default: 'avatar.jpg'
    },
    organizations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }],
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

UserSchema.path('passwordHash').validate(function() {
    if (this._password) {
        if (this._password.length < 6) {
            this.invalidate('password', 'password must be at least 6 characters.');
        }
    }

    if (!this._password) {
        this.invalidate('password', 'password is required');
    }
}, null);

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