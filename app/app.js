'use strict';

const environment = process.env.NODE_ENV || 'development',
    config = require('./config/config')(environment),
    app = require('./config/application')(config),
    data = require('./data')();

require('./config/database')(config.connectionString);
require('./auth')(app, config, data);
require('./router')(app, config, data);

app.start();