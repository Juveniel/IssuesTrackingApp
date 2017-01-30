'use strict';
const fs = require('fs'),
    path = require('path'),
    modelFileNamesPattern = '-model.js',
    dataFileNamesPattern = '-data.js';

module.exports = function() {
    let models = {},
        data = {};

    // requiring all model files
    fs.readdirSync('./app/models')
        .filter(x => x.includes(modelFileNamesPattern))
        .forEach(file => {
            let modelName = file.charAt(0).toUpperCase() + file.substr(1, file.length - modelFileNamesPattern.length - 1);
            models[modelName] = require(path.join(__dirname, '../models', file));
        });
    
    // requiring all data files with the models
    fs.readdirSync('./app/data')
        .filter(x => x.includes(dataFileNamesPattern))
        .forEach(file => {
            let dataModule =
                require(path.join(__dirname, file))(models);

            Object.keys(dataModule)
                .forEach(key => {
                    data[key] = dataModule[key];
                });
        });

    return data;
};