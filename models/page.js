const {Sequelize, DataTypes, Model} = require('sequelize');
const config = require(__dirname + '/../config/config.js')["development"];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password, {
    host: config.host,
    dialect: config.dialect
  }
);

class Page extends Model {}

Page.init({
    url: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    }
},{
    sequelize,
    modelName: 'pageTBL',
    freezeTableName: true,
    timestamps: false,
})

// async function createInstance() {
//     await Page.sync({force: true});
//     const page1 = await Page.create({
//         url: "www.example.com"
//     })
//     console.log(page1.url)
// }

// createInstance();