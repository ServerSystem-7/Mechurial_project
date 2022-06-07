module.exports = (sequelize, Sequelize) => {
    const User = require("./user.js")(sequelize, Sequelize)

    class Register extends Sequelize.Model {}

    Register.init({
        regNumber: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
            validation: {isUrl: true}
        },
        key1: {
            type: Sequelize.STRING,
            allowNull: false
        },
        key2: {
            type: Sequelize.STRING
        },
        key3: {
            type: Sequelize.STRING
        },
        notifyLogic: {
            type: Sequelize.STRING,
            allowNull: false,
            isIn: [['and', 'or']]
        },
        siteName: {
            type: Sequelize.STRING
        },
        dueDate: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            isDate: true, 
            // TODO
            // isAfter: () => {
            //     let today = new Date();
            //     let dd = String(today.getDate()).padStart(2, '0');
            //     let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            //     let yyyy = today.getFullYear();
            //     return mm + '/' + dd + '/' + yyyy;
            // },
        },
        dueTime: {
            type: Sequelize.STRING,  // TODO: type 수정해야함!
            allowNull: false
        },
        userId: {
            type: Sequelize.STRING,
            references: {
                model: User,
                key: 'id'
            }
        },
    },{
        sequelize,
        modelName: 'registerTBL',
        freezeTableName: true,
        timestamps: false,
    });
    return Register;
}
