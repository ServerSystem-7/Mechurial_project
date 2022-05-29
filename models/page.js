module.exports = (sequelize, Sequelize) => {
    const page = sequelize.define("pageTBL", {
        url: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    return page;
}