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

// import user, page
const Page = require("./page.js")(sequelize, Sequelize);  // init도??

class Register extends Model {}

Register.init({
    regNumber: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    key1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    key2: {
        type: DataTypes.STRING
    },
    key3: {
        type: DataTypes.STRING
    },
    notifyLogic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    siteName: {
        type: DataTypes.STRING
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    dueTime: {
        type: DataTypes.STRING,  // TODO: type 수정해야함!
        allowNull: false
    },
    // userId: {  // TODO: foreign key
    //     type: DataTypes.STRING,
    //     references: {
    //         model: User,
    //         key: 'id'
    //     }
    // },
    // pageUrl: {
    //     type: DataTypes.STRING,
    //     references: {
    //         model: Page,
    //         key: 'url'
    //     }
    // }
},{
    sequelize,
    modelName: 'registerTBL',  // db
    freezeTableName: true,
    timestamps: false,
})

// async function createInstance() {
//     await Register.sync({alter:true});
//     const reg1 = await Register.create({
//         // url: "www.example.com"
//         key1: "외국인",
//         key2: "안녕",
//         key3: "잘가",
//         notifyLogic: "or",
//         siteName: "성신입학",
//         dueDate: '2022-05-30',
//         dueTime: '11:00:00'
//     })
//     console.log(reg1.key1)
// }

// createInstance();
