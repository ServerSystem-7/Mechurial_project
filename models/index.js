// db
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db={};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.registerTBL = require("./register.js")(sequelize, Sequelize);
db.userTBL = require("./user.js")(sequelize, Sequelize);
db.pageTBL = require("./page.js")(sequelize, Sequelize);

db.userTBL.hasMany(db.registerTBL, {
    foreignKey : 'userId',
    allowNull:false,
    constraints : true,
    onDelete:'cascade'
});
db.pageTBL.hasMany(db.registerTBL, {
    foreignKey : 'pageUrl',
    allowNull:false,
    constraints : true,
    onDelete: 'cascade'
});

db.registerTBL.belongsTo(db.pageTBL, {
    foreignKey:'pageUrl'
});
db.registerTBL.belongsTo(db.userTBL, {
    foreignKey:'userId'
});

module.exports=db;