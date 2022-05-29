module.exports = (sequelize, Sequelize) => {
    const register = sequelize.define("registerTBL", {
        regNumber: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
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
            allowNull: false
        },
        siteName: {
            type: Sequelize.STRING
        },
        dueDate: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dueTime: {
            type: Sequelize.STRING,  // type 수정 필요!
            allowNull: false
        },
        // userID: {
        //     type: Sequelize.STRING,
        //     references: {
        //         model: User,  // not defined?
        //         key: "id"
        //     }
        // },
        // pageUrl: {
        //     type: Sequelize.STRING,
        //     references: {
        //         model: Page,  // not defined?
        //         key: "url"
        //     }
        // },
    }, {
        timestamps: false,
        freezeTableName: true
    });
    return register;
}