const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config.js')[env];
const db={};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.registerTBL = require("./register.js")(sequelize, Sequelize);
db.userTBL = require("./user.js")(sequelize, Sequelize);
db.pageTBL = require("./page.js")(sequelize, Sequelize);

module.exports=db;