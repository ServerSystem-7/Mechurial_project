module.exports = (sequelize, Sequelize) => {

    class User extends Sequelize.Model {}

    User.init({
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            // TODO: hash password using bcrypt
            // set(value) {
            //     this.setDataValue('password', hash(value));
            // },
            // TODO: proper regex
            // validate: {
            //     is: /^[0-9a-f]{64}$/i // "i": case-insenitive match
            // }
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

    return User;
}