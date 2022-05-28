module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("userTBL", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    return user;
}