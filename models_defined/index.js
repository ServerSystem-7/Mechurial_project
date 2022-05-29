'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.page = require("./page.js")(sequelize, Sequelize);
db.register = require("./register.js")(sequelize, Sequelize);
db.user = require("./user.js")(sequelize, Sequelize);

module.exports = db;

