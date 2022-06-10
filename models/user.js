module.exports = (sequelize, Sequelize) => {

    class userTBL extends Sequelize.Model {}

    userTBL.init({
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            // TODO: hash password with passport
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {isEmail: true}
        }
    },{
        sequelize,
        modelName: 'userTBL',
        freezeTableName: true,
        timestamps: false,
    });

    return userTBL;
}