// db
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db={};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Register = require("./register.js")(sequelize, Sequelize);
db.User = require("./user.js")(sequelize, Sequelize);
db.Page = require("./page.js")(sequelize, Sequelize);

db.User.hasMany(db.Register, {
    foreignKey : 'userId',
    allowNull:false,
    constraints : true,
    onDelete:'cascade'
});
db.Page.hasMany(db.Register, {
    foreignKey : 'pageUrl',
    allowNull:false,
    constraints : true,
    onDelete: 'cascade'
});

db.Register.belongsTo(db.Page, {
    foreignKey:'pageUrl'
});
db.Register.belongsTo(db.User, {
    foreignKey:'userId'
});

module.exports=db;