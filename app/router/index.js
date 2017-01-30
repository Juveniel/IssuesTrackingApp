'use strict';

const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    passport = require('passport');

const routerFileNamesPattern = '-router.js';

module.exports = function (app, config, data) {
    fs.readdirSync('./app/router')
        .filter(file => file.includes(routerFileNamesPattern))
        .forEach(file => require(path.join(__dirname, file))(app, passport, express, data));
};
