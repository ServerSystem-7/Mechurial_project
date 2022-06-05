module.exports = (sequelize, Sequelize) => {
    const usertbl = sequelize.define("usertbl", {
        id: {
        type: Sequelize.STRING,
        primaryKey : true,
        allowNull:false
        },
        password: {
            type:Sequelize.STRING,
            allowNull:false,
                        
        },
        email:{
            type:Sequelize.STRING,
            allowNull:false
        }

        }, {
            sequelize,
            modelName: 'usertbl',
            freezeTableName: true,
            timestamps: false,
        });

        return usertbl;
}
