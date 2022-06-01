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

class User extends Model {}

User.init({
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', hash(value));
        },
        // TODO: validation
        validate: {
            is: /^[0-9a-f]{64}$/i
          }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: 'userTBL',
    freezeTableName: true,
    timestamps: false,
})

// async function createInstance() {
//     await User.sync({force: true});
//     const user1 = await User.create({
//         id: "mjkim",
//         password: "mypassword",
//         email: "hello@gmail.com"
//     })
//     console.log(user1.password)
// }

// createInstance();